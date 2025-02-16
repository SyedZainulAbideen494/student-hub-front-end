self.addEventListener("push", (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/logo192.png", // Change to your app icon
    });
  });
  