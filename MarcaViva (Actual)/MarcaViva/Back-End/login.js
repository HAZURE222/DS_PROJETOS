// Lógica da página login.html
// As credenciais são validadas no servidor (server.js), que consulta o banco
// SQLite salvo em "DBA - Credentials/marcaviva.db".
const CHAVE_SESSAO = 'marcaviva_sessao';

// Exibe o banner de sucesso ao voltar da página de criação de conta
(function verificarContaCriada() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('criado') === '1') {
        const banner = document.getElementById('msgContaCriada');
        banner.style.display = 'block';
        const usuario = params.get('usuario');
        if (usuario) {
            document.getElementById('userInputReal').value = usuario;
            document.getElementById('passInputReal').focus();
        }
    }
})();

async function validarAcessoPainel(event) {
    event.preventDefault();

    const usuarioDigitado = document.getElementById('userInputReal').value.trim();
    const senhaDigitada = document.getElementById('passInputReal').value;
    const msgErro = document.getElementById('erroLoginReal');
    const loginBox = document.querySelector('.login-box');
    const botaoEntrar = document.querySelector('.btn-entrar');

    botaoEntrar.disabled = true;
    botaoEntrar.textContent = "Verificando...";
    msgErro.style.display = "none";

    try {
        const resposta = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: usuarioDigitado, senha: senhaDigitada })
        });
        const dados = await resposta.json();

        if (resposta.ok && dados.sucesso) {
            sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify({
                usuario: dados.usuario,
                empresa: dados.empresa,
                nicho: dados.nicho
            }));
            window.location.href = "painel.html";
            return;
        }

        msgErro.textContent = "❌ " + (dados.mensagem || "Usuário ou senha incorretos.");
        msgErro.style.display = "block";
        loginBox.style.animation = "none";
        setTimeout(() => { loginBox.style.animation = "shake 0.4s ease-in-out"; }, 10);
    } catch (e) {
        msgErro.textContent = "❌ Não foi possível conectar ao servidor.";
        msgErro.style.display = "block";
    } finally {
        botaoEntrar.disabled = false;
        botaoEntrar.textContent = "Acessar Painel";
    }
}
