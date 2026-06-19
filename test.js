// Get HTML elements for testing
const hiWindow = document.getElementById('hi-window');
const hiSprite = document.getElementById('hi-sprite');
const hiCloseBtn = document.getElementById('hi-close-btn');
const crashScreen = document.getElementById('crash-screen');
const endSound = new Audio('sounds/end.mp3');

let testSeconds = 0;
let testTimer = null;

// --- INSTANT TEST START ---
console.log("Test script loaded successfully!");

// 1. Force the Hi window to appear in the center right away to check layout
hiWindow.classList.remove('hidden');
hiWindow.style.left = '100px';
hiWindow.style.top = '100px';

// 2. Start a fast timer to check the phases (swapping every 2 seconds)
testTimer = setInterval(tickTest, 2000);

function tickTest() {
    testSeconds++;
    console.log("Current Test Step: " + testSeconds);

    if (testSeconds === 1) {
        console.log("Testing Phase 1: Normal");
        hiSprite.src = 'assets/hi_normal.png';
    } 
    else if (testSeconds === 2) {
        console.log("Testing Phase 2: Warning");
        hiSprite.src = 'assets/hi_warning.png';
    } 
    else if (testSeconds === 3) {
        console.log("Testing Phase 3: Death");
        hiSprite.src = 'assets/hi_death.png';
        clearInterval(testTimer);
        
        // Trigger crash automatically after 2 seconds on the death face
        setTimeout(() => {
            console.log("Triggering blue screen crash test...");
            crashScreen.classList.remove('hidden');
            endSound.play().catch(err => {
                console.log("Audio couldn't auto-play yet, click the screen first!");
            });
        }, 2000);
    }
}

// Allow closing during test to stop the cycle
hiCloseBtn.addEventListener('click', () => {
    console.log("Close clicked! Stopping test.");
    clearInterval(testTimer);
    hiWindow.classList.add('hidden');
});

// Click crash screen to reset test
crashScreen.addEventListener('click', () => {
    location.reload(); // Reloads page to restart test loop
});

// --- UNIVERSAL DRAG AND DROP SYSTEM (Included so you can test dragging) ---
let currentTargetWindow = null;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

document.addEventListener('mousedown', (e) => {
    const header = e.target.closest('.window-header');
    if (header) {
        isDragging = true;
        currentTargetWindow = header.parentElement;
        
        document.querySelectorAll('.window').forEach(w => w.style.zIndex = "10");
        currentTargetWindow.style.zIndex = "100";
        
        offsetX = e.clientX - currentTargetWindow.offsetLeft;
        offsetY = e.clientY - currentTargetWindow.offsetTop;
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging && currentTargetWindow) {
        currentTargetWindow.style.left = (e.clientX - offsetX) + 'px';
        currentTargetWindow.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    currentTargetWindow = null;
});
