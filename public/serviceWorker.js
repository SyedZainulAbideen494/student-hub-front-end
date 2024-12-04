self.addEventListener('push', (event) => {
  // Log the event for debugging
  console.log('Push Notification Received:', event);

  // Extract data from the event
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Notification';
  const options = {
    body: data.message || 'You have a new notification.',
    icon: data.icon || '/icon.png', // Optional: provide a default icon
    badge: data.badge || '/badge.png', // Optional: provide a default badge
    actions: data.actions || [], // Optional: provide action buttons
  };

  // Show the notification
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  // Close the notification
  event.notification.close();

  // Perform some action, like opening a URL
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('Service Worker Installed:', event);
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('Service Worker Activated:', event);
});
