// Get HTML Elements
const gameIcon = document.getElementById('game-icon');
const appWindow = document.getElementById('app-window');
const closeBtn = document.getElementById('close-btn');
const windowHeader = document.getElementById('window-header');

// --- OPEN & CLOSE SYSTEM ---

// Open window on double click
gameIcon.addEventListener('dblclick', () => {
    appWindow.classList.remove('hidden');
});

// Close window on click
closeBtn.addEventListener('click', () => {
    appWindow.classList.add('hidden');
});


// --- DRAG AND DROP SYSTEM ---

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Mouse down on the header bar starts the drag
windowHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    
    // Calculate the distance from mouse cursor to top-left corner of the window
    offsetX = e.clientX - appWindow.offsetLeft;
    offsetY = e.clientY - appWindow.offsetTop;
});

// Mouse move updates the window position if dragging is active
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        appWindow.style.left = (e.clientX - offsetX) + 'px';
        appWindow.style.top = (e.clientY - offsetY) + 'px';
    }
});

// Mouse up anywhere stops the drag
document.addEventListener('mouseup', () => {
    isDragging = false;
});
