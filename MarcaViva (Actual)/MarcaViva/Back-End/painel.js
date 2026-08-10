// Lógica da página painel.html

// ==========================================================================
// SESSÃO LOCAL — lê os dados de sessão gravados por login.js após a
// autenticação no servidor e preenche o cabeçalho do painel.
// ==========================================================================
(function carregarSessao() {
  const sessao = sessionStorage.getItem('marcaviva_sessao');

  if (!sessao) {
    window.location.href = "login.html";
    return;
  }

  try {
    const dados = JSON.parse(sessao);
    const elNomeEmpresa = document.getElementById('db-nome-empresa');
    const elNicho = document.getElementById('db-nicho-empresa');
    if (elNomeEmpresa) elNomeEmpresa.textContent = dados.empresa || 'Sua Empresa';
    if (elNicho) elNicho.textContent = dados.nicho || 'Não informado';
  } catch (e) {
    window.location.href = "login.html";
  }
})();

function fazerLogout() {
  sessionStorage.removeItem('marcaviva_sessao');
  window.location.href = "login.html";
}

// Alterna entre as abas/seções do painel
function alternarAbas(event, idSecao) {
  event.preventDefault();

  document.querySelectorAll('.dashboard-section').forEach((el) => el.classList.add('section-hidden'));
  document.querySelectorAll('.menu-item').forEach((el) => el.classList.remove('active'));

  const secao = document.getElementById(idSecao);
  if (secao) secao.classList.remove('section-hidden');
  event.currentTarget.classList.add('active');
}

// Copia o texto de um card de copy para a área de transferência
function copiarTexto(botao) {
  const corpo = botao.closest('.copy-card').querySelector('.copy-card-body');
  navigator.clipboard.writeText(corpo.textContent.trim()).then(() => {
    const textoOriginal = botao.innerHTML;
    botao.innerHTML = '<i data-lucide="check"></i> Copiado';
    if (window.lucide) lucide.createIcons();
    setTimeout(() => { botao.innerHTML = textoOriginal; if (window.lucide) lucide.createIcons(); }, 1500);
  });
}

// Exporta o conteúdo principal do painel como PDF
function gerarPDFCompleto() {
  const conteudo = document.querySelector('.main-content');
  if (window.html2pdf && conteudo) {
    html2pdf().set({ filename: 'relatorio-marcaviva.pdf', margin: 10 }).from(conteudo).save();
  }
}

// Chat do Mentor IA (respostas locais de exemplo)
function adicionarMensagemChat(texto, autor) {
  const historico = document.getElementById('chatHistorico');
  const msg = document.createElement('div');
  msg.className = 'msg-box ' + autor;
  msg.innerHTML = `<div class="msg-avatar">${autor === 'bot' ? 'AI' : 'Você'}</div><div class="msg-text">${texto}</div>`;
  historico.appendChild(msg);
  historico.scrollTop = historico.scrollHeight;
}

function enviarMensagemLivreIA() {
  const input = document.getElementById('inputMensagemIA');
  const texto = input.value.trim();
  if (!texto) return;

  adicionarMensagemChat(texto, 'user');
  input.value = '';

  setTimeout(() => {
    adicionarMensagemChat('Recebi sua pergunta sobre "' + texto + '". Em breve traremos respostas geradas por IA integradas ao seu diagnóstico.', 'bot');
  }, 600);
}

function perguntaPronta(texto) {
  document.getElementById('inputMensagemIA').value = texto;
  enviarMensagemLivreIA();
}

function verificarTecla(event) {
  if (event.key === 'Enter') enviarMensagemLivreIA();
}

if (window.lucide) lucide.createIcons();
