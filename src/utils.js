// from where we send web pushes notifications
const notificationServerUrl = 'http://localhost:6000/';
// from where we download the attachments
export const fileServerUrl = 'http://localhost:5000';

export const attachedFileSizeLimit = 5000000;

export function getUrlDownloadFromFileServer({ type, id, filename }) {
    return `${fileServerUrl}?id=${id}&type=${type}&filename=${filename}`;
}

export function registerNotifications({ username }) {
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
                    const response = await fetch(notificationServerUrl + 'vapidPublicKey');
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
            fetch(notificationServerUrl + 'register', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    subscription: subscription,
                    username
                }),
            });

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

export function timestampToDate(timestamp) {
    const date = new Date(Number(timestamp));
    const year = date.getFullYear();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day} / ${month} / ${year}`;
}



export function getHoursSinceDateJoomla(dataJoomla) {
    const dateParts = dataJoomla.split(',');
    const year = dateParts[1].trim().split(' ')[1].trim();
    const monthInit = dateParts[1].trim().split(' ')[0].trim();
    const day = dateParts[0].trim().split(' ')[1].trim();
    const hour = dateParts[2].trim().split(':')[0].trim();
    const minute = dateParts[2].trim().split(':')[1].trim();

    let month = null;
    switch (monthInit.toLowerCase()) {
        case 'enero':
            month = 0;
            break;
        case 'febrero':
            month = 1;
            break;
        case 'marzo':
            month = 2;
            break;
        case 'abril':
            month = 3;
            break;
        case 'mayo':
            month = 4;
            break;
        case 'junio':
            month = 5;
            break;
        case 'julio':
            month = 6;
            break;
        case 'agosto':
            month = 7;
            break;
        case 'septiembre':
            month = 8;
            break;
        case 'octubre':
            month = 9;
            break;
        case 'noviembre':
            month = 10;
            break;
        case 'diciembre':
            month = 11;
            break;
        default:
            Error('Month out of limits');
            break;
    }

    const now = new Date();
    const date = new Date(year, month, day, hour, minute);
    const diffMiliseconds = now - date;
    const hours = diffMiliseconds / (1000 * 60 * 60);
    return Math.round(hours);
}