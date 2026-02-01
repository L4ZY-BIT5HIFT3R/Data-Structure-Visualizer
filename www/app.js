// wasm module gets loaded here
let stackModule;

// grab refs to the stuff we need
const stackVisual = document.getElementById('stackVisual');
const stackSize = document.getElementById('stackSize');
const stackMaxSize = document.getElementById('stackMaxSize');
const valueInput = document.getElementById('valueInput');
const pushBtn = document.getElementById('pushBtn');
const popBtn = document.getElementById('popBtn');
const peekBtn = document.getElementById('peekBtn');
const opResult = document.getElementById('opResult');

// once WASM is ready, wire everything up
StackModule().then(module => {
    stackModule = module;
    stackMaxSize.textContent = stackModule.maxSize();
    updateStackVisualization();
}).catch(error => {
    console.error('WASM load failed:', error);
    document.body.innerHTML = `<div class="error">Couldn't load WebAssembly. Check that your browser supports it.</div>`;
});

// redraw the stack on screen
function updateStackVisualization() {
    stackVisual.innerHTML = '';

    const elements = stackModule.getElements();
    const size = stackModule.size();

    stackSize.textContent = size;

    if (size === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Stack is empty';
        emptyMessage.style.color = '#999';
        emptyMessage.style.padding = '20px';
        stackVisual.appendChild(emptyMessage);
        return;
    }

    for (let i = 0; i < size; i++) {
        const stackItem = document.createElement('div');
        stackItem.className = 'stack-item';
        stackItem.textContent = elements[i];

        // top of stack gets highlighted
        if (i === size - 1) {
            stackItem.classList.add('top');
        }

        stackVisual.appendChild(stackItem);
    }
}

// --- button handlers ---
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

// enter key = push
valueInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        pushBtn.click();
    }
});
