const diasSemana = ['Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira'];
const cardapioBase = [
    { nome: 'Frango Grelhado', icon: 'fa-drumstick-bite' },
    { nome: 'Bife Acebolado', icon: 'fa-bacon' },
    { nome: 'Peixe Grelhado', icon: 'fa-fish' },
    { nome: 'Espaguete', icon: 'fa-utensils' },
    { nome: 'Salada Completa', icon: 'fa-leaf' }
];

let userData = { nome: '', cargo: '' };
let pedidosSemana = {};
let diaAtualIndex = 0;

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            const savedUser = localStorage.getItem('golden_user_final');
            if (savedUser && JSON.parse(savedUser).hasPedido === true) {
                mostrarFinal();
            } else {
                document.getElementById('tela-cadastro').classList.remove('hidden');
            }
        }, 500);
    }, 3000);
});

function continuar() {
    const nome = document.getElementById('nome').value.trim();
    const cargo = document.getElementById('cargo').value;
    
    if (!nome || !cargo) {
        alert('Preencha todos os campos!');
        return;
    }
    
    userData = { nome, cargo };
    localStorage.setItem('golden_user_final', JSON.stringify({ ...userData, hasPedido: false }));
    
    document.getElementById('tela-cadastro').classList.add('hidden');
    criarDias();
    document.getElementById('tela-dias').classList.remove('hidden');
}

function criarDias() {
    const container = document.getElementById('dias-lista');
    container.innerHTML = '';
    
    diasSemana.forEach((dia, index) => {
        const btn = document.createElement('button');
        btn.className = 'dia-btn';
        btn.textContent = dia;
        btn.onclick = () => selecionarDia(index, btn);
        container.appendChild(btn);
    });
}

function selecionarDia(index, btnElement) {
    document.querySelectorAll('.dia-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
    diaAtualIndex = index;
    
    carregarPratos();
    setTimeout(() => {
        document.getElementById('tela-dias').classList.add('hidden');
        document.getElementById('tela-pratos').classList.remove('hidden');
    }, 200);
}

function carregarPratos() {
    document.getElementById('dia-titulo').textContent = diasSemana[diaAtualIndex];
    const container = document.getElementById('pratos-lista');
    container.innerHTML = '';
    
    cardapioBase.forEach(item => {
        const card = document.createElement('div');
        card.className = 'prato-card';
        card.innerHTML = `
            <i class="fas ${item.icon} prato-icon"></i>
            <span class="prato-nome">${item.nome}</span>
        `;
        card.onclick = () => selecionarPrato(card, item.nome);
        container.appendChild(card);
    });
}

function selecionarPrato(cardElement, nome) {
    document.querySelectorAll('.prato-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
    falarPrato(nome);
    
    setTimeout(() => confirmarPrato(), 800);
}

function falarPrato(nome) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(nome);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    }
}

function confirmarPrato() {
    const pratoSelecionado = document.querySelector('.prato-card.selected')?.querySelector('.prato-nome').textContent;
    
    if (!pratoSelecionado) {
        alert('Selecione um prato!');
        return;
    }
    
    pedidosSemana[diasSemana[diaAtualIndex]] = pratoSelecionado;
    
    if (Object.keys(pedidosSemana).length < 5) {
        diaAtualIndex++;
        document.getElementById('tela-pratos').classList.add('hidden');
        document.getElementById('tela-dias').classList.remove('hidden');
    } else {
        finalizarPedido();
    }
}

function finalizarPedido() {
    localStorage.setItem('golden_user_final', JSON.stringify({ ...userData, hasPedido: true }));
    document.getElementById('tela-pratos').classList.add('hidden');
    mostrarFinal();
}

function mostrarFinal() {
    document.getElementById('tela-final').classList.remove('hidden');
}

function enviarWhatsApp() {
    let msg = '*🍽️ GOLDEN CARDÁPIO* 🍽️\n\n';
    msg += `👤 *Nome:* ${userData.nome}\n`;
    msg += `💼 *Setor:* ${userData.cargo}\n\n`;
    msg += '*PEDIDOS DA SEMANA:*\n━━━━━━━━━━━━━━━\n\n';
    
    Object.entries(pedidosSemana).forEach(([dia, prato]) => {
        msg += `▪️ *${dia}:*\n   ${prato}\n\n`;
    });
    
    msg += '━━━━━━━━━━━━━━━\n✨ _É fácil ser feliz aqui_ ✨';
    
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}