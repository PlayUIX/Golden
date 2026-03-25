const path = require('path');
require('dotenv').config();
const express = require('express');

const app = express();
let groupChatId = null;

const PORT = process.env.PORT || 3000;

console.log('\n' + '='.repeat(80));
console.log('🍽️ GOLDEN CARDÁPIO SYSTEM - VERSÃO ESTÁVEL (SEM BOT AUTOMÁTICO)');
console.log('='.repeat(80) + '\n');
console.log('✅ Site rodando em: http://localhost:' + PORT);
console.log('⚠️ Bot automático desativado para garantir estabilidade.');
console.log('💡 Para enviar avisos ao grupo, use a opção "Enviar Aviso" no painel.\n');

// Servidor Web
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para gerar o link de envio manual (Simulação do que o bot faria)
app.get('/api/enviar-aviso', (req, res) => {
    const msg = "*🍽️ NOVO CARDÁPIO DISPONÍVEL!*\n\n" +
                "Clique aqui para fazer seu pedido:\n" +
                "http://localhost:" + PORT + "\n\n" +
                "_É fácil ser feliz aqui_ ✨";
    
    // Abre o WhatsApp Web com a mensagem pronta
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    res.redirect(url);
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor iniciado com sucesso!`);
    console.log(`📱 Para enviar aviso ao grupo, acesse: http://localhost:${PORT}/api/enviar-aviso`);
});const path = require('path');
require('dotenv').config();
const express = require('express');

const app = express();
let groupChatId = null;

const PORT = process.env.PORT || 3000;

console.log('\n' + '='.repeat(80));
console.log('🍽️ GOLDEN CARDÁPIO SYSTEM - VERSÃO ESTÁVEL (SEM BOT AUTOMÁTICO)');
console.log('='.repeat(80) + '\n');
console.log('✅ Site rodando em: http://localhost:' + PORT);
console.log('⚠️ Bot automático desativado para garantir estabilidade.');
console.log('💡 Para enviar avisos ao grupo, use a opção "Enviar Aviso" no painel.\n');

// Servidor Web
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para gerar o link de envio manual (Simulação do que o bot faria)
app.get('/api/enviar-aviso', (req, res) => {
    const msg = "*🍽️ NOVO CARDÁPIO DISPONÍVEL!*\n\n" +
                "Clique aqui para fazer seu pedido:\n" +
                "http://localhost:" + PORT + "\n\n" +
                "_É fácil ser feliz aqui_ ✨";
    
    // Abre o WhatsApp Web com a mensagem pronta
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    res.redirect(url);
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor iniciado com sucesso!`);
    console.log(`📱 Para enviar aviso ao grupo, acesse: http://localhost:${PORT}/api/enviar-aviso`);
});const path = require('path');
require('dotenv').config();
const express = require('express');

const app = express();
let groupChatId = null;

const PORT = process.env.PORT || 3000;

console.log('\n' + '='.repeat(80));
console.log('🍽️ GOLDEN CARDÁPIO SYSTEM - VERSÃO ESTÁVEL (SEM BOT AUTOMÁTICO)');
console.log('='.repeat(80) + '\n');
console.log('✅ Site rodando em: http://localhost:' + PORT);
console.log('⚠️ Bot automático desativado para garantir estabilidade.');
console.log('💡 Para enviar avisos ao grupo, use a opção "Enviar Aviso" no painel.\n');

// Servidor Web
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para gerar o link de envio manual (Simulação do que o bot faria)
app.get('/api/enviar-aviso', (req, res) => {
    const msg = "*🍽️ NOVO CARDÁPIO DISPONÍVEL!*\n\n" +
                "Clique aqui para fazer seu pedido:\n" +
                "http://localhost:" + PORT + "\n\n" +
                "_É fácil ser feliz aqui_ ✨";
    
    // Abre o WhatsApp Web com a mensagem pronta
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    res.redirect(url);
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor iniciado com sucesso!`);
    console.log(`📱 Para enviar aviso ao grupo, acesse: http://localhost:${PORT}/api/enviar-aviso`);
});