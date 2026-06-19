// Get HTML Elements
const gameIcon = document.getElementById('game-icon');
const appWindow = document.getElementById('app-window');
const closeBtn = document.getElementById('close-btn');

// Hi Elements
const hiWindow = document.getElementById('hi-window');
const hiCloseBtn = document.getElementById('hi-close-btn');
const hiSprite = document.getElementById('hi-sprite');

// Crash Elements
const crashScreen = document.getElementById('crash-screen');
const endSound = new Audio('sounds/end.mp3');

// Game State Tracking Variables
let gameActive = false;
let hiTimer = null;
let hiSeconds = 0;

// --- OPEN & CLOSE SYSTEM ---

// Open main game window and kick off the challenge loop
gameIcon.addEventListener('dblclick', () => {
    if (!gameActive) {
        appWindow.classList.remove('hidden');
        // Center main game window on startup
        appWindow.style.left = (window.innerWidth / 2 - 160) + 'px';
        appWindow.style.top = (window.innerHeight / 2 - 100) + 'px';
        
        gameActive = true;
        startHiLoop();
    }
});

// Close main window
closeBtn.addEventListener('click', () => {
    appWindow.classList.add('hidden');
    stopHiLoop();
    hiWindow.classList.add('hidden');
    gameActive = false;
});

// Close Hi window to save yourself and reset his cycle
hiCloseBtn.addEventListener('click', () => {
    hiWindow.classList.add('hidden');
    resetHiCycle();
});


// --- "HI!" ENTITY ENGINE (8 SECOND CLOCK) ---

function startHiLoop() {
    resetHiCycle();
    // Spawns Hi window at a random desktop spot after 3 seconds
    setTimeout(() => {
        if (!gameActive) return;
        hiWindow.classList.remove('hidden');
        hiWindow.style.left = Math.random() * (window.innerWidth - 340) + 'px';
        hiWindow.style.top = Math.random() * (window.innerHeight - 300) + 'px';
        
        // Start ticking down the 8 seconds
        hiTimer = setInterval(tickHi, 1000);
    }, 3000);
}

function tickHi() {
    hiSeconds++;

    if (hiSeconds <= 4) {
        // Phase 1: Normal Phase
        hiSprite.src = 'assets/hi_normal.png';
    } 
    else if (hiSeconds >= 5 && hiSeconds <= 7) {
        // Phase 2: Warning Phase
        hiSprite.src = 'assets/hi_warning.png';
    } 
    else if (hiSeconds >= 8) {
        // Phase 3: Attack Phase (Death Trigger)
        hiSprite.src = 'assets/hi_death.png';
        clearInterval(hiTimer);
        triggerComputerCrash();
    }
}

function resetHiCycle() {
    clearInterval(hiTimer);
    hiSeconds = 0;
    hiSprite.src = 'assets/hi_normal.png';
    if (gameActive) {
        // Queue up the next random spawn encounter
        startHiLoop();
    }
}

function stopHiLoop() {
    clearInterval(hiTimer);
    hiSeconds = 0;
}


// --- GLOBAL CRASH SYSTEM (GAME OVER) ---

function triggerComputerCrash() {
    gameActive = false;
    stopHiLoop();
    
    // Play crash track from sounds folder
    endSound.play().catch(e => console.log("Audio failed to auto-play: requires user interaction first."));
    
    // Unhide the crash interface over the whole screen
    crashScreen.classList.remove('hidden');
}

// Click anywhere on crash screen to reboot back to clean desktop state
crashScreen.addEventListener('click', () => {
    crashScreen.classList.add('hidden');
    appWindow.classList.add('hidden');
    hiWindow.classList.add('hidden');
});


// --- UNIVERSAL DRAG AND DROP SYSTEM ---

let currentTargetWindow = null;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Unified event listener to track window header clicking
document.addEventListener('mousedown', (e) => {
    const header = e.target.closest('.window-header');
    if (header) {
        isDragging = true;
        currentTargetWindow = header.parentElement;
        
        // Bring clicked window to the foreground view layer
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
