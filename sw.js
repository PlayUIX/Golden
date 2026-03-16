const CACHE_NAME = 'golden-cardapio-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(ASSETS.map(url =>
        fetch(url).then(r => cache.put(url, r)).catch(() => {})
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('firebaseio.com') || e.request.url.includes('firebasejs')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => null);
      return cached || network;
    })
  );
});

// Recebe notificações push do admin
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || '🍽️ Golden Cardápio', {
      body: data.body || 'Não esqueça de fazer seu pedido!',
      icon: './logo.png',
      badge: './logo.png',
      vibrate: [200, 100, 200],
      tag: 'golden-lembrete',
      renotify: true,
      data: { url: './' }
    })
  );
});

// Clique na notificação abre o app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window'}).then(list => {
      for (const c of list) {
        if (c.url.includes('index') || c.url.endsWith('/')) {
          return c.focus();
        }
      }
      return clients.openWindow('./');
    })
  );
});

// Mensagem do app → mostra notificação local
self.addEventListener('message', e => {
  if (e.data?.type === 'LOCAL_NOTIF') {
    self.registration.showNotification(e.data.title || '🍽️ Golden Cardápio', {
      body: e.data.body || 'Faça seu pedido da semana!',
      icon: './logo.png',
      badge: './logo.png',
      vibrate: [200, 100, 200, 100, 300],
      tag: 'golden-lembrete',
      renotify: true
    });
  }
});

