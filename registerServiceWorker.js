 /**
 * Checks for browser support for service workers and registers the service worker script.
 * The service worker script is located at './serviceWorker.js'. If the registration is successful,
 * a log message is displayed indicating the scope of the service worker registration.
 * If the registration fails, an error message is logged to the console to help diagnose the issue.
 */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('serviceWorker.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope: ', registration.scope);
                }, (err) => {
                    console.log('Service Worker registration failed: ', err);
                });
        });
    }