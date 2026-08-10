// Lógica da página criacao.html
// O cadastro é enviado ao servidor (server.js), que grava a credencial no
// banco SQLite salvo em "DBA - Credentials/marcaviva.db".

function exibirErroCriacao(texto) {
    const msgErro = document.getElementById('erroCriacao');
    msgErro.textContent = "❌ " + texto;
    msgErro.style.display = "block";

    const loginBox = document.querySelector('.login-box');
    loginBox.style.animation = "none";
    setTimeout(() => { loginBox.style.animation = "shake 0.4s ease-in-out"; }, 10);
}

async function criarConta(event) {
    event.preventDefault();

    const empresa = document.getElementById('empresaInput').value.trim();
    const nicho = document.getElementById('nichoInput').value.trim();
    const usuario = document.getElementById('userInput').value.trim();
    const senha = document.getElementById('passInput').value;
    const confirmarSenha = document.getElementById('confirmPassInput').value;
    const botao = document.querySelector('.btn-entrar');

    document.getElementById('erroCriacao').style.display = 'none';

    if (!empresa || !nicho || !usuario) {
        exibirErroCriacao('Preencha todos os campos para continuar.');
        return;
    }
    if (senha.length < 6) {
        exibirErroCriacao('A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    if (senha !== confirmarSenha) {
        exibirErroCriacao('As senhas não coincidem.');
        return;
    }

    botao.disabled = true;
    botao.textContent = "Criando conta...";

    try {
        const resposta = await fetch('/api/criar-conta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ empresa, nicho, usuario, senha })
        });
        const dados = await resposta.json();

        if (resposta.ok && dados.sucesso) {
            window.location.href = "login.html?criado=1&usuario=" + encodeURIComponent(usuario);
            return;
        }

        exibirErroCriacao(dados.mensagem || 'Não foi possível criar a conta.');
    } catch (e) {
        exibirErroCriacao('Não foi possível conectar ao servidor.');
    } finally {
        botao.disabled = false;
        botao.textContent = "Criar minha conta";
    }
}
