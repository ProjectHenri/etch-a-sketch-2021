const INITIAL_GRID_SIZE = 8; // Default size of the grid;
const INPUTS = document.querySelectorAll('button, input'); // A list of inputs the user can use to modify the drawing board
const GRID = document.querySelector('#grid');
let gridSquares = [];
let rainbowSelected;
let shadingSelected;

// Initialize a default 8x8 grid

window.onload = createGrid(INITIAL_GRID_SIZE);

function createGrid(squares){
    removeExistingGrid(); // If present, deletes existing grid before creating a new one
    for(let i=0; i<Math.pow(squares,2); i++){
        GRID.appendChild(document.createElement('div'));
    }
    GRID.style.gridTemplate = `repeat(${squares}, 1fr) / repeat(${squares}, 1fr)`;
    initGridSquares(); // Applies default styling and responsive behaviour to the squares in the grid

}

function removeExistingGrid(){
    while (GRID.hasChildNodes()) {
        GRID.removeChild(GRID.firstChild);
    }
}

function initGridSquares(){
    let gridSquares = Array.from(document.querySelectorAll('#grid > div'));
    gridSquares.forEach(square => {
        square.classList.add('gridSquares');
        square.addEventListener('mouseover', colorSquares);
        square.style.backgroundColor = 'transparent';
    });
}

function colorSquares(event){
   
    if(rainbowSelected){
        event.target.style.backgroundColor = `rgba(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, 1.0)`;
    }
    else if(shadingSelected){
            let currentColor = event.target.style.backgroundColor;
            let opacity = 0;
            if (currentColor.includes('rgb(40, 40, 40)')){
                return; // Maximum opacity has been reached
            }else if(!currentColor.includes('rgba') || currentColor === 'transparent'){
                currentColor = 'rgba(40, 40, 40, 0.0)'; // Reset the color and alpha value for non-black squares
            }
            opacity = Number(currentColor.substring(17,20)); // Get the alpha value for the current square
            event.target.style.backgroundColor = `rgba(40, 40, 40, ${opacity+0.1})`;
    }else{
        event.target.style.backgroundColor = 'rgba(40, 40, 40, 1.0)';
    }
}

// Adds functionality to inputs that can be used to modify the drawing board

for(let i = 0; i<INPUTS.length; i++){
    let input = INPUTS[i];
    let inputID = INPUTS[i].getAttribute('id');
    switch(inputID){
        case 'slider':
            input.addEventListener('input', (e) => {
                createGrid(e.target.value);
                let sliderText = document.querySelector('#sliderText');
                sliderText.textContent = `Grid size: ${e.target.value}x${e.target.value}`
            });
            break;
        case 'clear':
            input.addEventListener('click', (e) => {
                initGridSquares();
            });
            break;
        case 'rainbow':
            input.addEventListener('click', (e) => {
                shadingSelected = false; // Deselecting the shading button if it's still on
                rainbowSelected =  rainbowSelected ? false : true;
                addButtonClasses(e);
            });
            break;
        case 'black':
            input.addEventListener('click', (e) => {
                rainbowSelected = false; // Deselecting the rainbow button if it's still on
                shadingSelected = false; // Deselecting the shading button if it's still on
                addButtonClasses(e);
            });
            break;
        case 'shading':
            input.addEventListener('click', (e) => {
                rainbowSelected = false; // Deselecting the rainbow button if it's still on
                shadingSelected =  shadingSelected ? false : true;
                addButtonClasses(e);
            });
            break;
    }
}

// Adds styling to buttons that are currently active

function addButtonClasses(event) {
    event.target.classList.toggle('buttonOn');
    for(let i = 0; i<INPUTS.length; i++){
        let input = INPUTS[i];
        if(input.classList.contains('buttonOn') && (input.getAttribute('id') != event.target.getAttribute('id'))){
            input.classList.remove('buttonOn'); 
        }
    }
}