self.addEventListener('push', function(event) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: data.icon || 'default-icon.png',
    });
  });