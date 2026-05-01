/**
 * NEUROMAX - O Chatbot Neuromarketing
 * Funcionalidades: Processamento de Linguagem, Gerador de Identidade Visual,
 * Banco de Gatilhos Mentais e Psicologia do Consumidor.
 */

// Não está completo!!!!!!!! irei trabalhar ainda nisso.

// 1. database (EXPANSÍVEL)
const NeuroDB = {
    social: {
        "oi": "Olá! Sou o NeuroMax. Pronto para transformar leads em clientes através da neurociência?",
        "olá": "Saudações! Vamos analisar o comportamento do seu consumidor hoje?",
        "quem é você": "Sou uma IA focada em design persuasivo e psicologia do consumo.",
        "ajuda": "Eu posso sugerir fontes, explicar gatilhos mentais ou definir cores para sua marca. O que precisa?",
        "obrigado": "O prazer é meu! Lembre-se: o cérebro decide no subconsciente primeiro.",
        "bom dia": "Bom dia! Que tal começarmos aplicando um gatilho de autoridade hoje?",
        "boa tarde": "Boa tarde! Vamos otimizar suas conversões?",
        "boa noite": "Boa noite! O cérebro nunca dorme, e o marketing também não."
    },
    tecnico: {
        "gatilho": "Gatilhos mentais são atalhos cerebrais. Use 'Escassez' (vagas limitadas) para ação rápida ou 'Prova Social' (depoimentos) para confiança.",
        "escassez": "A dor da perda é maior que o prazer do ganho. Diga que o estoque está acabando para acelerar o sistema límbico.",
        "autoridade": "Pessoas seguem especialistas. Mostre certificados, anos de mercado e use uma linguagem técnica, mas acessível.",
        "cor": "A psicologia das cores é vital: Vermelho (Urgência/Apetite), Azul (Confiança/Tecnologia), Ouro (Luxo), Verde (Saúde/Sustentável).",
        "preço": "Nunca diga 'Preço', diga 'Investimento'. Use ancoragem: apresente o valor caro primeiro para o valor real parecer um presente.",
        "venda": "Para vender mais, reduza a 'Fricção'. Quanto menos cliques até o pagamento, melhor para o cérebro do cliente.",
        "copy": "Use a técnica AIDA: Atenção, Interesse, Desejo e Ação. Fale diretamente com o 'Eu' do cliente.",
        "neuro": "Neuromarketing estuda a reação cerebral a estímulos de marca. O foco é sempre o Cérebro Reptiliano (instinto de sobrevivência)."
    },
    fontes: [
        "Montserrat", "Playfair Display", "Bebas Neue", "Roboto", "Raleway", "Oswald", "Lora", "Merriweather", 
        "Poppins", "Ubuntu", "Source Code Pro", "Dancing Script", "Pacifico", "Abril Fatface", "Quicksand", 
        "Josefin Sans", "Arvo", "Anton", "Fira Sans", "Libre Baskerville", "Zilla Slab", "Cinzel", "Comfortaa", 
        "Archivo Black", "Permanent Marker", "Crimson Text", "Work Sans", "Kanit", "Righteous", "Lobster", 
        "Fredoka One", "Shadows Into Light", "Amatic SC", "Courgette", "Great Vibes", "Orbitron", "Michroma", 
        "Space Mono", "Spectral", "Cormorant Garamond", "Unbounded", "Manrope", "Syne", "Outfit", "Clash Display",
        "Public Sans", "Inter", "Sora", "Bricolage Grotesque", "Space Grotesk"
    ],
    paletaCores: [
        { nome: "Tech Premium", cores: ["#000505", "#3B82F6", "#F8FAFC"], vibe: "Confiança e Inovação" },
        { nome: "Luxo Sofisticado", cores: ["#1C1C1C", "#D4AF37", "#FFFFFF"], vibe: "Exclusividade e Poder" },
        { nome: "Eco Vitalidade", cores: ["#064E3B", "#10B981", "#F0FDF4"], vibe: "Saúde e Sustentabilidade" },
        { nome: "Urgência e Energia", cores: ["#7F1D1D", "#EF4444", "#FFF1F2"], vibe: "Promoção e Fome" }
    ]
};

// 2. O MOTOR DO CHATBOT (LÓGICA MAX)
const NeuroMax = {
    nome: "NeuroMax",

    // Função Principal de Resposta
    responder: function(inputUsuario) {
        const input = inputUsuario.toLowerCase().trim();

        // 1. Verifica se quer gerar Identidade de Empresa
        if (input.includes("gerar") || input.includes("empresa") || input.includes("marca")) {
            return this.gerarIdentidadeIA();
        }

        // 2. Busca no Banco Social (Matches Exatos)
        if (NeuroDB.social[input]) {
            return NeuroDB.social[input];
        }

        // 3. Busca no Banco Técnico (Keyword Match)
        for (let chave in NeuroDB.tecnico) {
            if (input.includes(chave)) {
                return NeuroDB.tecnico[chave];
            }
        }

        // 4. Fallback (Não entendeu)
        return "Não encontrei esse termo no meu mapeamento cerebral. Tente perguntar sobre 'gatilhos', 'cores' ou peça para 'gerar uma marca'.";
    },

    // Módulo de IA de Design (Randomizador Estratégico)
    gerarIdentidadeIA: function() {
        const fonte = NeuroDB.fontes[Math.floor(Math.random() * NeuroDB.fontes.length)];
        const paleta = NeuroDB.paletaCores[Math.floor(Math.random() * NeuroDB.paletaCores.length)];
        
        return `
 **ANÁLISE DE IA CONCLUÍDA**
-------------------------------------------
Sua empresa deve utilizar a fonte: **${fonte}**
Paleta Recomendada: **${paleta.nome}** (${paleta.cores.join(", ")})
Vibe Psicológica: *${paleta.vibe}*

**Dica Neuro:** Esta combinação ativa a fluidez cognitiva, reduzindo a rejeição do cliente ao primeiro impacto visual.
-------------------------------------------`;
    }
};



// Essa parte é para chamar no front isso e só um teste nada 100%

// --- EX: FRONT-END | RAPHA E GUSTAVO NEVES ---

console.log(NeuroMax.responder("Oi")); 
console.log(NeuroMax.responder("me fale sobre gatilhos")); 
console.log(NeuroMax.responder("Quero gerar uma marca para minha empresa")); 
console.log(NeuroMax.responder("como usar cores no marketing?"));
