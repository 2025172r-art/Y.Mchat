self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}
  const title = data.title || 'YM';
  const options = {
    body: data.body || '',
    tag: data.tag || 'ym-default',
    silent: true,
    data: data.data || data
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const payload = event.notification.data || {};
  event.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (list[0]) {
      list[0].postMessage({ type: 'YM_NOTIFY_CLICK', data: payload });
      return list[0].focus();
    }
    return self.clients.openWindow('/#chat-messages');
  })());
});
