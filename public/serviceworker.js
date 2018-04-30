self.addEventListener("push", (event) => {
    const payload = event.data ? event.data.json() : 'no payload';
    console.log(payload);
    let title = payload.title;
    let body = payload.body;
    let tag = Math.random().toString(36).substring(7);
    let icon = '/images/icons/android-chrome-512x512.png';
    event.waitUntil(
      self.registration.showNotification(title, { body, icon, tag })
    )
});

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(
    self.clients.matchAll().then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow('/');
    })
  );
});