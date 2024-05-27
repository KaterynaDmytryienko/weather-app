/**
 * Listens for the 'load' event on the window to handle online and offline status updates.
 * The function checks the navigator's online status and redirects the user to specific pages 
 * based on their connectivity. 
 * 
 * If the browser is online, and the current page is not '/src/index.html', 
 * it redirects to '/src/index.html'. Conversely, if the browser is offline, 
 * and the current page is not '/src/fallback.html', it redirects to '/src/fallback.html'.
 */

window.addEventListener('load', () => {
    function updateOnlineStatus() {
        const pathname = window.location.pathname;
        if (navigator.onLine) {
            if (!pathname.endsWith('/index.html')) {
                window.location.href = 'index.html';
            }
        } else {
            if (!pathname.endsWith('/src/fallback.html')) {
                window.location.href = 'fallback.html';
            }
        }
    }
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);


    updateOnlineStatus();
});

/**
 * Handles DOMContentLoaded event to set up interactive animations for an SVG element.
 * This script expects an SVG with the ID 'sun-svg' and a circle element within it with the ID 'sun-circle'.
 * It listens for click events on the 'sun-circle', toggling its color between yellow and orange,
 * and starting or stopping a rotation animation on the 'sun-svg'.
 */
document.addEventListener("DOMContentLoaded", function () {
    const svg = document.getElementById("sun-svg");
    const sunCircle = document.getElementById("sun-circle");

    let animationFrameId;
    let rotation = 0;
    let isAnimating = false;

    function animateSvg() {
        console.log("Animating");
        rotation = (rotation + 1) % 360;
        svg.style.transform = `rotate(${rotation}deg)`;
        animationFrameId = requestAnimationFrame(animateSvg);
    }

    sunCircle.addEventListener('click', function () {
        console.log("Circle clicked");
        const currentFill = sunCircle.getAttribute('fill');
        console.log("Current fill:", currentFill);
        sunCircle.setAttribute('fill', currentFill === 'yellow' ? 'orange' : 'yellow');

        if (!isAnimating) {
            console.log("Starting animation");
            isAnimating = true;
            animateSvg();
        } else {
            console.log("Stopping animation");
            cancelAnimationFrame(animationFrameId);
            isAnimating = false;
        }
    });
});