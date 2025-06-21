// Load the WebAssembly module
let stackModule;

// DOM elements
const stackVisual = document.getElementById('stackVisual');
const stackSize = document.getElementById('stackSize');
const stackMaxSize = document.getElementById('stackMaxSize');
const valueInput = document.getElementById('valueInput');
const pushBtn = document.getElementById('pushBtn');
const popBtn = document.getElementById('popBtn');
const peekBtn = document.getElementById('peekBtn');
const opResult = document.getElementById('opResult');

// Initialize the UI when the WASM module is loaded
StackModule().then(module => {
    stackModule = module;
    stackMaxSize.textContent = stackModule.maxSize();
    updateStackVisualization();
}).catch(error => {
    console.error('Failed to load WASM module:', error);
    document.body.innerHTML = `<div class="error">Failed to load WebAssembly module. Please make sure your browser supports WebAssembly.</div>`;
});

// Update the stack visualization
function updateStackVisualization() {
    // Clear the current visualization
    stackVisual.innerHTML = '';
    
    // Get the current stack elements
    const elements = stackModule.getElements();
    const size = stackModule.size();
    
    // Update size display
    stackSize.textContent = size;
    
    // If stack is empty, show a placeholder
    if (size === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Stack is empty';
        emptyMessage.style.color = '#999';
        emptyMessage.style.padding = '20px';
        stackVisual.appendChild(emptyMessage);
        return;
    }
    
    // Create elements for each item in the stack
    for (let i = 0; i < size; i++) {
        const stackItem = document.createElement('div');
        stackItem.className = 'stack-item';
        stackItem.textContent = elements[i];
        
        // Highlight the top element
        if (i === size - 1) {
            stackItem.classList.add('top');
        }
        
        stackVisual.appendChild(stackItem);
    }
}

// Event handlers
pushBtn.addEventListener('click', () => {
    const value = parseInt(valueInput.value);
    
    if (isNaN(value)) {
        opResult.textContent = 'Please enter a valid number';
        return;
    }
    
    if (stackModule.isFull()) {
        opResult.textContent = 'Stack is full (Stack Overflow)';
        return;
    }
    
    const success = stackModule.push(value);
    
    if (success) {
        opResult.textContent = `Pushed ${value} onto the stack`;
        valueInput.value = '';
        updateStackVisualization();
    } else {
        opResult.textContent = 'Failed to push value (Stack Overflow)';
    }
});

popBtn.addEventListener('click', () => {
    if (stackModule.isEmpty()) {
        opResult.textContent = 'Stack is empty (Stack Underflow)';
        return;
    }
    
    const value = stackModule.pop();
    
    if (value !== -1) {
        opResult.textContent = `Popped ${value} from the stack`;
        updateStackVisualization();
    } else {
        opResult.textContent = 'Failed to pop value (Stack Underflow)';
    }
});

peekBtn.addEventListener('click', () => {
    if (stackModule.isEmpty()) {
        opResult.textContent = 'Stack is empty (Cannot peek)';
        return;
    }
    
    const value = stackModule.peek();
    
    if (value !== -1) {
        opResult.textContent = `Top element is ${value}`;
    } else {
        opResult.textContent = 'Failed to peek (Stack is empty)';
    }
});

// Add keyboard event listeners
valueInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        pushBtn.click();
    }
}); 