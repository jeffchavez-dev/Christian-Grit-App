// Christian Grit — Service Worker
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});

self.addEventListener('push', e => {
  const data = e.data?.json() ?? { title: 'Christian Grit', body: 'Time for your daily disciplines.' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-512.svg',
      badge: '/icon-192.svg',
      vibrate: [200, 100, 200],
    })
  );
});
