/* ════════════════════════════════════════════════════
   GOLDEN CARDÁPIO PRO — app.js
   Sistema Estático de Pedidos — Zero Backend
════════════════════════════════════════════════════ */

'use strict';

// ─── CONSTANTES ─────────────────────────────────────
const DIAS_SEMANA = [
    'Segunda-Feira',
    'Terça-Feira',
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira'
];

const ICONS_PADRAO = [
    'fa-drumstick-bite',
    'fa-bacon',
    'fa-fish',
    'fa-utensils',
    'fa-leaf',
    'fa-egg',
    'fa-bread-slice',
    'fa-carrot',
    'fa-pizza-slice',
    'fa-burger'
];

const CARDAPIO_PADRAO = {
    'Segunda-Feira': [
        { nome: 'Frango Grelhado', icon: 'fa-drumstick-bite' },
        { nome: 'Bife Acebolado', icon: 'fa-bacon' },
        { nome: 'Peixe Grelhado', icon: 'fa-fish' },
        { nome: 'Espaguete ao Sugo', icon: 'fa-utensils' },
        { nome: 'Salada Completa', icon: 'fa-leaf' }
    ],
    'Terça-Feira': [
        { nome: 'Frango à Parmegiana', icon: 'fa-drumstick-bite' },
        { nome: 'Picanha Grelhada', icon: 'fa-bacon' },
        { nome: 'Tilápia Assada', icon: 'fa-fish' },
        { nome: 'Macarrão ao Molho Branco', icon: 'fa-utensils' },
        { nome: 'Salada Caesar', icon: 'fa-leaf' }
    ],
    'Quarta-Feira': [
        { nome: 'Frango Assado', icon: 'fa-drumstick-bite' },
        { nome: 'Contrafilé Grelhado', icon: 'fa-bacon' },
        { nome: 'Salmão com Legumes', icon: 'fa-fish' },
        { nome: 'Arroz com Frango', icon: 'fa-utensils' },
        { nome: 'Mix de Folhas', icon: 'fa-leaf' }
    ],
    'Quinta-Feira': [
        { nome: 'Frango ao Curry', icon: 'fa-drumstick-bite' },
        { nome: 'Costela no Bafo', icon: 'fa-bacon' },
        { nome: 'Atum com Legumes', icon: 'fa-fish' },
        { nome: 'Lasanha de Carne', icon: 'fa-utensils' },
        { nome: 'Salada de Quinoa', icon: 'fa-leaf' }
    ],
    'Sexta-Feira': [
        { nome: 'Frango Empanado', icon: 'fa-drumstick-bite' },
        { nome: 'Alcatra Grelhada', icon: 'fa-bacon' },
        { nome: 'Badejo ao Forno', icon: 'fa-fish' },
        { nome: 'Macarrão Carbonara', icon: 'fa-utensils' },
        { nome: 'Tabule com Hortelã', icon: 'fa-leaf' }
    ]
};

// ─── ESTADO DA APLICAÇÃO ─────────────────────────────
let userData = { nome: '', cargo: '', sessionId: '' };
let diasSelecionados = [];      // Ex: ['Segunda-Feira', 'Quarta-Feira']
let fluxoDiasIndex = 0;         // Índice dentro de diasSelecionados
let pedidosSemana = {};         // { 'Segunda-Feira': 'Frango Grelhado', ... }
let pratoPendenteNome = null;   // Prato clicado aguardando confirmação

// ─── CHAVES DO LOCALSTORAGE ──────────────────────────
const KEY_CARDAPIO = 'golden_cardapio_semanal';
const KEY_RESET    = 'golden_reset_global';
const KEY_UPDATE   = 'golden_cardapio_atualizado';
const PREFIX_USER  = 'golden_user_';

// ════════════════════════════════════════════════════
//  INICIALIZAÇÃO
// ════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
    // Listener de atualização em tempo real entre abas
    window.addEventListener('storage', handleStorageEvent);

    iniciarAnimacaoIntro();
});

function handleStorageEvent(event) {
    if (event.key === KEY_RESET) {
        location.reload();
    }
    if (event.key === KEY_UPDATE) {
        // Recarrega o cardápio sem interromper o fluxo do usuário
        // Mostra um aviso discreto se o usuário ainda não começou
        const painel = document.getElementById('painel-adm');
        if (!painel || painel.classList.contains('hidden')) {
            mostrarToast('📋 Cardápio atualizado pelo ADM!');
        }
    }
}

function mostrarToast(msg) {
    let toast = document.getElementById('toast-notif');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notif';
        toast.style.cssText = `
            position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(135deg, #D4AF37, #AA8C2C);
            color: #000; padding: 10px 20px; border-radius: 30px;
            font-family: Montserrat, sans-serif; font-size: 13px; font-weight: 700;
            z-index: 99999; opacity: 0; transition: opacity 0.3s ease;
            white-space: nowrap; box-shadow: 0 4px 20px rgba(212,175,55,0.4);
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ════════════════════════════════════════════════════
//  TELA DE LOADING
// ════════════════════════════════════════════════════
function iniciarAnimacaoIntro() {
    const sloganEl = document.getElementById('typing-text');
    const sloganText = 'É fácil ser feliz aqui';
    let charIndex = 0;

    const typingInterval = setInterval(() => {
        if (charIndex < sloganText.length) {
            sloganEl.textContent += sloganText.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typingInterval);

            // Apaga o texto após pausa
            setTimeout(() => {
                const apagar = setInterval(() => {
                    if (sloganEl.textContent.length > 0) {
                        sloganEl.textContent = sloganEl.textContent.slice(0, -1);
                    } else {
                        clearInterval(apagar);

                        // Mostra logo
                        const logoContainer = document.getElementById('logo-container');
                        logoContainer.style.display = 'flex';
                        sloganEl.parentElement.style.display = 'none';

                        // Após 3s, vai para próxima tela
                        setTimeout(() => {
                            document.getElementById('loading-screen').classList.add('hidden');
                            verificarEstadoInicial();
                        }, 3000);
                    }
                }, 60);
            }, 800);
        }
    }, 90);
}

function verificarEstadoInicial() {
    const sessionId = obterSessionId();

    if (sessionId) {
        const savedUser = localStorage.getItem(PREFIX_USER + sessionId);
        if (savedUser) {
            const user = JSON.parse(savedUser);
            userData = user;

            if (user.hasPedido === true) {
                pedidosSemana = user.pedidos || {};
                mostrarTelaJaEnviado();
                return;
            }
        }
    }

    mostrarTela('tela-cadastro');
}

// ════════════════════════════════════════════════════
//  UTILITÁRIOS
// ════════════════════════════════════════════════════
function obterSessionId() {
    return localStorage.getItem('golden_session_id');
}

function gerarSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function getCardapioAtual() {
    const saved = localStorage.getItem(KEY_CARDAPIO);
    if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignora */ }
    }
    return CARDAPIO_PADRAO;
}

function mostrarTela(id) {
    const telas = [
        'loading-screen',
        'tela-cadastro',
        'tela-dias',
        'tela-pratos',
        'tela-final',
        'tela-ja-enviado',
        'painel-adm'
    ];
    telas.forEach(t => {
        const el = document.getElementById(t);
        if (el) el.classList.add('hidden');
    });

    const alvo = document.getElementById(id);
    if (alvo) alvo.classList.remove('hidden');
}

// ════════════════════════════════════════════════════
//  TELA DE CADASTRO
// ════════════════════════════════════════════════════
function continuar() {
    const nome  = document.getElementById('nome').value.trim();
    const cargo = document.getElementById('cargo').value;

    if (!nome) {
        alertGold('Preencha seu nome completo.');
        return;
    }
    if (!cargo) {
        alertGold('Selecione seu setor/cargo.');
        return;
    }

    // Cria ou recupera sessionId
    let sessionId = obterSessionId();
    if (!sessionId) {
        sessionId = gerarSessionId();
        localStorage.setItem('golden_session_id', sessionId);
    }

    userData = { nome, cargo, sessionId, hasPedido: false, pedidos: {} };
    localStorage.setItem(PREFIX_USER + sessionId, JSON.stringify(userData));

    // Reseta estado para novo pedido
    diasSelecionados = [];
    fluxoDiasIndex   = 0;
    pedidosSemana    = {};

    mostrarTela('tela-dias');
    renderizarDias();
}

// ════════════════════════════════════════════════════
//  TELA DE SELEÇÃO DE DIAS
// ════════════════════════════════════════════════════
function renderizarDias() {
    const container = document.getElementById('dias-lista');
    container.innerHTML = '';

    DIAS_SEMANA.forEach((dia) => {
        const btn = document.createElement('button');
        btn.className = 'dia-btn';
        btn.textContent = dia;
        btn.setAttribute('data-dia', dia);
        btn.onclick = () => toggleDia(dia, btn);
        container.appendChild(btn);
    });

    atualizarBtnConfirmarDias();
}

function toggleDia(dia, btn) {
    const idx = diasSelecionados.indexOf(dia);
    if (idx === -1) {
        diasSelecionados.push(dia);
        btn.classList.add('selected');
    } else {
        diasSelecionados.splice(idx, 1);
        btn.classList.remove('selected');
    }
    atualizarBtnConfirmarDias();
}

function atualizarBtnConfirmarDias() {
    const btnConfirmar = document.getElementById('btn-confirmar-dias');
    if (diasSelecionados.length > 0) {
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = `<i class="fas fa-check"></i> CONFIRMAR ${diasSelecionados.length} DIA${diasSelecionados.length > 1 ? 'S' : ''}`;
    } else {
        btnConfirmar.disabled = true;
        btnConfirmar.innerHTML = `<i class="fas fa-check"></i> CONFIRMAR DIAS`;
    }
}

function confirmarDias() {
    if (diasSelecionados.length === 0) {
        alertGold('Selecione pelo menos um dia de trabalho.');
        return;
    }

    // Ordena os dias na ordem natural da semana
    diasSelecionados.sort((a, b) => DIAS_SEMANA.indexOf(a) - DIAS_SEMANA.indexOf(b));

    fluxoDiasIndex = 0;
    pedidosSemana  = {};
    pratoPendenteNome = null;

    mostrarTela('tela-pratos');
    renderizarPratos();
}

// ════════════════════════════════════════════════════
//  TELA DE SELEÇÃO DE PRATOS
// ════════════════════════════════════════════════════
function renderizarPratos() {
    const diaAtual = diasSelecionados[fluxoDiasIndex];
    const cardapio  = getCardapioAtual();
    const pratos    = cardapio[diaAtual] || CARDAPIO_PADRAO[diaAtual] || [];

    // Atualiza cabeçalho
    document.getElementById('dia-titulo').textContent = diaAtual.toUpperCase();
    document.getElementById('progresso-info').textContent =
        `Dia ${fluxoDiasIndex + 1} de ${diasSelecionados.length}`;

    // Reseta seleção
    pratoPendenteNome = null;
    const btnConfirmar = document.getElementById('btn-confirmar-prato');
    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = `<i class="fas fa-utensils"></i> CONFIRMAR PRATO`;

    // Renderiza lista de pratos
    const container = document.getElementById('pratos-lista');
    container.innerHTML = '';

    pratos.forEach((item, i) => {
        const icon = item.icon || ICONS_PADRAO[i % ICONS_PADRAO.length];
        const card = document.createElement('div');
        card.className = 'prato-card';
        card.setAttribute('data-nome', item.nome);
        card.innerHTML = `
            <i class="fas ${icon} prato-icon"></i>
            <span class="prato-nome">${item.nome}</span>
            <i class="fas fa-check-circle prato-check"></i>
        `;
        card.onclick = () => selecionarPrato(card, item.nome);
        container.appendChild(card);
    });
}

function selecionarPrato(cardElement, nome) {
    // Remove seleção anterior
    document.querySelectorAll('.prato-card').forEach(c => c.classList.remove('selected'));

    // Marca o prato clicado
    cardElement.classList.add('selected');
    pratoPendenteNome = nome;

    // Habilita botão confirmar
    const btnConfirmar = document.getElementById('btn-confirmar-prato');
    btnConfirmar.disabled = false;
    btnConfirmar.innerHTML = `<i class="fas fa-check"></i> CONFIRMAR: ${nome.toUpperCase()}`;

    // Fala o nome do prato (opcional)
    falarPrato(nome);
}

function falarPrato(nome) {
    if ('speechSynthesis' in window) {
        try {
            const utterance = new SpeechSynthesisUtterance(nome);
            utterance.lang  = 'pt-BR';
            utterance.rate  = 0.9;
            speechSynthesis.speak(utterance);
        } catch (e) { /* ignora erros de síntese */ }
    }
}

function confirmarPrato() {
    if (!pratoPendenteNome) {
        alertGold('Selecione um prato antes de confirmar.');
        return;
    }

    const diaAtual = diasSelecionados[fluxoDiasIndex];
    pedidosSemana[diaAtual] = pratoPendenteNome;

    fluxoDiasIndex++;
    pratoPendenteNome = null;

    if (fluxoDiasIndex < diasSelecionados.length) {
        // Ainda há dias para pedido
        renderizarPratos();
    } else {
        // Todos os dias preenchidos
        finalizarPedido();
    }
}

// ════════════════════════════════════════════════════
//  FINALIZAÇÃO
// ════════════════════════════════════════════════════
function finalizarPedido() {
    // Salva no localStorage
    const userKey = PREFIX_USER + userData.sessionId;
    const userAtualizado = {
        ...userData,
        hasPedido: true,
        pedidos: pedidosSemana,
        dataEnvio: new Date().toISOString()
    };
    localStorage.setItem(userKey, JSON.stringify(userAtualizado));
    userData = userAtualizado;

    mostrarTelaFinal();
}

function mostrarTelaFinal() {
    mostrarTela('tela-final');

    // Renderiza resumo do pedido
    const resumoDiv = document.getElementById('resumo-pedido');
    resumoDiv.innerHTML = '<h3><i class="fas fa-clipboard-list"></i> Resumo do Pedido</h3>';

    Object.entries(pedidosSemana).forEach(([dia, prato]) => {
        const item = document.createElement('div');
        item.className = 'resumo-item';
        item.innerHTML = `
            <span class="resumo-dia">${dia}</span>
            <span class="resumo-prato">${prato}</span>
        `;
        resumoDiv.appendChild(item);
    });
}

function mostrarTelaJaEnviado() {
    mostrarTela('tela-ja-enviado');
}

// ════════════════════════════════════════════════════
//  WHATSAPP
// ════════════════════════════════════════════════════
function enviarWhatsApp() {
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    let msg = '🍽️ *PEDIDO SEMANAL — GOLDEN*\n\n';
    msg += `👤 *${userData.nome}*\n`;
    msg += `💼 ${userData.cargo} · ${dataFormatada}\n\n`;
    msg += '━━━━━━━━━━━━━━━\n';

    Object.entries(pedidosSemana).forEach(([dia, prato]) => {
        msg += `▪️ *${dia}* → ${prato}\n`;
    });

    msg += '━━━━━━━━━━━━━━━';

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}



// ════════════════════════════════════════════════════
//  PAINEL ADMINISTRADOR
// ════════════════════════════════════════════════════
function abrirAdm() {
    const senha = prompt('🔐 Senha do Administrador:');
    if (senha === null) return; // cancelou

    if (senha === '2026') {
        mostrarTela('painel-adm');
        mudarAba('funcionarios');
        carregarListaFuncionarios();
    } else {
        alertGold('Senha incorreta!');
    }
}

function fecharAdm() {
    // Retorna para a tela correta
    const sessionId = obterSessionId();
    if (sessionId) {
        const saved = localStorage.getItem(PREFIX_USER + sessionId);
        if (saved) {
            const user = JSON.parse(saved);
            if (user.hasPedido) {
                pedidosSemana = user.pedidos || {};
                userData = user;
                mostrarTelaJaEnviado();
                return;
            }
        }
    }
    mostrarTela('tela-cadastro');
}

// ── ABAS ──
function mudarAba(aba) {
    // Atualiza botões
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-btn-${aba}`).classList.add('active');

    // Atualiza conteúdo
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
    document.getElementById(`aba-${aba}`).classList.remove('hidden');

    // Ação específica por aba
    if (aba === 'funcionarios') carregarListaFuncionarios();
    if (aba === 'cardapio') inicializarEditorCardapio();
}

// ── ABA FUNCIONÁRIOS ──
function carregarListaFuncionarios() {
    const listaDiv = document.getElementById('lista-itens');
    const statsDiv = document.getElementById('adm-stats');
    listaDiv.innerHTML = '';

    let totalFuncs = 0;
    let totalEnviados = 0;
    const funcionarios = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(PREFIX_USER)) continue;

        try {
            const user = JSON.parse(localStorage.getItem(key));
            if (user && user.nome) {
                funcionarios.push({ key, user });
                totalFuncs++;
                if (user.hasPedido) totalEnviados++;
            }
        } catch (e) { /* ignora */ }
    }

    // Ordena: pendentes primeiro
    funcionarios.sort((a, b) => {
        if (a.user.hasPedido === b.user.hasPedido) return a.user.nome.localeCompare(b.user.nome);
        return a.user.hasPedido ? 1 : -1;
    });

    // Estatísticas
    const pendentes = totalFuncs - totalEnviados;
    statsDiv.innerHTML = `
        <span><span class="stat-done">✅ ${totalEnviados}</span> enviados</span>
        <span><span class="stat-pending">⏳ ${pendentes}</span> pendentes</span>
    `;

    if (funcionarios.length === 0) {
        listaDiv.innerHTML = '<p style="color:#888; text-align:center; padding:24px 0; font-size:14px;">Nenhum funcionário cadastrado ainda.</p>';
        return;
    }

    funcionarios.forEach(({ key, user }) => {
        const isDone = user.hasPedido === true;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-funcionario';

        const dataEnvio = user.dataEnvio
            ? new Date(user.dataEnvio).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })
            : '';

        itemDiv.innerHTML = `
            <div class="item-info">
                <span class="status-dot ${isDone ? 'status-done' : 'status-pending'}" title="${isDone ? 'Enviou o pedido' : 'Pedido pendente'}"></span>
                <div class="item-nome-cargo">
                    <div class="item-nome">${escapeHtml(user.nome)}</div>
                    <div class="item-cargo">${escapeHtml(user.cargo)}${dataEnvio ? ' · ' + dataEnvio : ''}</div>
                </div>
                <span class="item-badge ${isDone ? 'badge-done' : 'badge-pending'}">
                    ${isDone ? '✅ Enviado' : '⏳ Pendente'}
                </span>
            </div>
            <button class="btn-remove" onclick="removerUsuario('${escapeAttr(key)}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        listaDiv.appendChild(itemDiv);
    });
}

function removerUsuario(key) {
    const user = JSON.parse(localStorage.getItem(key) || '{}');
    const nome = user.nome || key;
    if (confirm(`Remover "${nome}" do sistema?`)) {
        localStorage.removeItem(key);
        carregarListaFuncionarios();
        mostrarFeedbackAdm(`Funcionário "${nome}" removido.`, 'success');
    }
}

// ── ABA EDITAR CARDÁPIO ──
function inicializarEditorCardapio() {
    const select = document.getElementById('adm-dia-select');
    select.value = '';
    document.getElementById('adm-pratos-textarea').value = '';
    document.getElementById('adm-preview-count').textContent = '';
    ocultarFeedbackAdm();
}

function carregarCardapioDia() {
    const dia = document.getElementById('adm-dia-select').value;
    if (!dia) {
        document.getElementById('adm-pratos-textarea').value = '';
        document.getElementById('adm-preview-count').textContent = '';
        return;
    }

    const cardapio = getCardapioAtual();
    const pratos   = cardapio[dia] || [];
    const texto    = pratos.map(p => p.nome).join('\n');

    document.getElementById('adm-pratos-textarea').value = texto;
    atualizarPreviewPratos();
}

function atualizarPreviewPratos() {
    const textarea = document.getElementById('adm-pratos-textarea');
    const pratos   = parsearPratos(textarea.value);
    const preview  = document.getElementById('adm-preview-count');

    if (pratos.length === 0) {
        preview.textContent = '';
    } else {
        preview.textContent = `${pratos.length} prato${pratos.length > 1 ? 's' : ''} detectado${pratos.length > 1 ? 's' : ''}`;
    }
}

function parsearPratos(texto) {
    return texto
        .split('\n')
        .map(linha => linha.trim())
        .filter(linha => linha.length > 0);
}

function salvarPratos() {
    const dia    = document.getElementById('adm-dia-select').value;
    const texto  = document.getElementById('adm-pratos-textarea').value;
    const nomes  = parsearPratos(texto);

    if (!dia) {
        mostrarFeedbackAdm('Selecione um dia da semana.', 'error');
        return;
    }
    if (nomes.length === 0) {
        mostrarFeedbackAdm('Digite pelo menos um prato.', 'error');
        return;
    }

    const cardapio = getCardapioAtual();
    cardapio[dia]  = nomes.map((nome, i) => ({
        nome,
        icon: ICONS_PADRAO[i % ICONS_PADRAO.length]
    }));

    localStorage.setItem(KEY_CARDAPIO, JSON.stringify(cardapio));
    mostrarFeedbackAdm(`✅ ${nomes.length} pratos salvos para ${dia}!`, 'success');
}

function enviarAtualizacao() {
    // Dispara evento para recarregar cardápio em todas as abas abertas
    localStorage.setItem(KEY_UPDATE, Date.now().toString());
    setTimeout(() => localStorage.removeItem(KEY_UPDATE), 500);
    mostrarFeedbackAdm('✈️ Atualização enviada para todos os usuários!', 'success');
}

function resetarCardapioGlobal() {
    const confirmMsg =
        '⚠️ ATENÇÃO!\n\nIsso irá:\n' +
        '• Limpar todos os pedidos de todos os funcionários\n' +
        '• Resetar o cardápio para o padrão\n\n' +
        'Deseja continuar?';

    if (!confirm(confirmMsg)) return;

    // Remove cardápio salvo
    localStorage.removeItem(KEY_CARDAPIO);

    // Dispara evento de reload para todas as abas
    localStorage.setItem(KEY_RESET, Date.now().toString());
    setTimeout(() => localStorage.removeItem(KEY_RESET), 300);

    mostrarFeedbackAdm('🔄 Reset global executado! Todas as abas serão recarregadas.', 'success');
}

// ─── HELPERS DO ADM ─────────────────────────────────
function mostrarFeedbackAdm(msg, tipo) {
    const el = document.getElementById('adm-feedback');
    el.className = `adm-feedback ${tipo}`;
    el.innerHTML = `<i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${msg}`;
    el.classList.remove('hidden');

    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.add('hidden'), 4000);
}

function ocultarFeedbackAdm() {
    const el = document.getElementById('adm-feedback');
    if (el) el.classList.add('hidden');
}

// ─── SEGURANÇA / UTILITÁRIOS ─────────────────────────
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
    return String(str).replace(/'/g, "\\'");
}

function alertGold(msg) {
    // Alert estilizado simples
    alert(msg);
}
