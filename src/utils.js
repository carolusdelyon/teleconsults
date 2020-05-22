// import './serviceworker';

const notificationServer = 'http://18.217.185.213:5000/';

export function registertNotifications({ username }) {
    // Register a Service Worker.
    // navigator.serviceWorker.register('./serviceworker.js');

    navigator.serviceWorker.ready
        .then(function (registration) {
            // Use the PushManager to get the user's subscription to the push service.
            return registration.pushManager.getSubscription()
                .then(async function (subscription) {
                    // If a subscription was found, return it.
                    if (subscription) {
                        return subscription;
                    }

                    // Get the server's public key
                    const response = await fetch(notificationServer + 'vapidPublicKey');
                    const vapidPublicKey = await response.text();
                    // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
                    // urlBase64ToUint8Array() is defined in /tools.js
                    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

                    // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
                    // send notifications that don't have a visible effect for the user).
                    return registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedVapidKey
                    });
                });
        }).then(function (subscription) {
            // Send the subscription details to the server using the Fetch API.
            fetch(notificationServer + 'register', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    subscription: subscription,
                    username
                }),
            });

            // document.querySelector('#send').onclick = () => {
            // console.log('sending...');
            // fetch(notificationServer + 'sendNotification', {
            //     method: 'post',
            //     headers: {
            //         'Content-type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         subscription: subscription,
            //         username: 99
            //     }),
            // });
            // };

            // document.querySelector('#unsusbsribe').onclick = () => {
            //     navigator.serviceWorker.ready.then(function (reg) {
            //         reg.pushManager.getSubscription().then(function (subscription) {
            //             subscription.unsubscribe().then(function (successful) {
            //                 console.log(`success unsubscribing`);
            //             }).catch(function (e) {
            //                 console.log(`error unsubscribing: ${e}`);
            //             })
            //         })
            //     });
            // };
        });
}

export function unsusbsribe() {
    navigator.serviceWorker.ready.then(function (reg) {
        reg.pushManager.getSubscription().then(function (subscription) {
            subscription.unsubscribe().then(function (successful) {
                console.log(`success unsubscribing`);
            }).catch(function (e) {
                console.log(`error unsubscribing: ${e}`);
            })
        })
    });
}

// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
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