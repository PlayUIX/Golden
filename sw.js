const CACHE_NAME = 'golden-v5';
const ASSETS = ['./', './index.html', './manifest.json', './logo.png'];
const DB_NAME  = 'golden-sw-db';
const DB_VER   = 1;

function swDbOpen() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, DB_VER);
    r.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
    };
    r.onsuccess = e => res(e.target.result);
    r.onerror   = () => rej();
  });
}
async function swDbGet(key) {
  try {
    const db = await swDbOpen();
    return new Promise((res) => {
      const r = db.transaction('kv','readonly').objectStore('kv').get(key);
      r.onsuccess = () => res(r.result);
      r.onerror   = () => res(null);
    });
  } catch(e){ return null; }
}
async function swDbSet(key, val) {
  try {
    const db = await swDbOpen();
    return new Promise((res) => {
      const tx = db.transaction('kv','readwrite');
      tx.objectStore('kv').put(val, key);
      tx.oncomplete = () => res();
      tx.onerror    = () => res();
    });
  } catch(e){}
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(ASSETS.map(url =>
        fetch(url).then(r => cache.put(url, r)).catch(() => {})
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => { self.clients.claim(); rescheduleAlarms(); })
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (url.includes('firebaseio.com') || url.includes('googleapis') || url.includes('gstatic') || url.includes('fonts.')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic')
          caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => null);
      return cached || net;
    })
  );
});

self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(showNotif(d.title, d.body));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
      const open = list.find(c => c.url.includes('index') || c.url.endsWith('/'));
      if (open) return open.focus();
      return clients.openWindow('./');
    })
  );
});

let _alarmIds = [];
function clearAlarms() { _alarmIds.forEach(clearTimeout); _alarmIds = []; }

async function rescheduleAlarms() {
  clearAlarms();
  const sched = await swDbGet('schedule');
  if (!sched || sched.cancelled || !Array.isArray(sched.alarms)) return;
  const now = Date.now();
  sched.alarms.forEach(a => {
    const delay = a.fireAt - now;
    if (delay < 1000 || delay > 8*24*60*60*1000) return;
    const id = setTimeout(async () => {
      const s = await swDbGet('schedule');
      if (!s || s.cancelled) return;
      await showNotif(a.title, a.body);
    }, delay);
    _alarmIds.push(id);
  });
}

self.addEventListener('message', async e => {
  const { type } = e.data || {};
  if (type === 'LOCAL_NOTIF') {
    await showNotif(e.data.title, e.data.body);
  }
  if (type === 'SAVE_SESSION') {
    await swDbSet('session', e.data.session || null);
    if (e.data.schedule) { await swDbSet('schedule', e.data.schedule); rescheduleAlarms(); }
  }
  if (type === 'CLEAR_SESSION') {
    await swDbSet('session', null);
    await swDbSet('schedule', { cancelled: true, alarms: [] });
    clearAlarms();
  }
  if (type === 'DID_ORDER') {
    await swDbSet('schedule', { cancelled: true, alarms: [] });
    clearAlarms();
  }
  if (type === 'GET_SESSION') {
    const session  = await swDbGet('session');
    const schedule = await swDbGet('schedule');
    if (e.source) e.source.postMessage({ type: 'SESSION_DATA', session, schedule });
  }
});

function showNotif(title, body) {
  return self.registration.showNotification(title || '🍽️ Golden Cardápio', {
    body:    body || 'Faça seu pedido da semana!',
    icon:    './logo.png',
    badge:   './logo.png',
    vibrate: [200,100,200,100,300],
    tag:     'golden-lembrete',
    renotify: true
  });
}
