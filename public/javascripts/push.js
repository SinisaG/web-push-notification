/*
** HELPERS 
*/
function urlBase64ToUint8Array(base64String) {
	var padding = '='.repeat((4 - base64String.length % 4) % 4);
	var base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	var rawData = window.atob(base64);
	var outputArray = new Uint8Array(rawData.length);

	for (var i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function postAjax(url, data, success) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			success();
		}
	};
	xhr.send(JSON.stringify(data));
}

/* APPLICATION */ 
// Register the serviceWorker script at /serviceworker.js from our server if supported
const subscribeBtn = document.getElementById('push-subscribe');
if ('serviceWorker' in navigator) {
	allowNotificaitons();
	navigator.serviceWorker.register('/serviceworker.js').then((serviceWorkerRegistration) => {
		serviceWorkerRegistration.pushManager.getSubscription().then((subscription) => {
			if (subscription) {
				subscribeBtn.innerText = 'Unsubscribe';
			}
		})
	});
	subscribeBtn.addEventListener('click', (e) => {
		navigator.serviceWorker.ready
			.then((serviceWorkerRegistration) => {
				serviceWorkerRegistration.pushManager.getSubscription()
					.then((subscription) => {
						if (subscribeBtn.innerText === 'Unsubscribe') {
							subscribeBtn.innerText = 'Subscribe';
							return subscription.unsubscribe().then(() => false).catch(() => false); 
						}
						if (subscription) {
							return subscription;
						}
						return serviceWorkerRegistration.pushManager.subscribe({
							userVisibleOnly: true,
							applicationServerKey: urlBase64ToUint8Array(window.homeday.vapid)
						});
					}).then((subscription) => {
						if (subscription) {
							postAjax('/subscribe', subscription, (res) => { subscribeBtn.innerText = 'Unsubscribe';  });
						}	
					}).catch((e) => {
						console.log(e);
					})
			})
	});
} else {
	// Otherwise, no push notifications :(
	console.error('Service worker is not supported in this browser');
}

function allowNotificaitons() {
	// Let's check if the browser supports notifications
	if (("Notification" in window)) {
		// Otherwise, we need to ask the user for permission
		if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {
				// If the user accepts, let's create a notification
				if (permission === "granted") {
					console.log("Permission to receive notifications has been granted");
				}
			});
		}
	}
}