self.addEventListener('push', function(event) {
    const data = event.data.json();
    console.log('Push event received:', data); // Add this line to debug
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: data.icon || 'default-icon.png',
    });
  });