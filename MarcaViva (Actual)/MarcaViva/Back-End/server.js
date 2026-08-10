// Servidor MarcaViva — serve as páginas estáticas e persiste as credenciais
// de usuários em um banco SQLite dentro da pasta "DBA - Credentials".
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const Database = require('better-sqlite3');

const RAIZ = path.join(__dirname, '..');
const PASTA_DB = path.join(RAIZ, 'DBA - Credentials');
const CAMINHO_DB = path.join(PASTA_DB, 'marcaviva.db');

require('fs').mkdirSync(PASTA_DB, { recursive: true });

const db = new Database(CAMINHO_DB);
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa TEXT NOT NULL,
    nicho TEXT NOT NULL,
    usuario TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    senha_salt TEXT NOT NULL,
    criado_em TEXT NOT NULL
  );
`);

function gerarHash(senha, salt) {
  return crypto.scryptSync(senha, salt, 64).toString('hex');
}

function criarUsuario({ empresa, nicho, usuario, senha }) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = gerarHash(senha, salt);
  const stmt = db.prepare(`
    INSERT INTO usuarios (empresa, nicho, usuario, senha_hash, senha_salt, criado_em)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(empresa, nicho, usuario, hash, salt, new Date().toISOString());
}

function validarUsuario(usuario, senha) {
  const linha = db.prepare('SELECT * FROM usuarios WHERE LOWER(usuario) = LOWER(?)').get(usuario);
  if (!linha) return null;
  const hashDigitado = gerarHash(senha, linha.senha_salt);
  if (hashDigitado !== linha.senha_hash) return null;
  return linha;
}

const app = express();
app.use(express.json());
app.use(express.static(RAIZ));

app.post('/api/criar-conta', (req, res) => {
  const { empresa, nicho, usuario, senha } = req.body || {};

  if (!empresa || !nicho || !usuario || !senha) {
    return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos para continuar.' });
  }
  if (String(senha).length < 6) {
    return res.status(400).json({ sucesso: false, mensagem: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  const existente = db.prepare('SELECT id FROM usuarios WHERE LOWER(usuario) = LOWER(?)').get(usuario);
  if (existente) {
    return res.status(409).json({ sucesso: false, mensagem: 'Esse nome de usuário já está em uso. Escolha outro.' });
  }

  try {
    criarUsuario({ empresa, nicho, usuario, senha });
    return res.json({ sucesso: true });
  } catch (e) {
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao gravar a conta no banco de dados.' });
  }
});

app.post('/api/login', (req, res) => {
  const { usuario, senha } = req.body || {};
  if (!usuario || !senha) {
    return res.status(400).json({ sucesso: false, mensagem: 'Informe usuário e senha.' });
  }

  const conta = validarUsuario(usuario, senha);
  if (!conta) {
    return res.status(401).json({ sucesso: false, mensagem: 'Usuário ou senha incorretos. Tente novamente.' });
  }

  return res.json({ sucesso: true, usuario: conta.usuario, empresa: conta.empresa, nicho: conta.nicho });
});

app.use((req, res) => res.status(404).sendFile(path.join(RAIZ, 'erro.html')));

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log(`MarcaViva rodando em http://localhost:${PORTA}`));
