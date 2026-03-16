importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:"AIzaSyDT9z94QHYSHutz8yAWwU8lDZ-SdSFKIRY",
  authDomain:"golden-cardapio-33266.firebaseapp.com",
  databaseURL:"https://golden-cardapio-33266-default-rtdb.firebaseio.com",
  projectId:"golden-cardapio-33266",
  storageBucket:"golden-cardapio-33266.firebasestorage.app",
  messagingSenderId:"93594774161",
  appId:"1:93594774161:web:6d45ee35b860503fb6ad30"
});

const messaging = firebase.messaging();

// Notificações em background (app fechado ou em outra aba)
messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || '🍽️ Golden Cardápio', {
    body: body || 'Faça seu pedido da semana!',
    icon: './logo.png',
    badge: './logo.png',
    vibrate: [200, 100, 200, 100, 300],
    tag: 'golden-lembrete',
    renotify: true,
    data: { url: './' }
  });
});

// Clique na notificação abre o app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('golden') || c.url.endsWith('/')) return c.focus();
      }
      return clients.openWindow('./');
    })
  );
});
