/* 1. NAVEGAÇÃO ENTRE PÁGINAS */
function showPage(id) {
  // Esconde todas as seções
  document.querySelectorAll(".page").forEach(p => {
      p.classList.remove("active");
  });
  // Mostra a seção clicada
  document.getElementById(id).classList.add("active");
  // Volta o scroll para o topo
  window.scrollTo(0, 0);
  // Fecha o menu da logo caso esteja aberto
  const menu = document.getElementById('logo-menu-content');
  if(menu) menu.classList.remove('show');
}

function showLogin() { showPage("login"); }
function showLanding() { showPage("landing"); }
function showForm() { showPage("form"); }

/* 2. MENU DA LOGO (HUB) */
function toggleLogoMenu() {
  const menu = document.getElementById('logo-menu-content');
  if (menu) menu.classList.toggle('show');
}

// Fecha o menu se clicar fora dele
window.addEventListener('click', function(e) {
  if (!e.target.closest('.logo-container')) {
      const dropdown = document.getElementById("logo-menu-content");
      if (dropdown) dropdown.classList.remove('show');
  }
});

/* AJUSTE NO FORMULÁRIO PASSO A PASSO */
let currentStep = 0;

function nextStep() {
    const steps = document.querySelectorAll(".step-content");
    const indicators = document.querySelectorAll(".step");

    if (currentStep < steps.length - 1) {
        steps[currentStep].classList.remove("active");
        indicators[currentStep].classList.remove("active");

        currentStep++;

        steps[currentStep].classList.add("active");
        indicators[currentStep].classList.add("active");
    } else {
        alert("Estratégia enviada com sucesso!");
        resetForm();
        showLanding();
    }
}

function prevStep() {
    const steps = document.querySelectorAll(".step-content");
    const indicators = document.querySelectorAll(".step");

    // Se estiver no primeiro passo, o "Voltar" leva para a Home
    if (currentStep === 0) {
        showLanding();
        return;
    }

    // Se estiver nos outros passos, volta um nível do formulário
    steps[currentStep].classList.remove("active");
    indicators[currentStep].classList.remove("active");

    currentStep--;

    steps[currentStep].classList.add("active");
    indicators[currentStep].classList.add("active");
}

function resetForm() {
    currentStep = 0;
    const steps = document.querySelectorAll(".step-content");
    const indicators = document.querySelectorAll(".step");
    
    steps.forEach(s => s.classList.remove("active"));
    indicators.forEach(i => i.classList.remove("active"));
    
    steps[0].classList.add("active");
    indicators[0].classList.add("active");
}
/* 4. ANIMAÇÕES DE SCROLL (REVEAL) */
function animatedScroll() {
  const reveals = document.querySelectorAll(".reveal");

  reveals.forEach((element) => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
          element.classList.add("active");
      }
  });
}

window.addEventListener("scroll", animatedScroll);

function animatedScroll() {
  const reveals = document.querySelectorAll(".reveal");

  reveals.forEach((element) => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150; // Sensibilidade do aparecimento

    // Se o elemento entrar na área visível (descendo)
    if (elementTop < windowHeight - elementVisible) {
      element.classList.add("active");
    } 
    // Se o elemento sair da área visível (subindo o scroll)
    else {
      element.classList.remove("active");
    }
  });
}

// O restante do código de escuta permanece igual:
window.addEventListener("scroll", animatedScroll);
document.addEventListener("DOMContentLoaded", animatedScroll);

// OBRIGATORIO PREENCHER CELULA
function nextStep() {
  const steps = document.querySelectorAll(".step-content");
  const indicators = document.querySelectorAll(".step");
  
  // Pega todos os inputs dentro do passo que está visível agora
  const currentInputs = steps[currentStep].querySelectorAll("input");
  let allFilled = true;

  // Verifica se cada input está preenchido
  currentInputs.forEach(input => {
      if (input.value.trim() === "") {
          allFilled = false;
          input.style.borderColor = "red"; // Pinta a borda de vermelho se estiver vazio
      } else {
          input.style.borderColor = "#ddd"; // Volta a cor normal se preenchido
      }
  });

  if (!allFilled) {
      alert("Por favor, preencha todos os campos antes de continuar.");
      return; // Para a função aqui e não deixa avançar
  }

  // Se estiver tudo preenchido, segue o fluxo normal
  if (currentStep < steps.length - 1) {
      steps[currentStep].classList.remove("active");
      indicators[currentStep].classList.remove("active");

      currentStep++;

      steps[currentStep].classList.add("active");
      indicators[currentStep].classList.add("active");
  } else {
      alert("Estratégia enviada com sucesso!");
      resetForm();
      showLanding();
  }
}

function animatedScroll() {
  const reveals = document.querySelectorAll(".reveal");
  
  reveals.forEach((el) => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const elementBottom = el.getBoundingClientRect().bottom;

      // "triggerPoint": quanto do elemento precisa aparecer para ativar (150px)
      const triggerPoint = 150;

      // APARECE: Se o topo do elemento entrar na tela vindo de baixo
      // SOME: Se o topo do elemento sair da tela indo para baixo (scroll para cima)
      if (elementTop < windowHeight - triggerPoint && elementBottom > 0) {
          el.classList.add("active");
      } else {
          el.classList.remove("active");
      }
  });
}

// Executa ao scrollar
window.addEventListener("scroll", animatedScroll);

// Executa uma vez ao carregar para verificar o que já está na tela
document.addEventListener("DOMContentLoaded", animatedScroll);