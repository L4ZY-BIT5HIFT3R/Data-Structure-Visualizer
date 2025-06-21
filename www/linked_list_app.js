// Load the WebAssembly module
let listModule;

// DOM elements
const listVisual = document.getElementById('listVisual');
const listSize = document.getElementById('listSize');
const listMaxSize = document.getElementById('listMaxSize');
const valueInput = document.getElementById('valueInput');
const positionInput = document.getElementById('positionInput');
const insertBeginBtn = document.getElementById('insertBeginBtn');
const insertEndBtn = document.getElementById('insertEndBtn');
const insertPosBtn = document.getElementById('insertPosBtn');
const deleteBeginBtn = document.getElementById('deleteBeginBtn');
const deleteEndBtn = document.getElementById('deleteEndBtn');
const deletePosBtn = document.getElementById('deletePosBtn');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const opResult = document.getElementById('opResult');

// Initialize the UI when the WASM module is loaded
LinkedListModule().then(module => {
    listModule = module;
    listMaxSize.textContent = listModule.maxSize();
    updateListVisualization();
}).catch(error => {
    console.error('Failed to load WASM module:', error);
    document.body.innerHTML = `<div class="error">Failed to load WebAssembly module. Please make sure your browser supports WebAssembly.</div>`;
});

// Update the linked list visualization
function updateListVisualization() {
    // Clear the current visualization
    listVisual.innerHTML = '';
    
    // Get the current list elements
    const elements = listModule.getElements();
    const size = listModule.size();
    
    // Update size display
    listSize.textContent = size;
    
    // If list is empty, show a placeholder
    if (size === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Linked List is empty';
        emptyMessage.style.color = '#999';
        emptyMessage.style.padding = '20px';
        listVisual.appendChild(emptyMessage);
        return;
    }
    
    // Create elements for each node in the linked list
    for (let i = 0; i < size; i++) {
        const node = document.createElement('div');
        node.className = 'node';
        
        // Create the data element
        const dataElement = document.createElement('div');
        dataElement.className = 'node-data';
        dataElement.textContent = elements[i];
        node.appendChild(dataElement);
        
        // Create the pointer element
        if (i < size - 1) {
            const pointerElement = document.createElement('div');
            pointerElement.className = 'node-pointer';
            
            const arrow = document.createElement('div');
            arrow.className = 'arrow';
            pointerElement.appendChild(arrow);
            
            node.appendChild(pointerElement);
        } else {
            // For the last node, add null pointer
            const pointerElement = document.createElement('div');
            pointerElement.className = 'node-pointer';
            
            const nullRef = document.createElement('div');
            nullRef.className = 'null-reference';
            nullRef.textContent = 'Ø';
            pointerElement.appendChild(nullRef);
            
            node.appendChild(pointerElement);
        }
        
        listVisual.appendChild(node);
    }
}

// Highlight a node by position
function highlightNode(position) {
    const nodes = listVisual.querySelectorAll('.node');
    
    // Remove existing highlights
    nodes.forEach(node => node.classList.remove('highlighted'));
    
    // Add highlight to the specified node
    if (position >= 0 && position < nodes.length) {
        nodes[position].classList.add('highlighted');
    }
}

// Event handlers
insertBeginBtn.addEventListener('click', () => {
    const value = parseInt(valueInput.value);
    
    if (isNaN(value)) {
        opResult.textContent = 'Please enter a valid number';
        return;
    }
    
    if (listModule.isFull()) {
        opResult.textContent = 'List is full';
        return;
    }
    
    const success = listModule.insertAtBeginning(value);
    
    if (success) {
        opResult.textContent = `Inserted ${value} at the beginning`;
        valueInput.value = '';
        updateListVisualization();
        highlightNode(0);
    } else {
        opResult.textContent = 'Failed to insert at beginning';
    }
});

insertEndBtn.addEventListener('click', () => {
    const value = parseInt(valueInput.value);
    
    if (isNaN(value)) {
        opResult.textContent = 'Please enter a valid number';
        return;
    }
    
    if (listModule.isFull()) {
        opResult.textContent = 'List is full';
        return;
    }
    
    const success = listModule.insertAtEnd(value);
    
    if (success) {
        const newSize = listModule.size();
        opResult.textContent = `Inserted ${value} at the end`;
        valueInput.value = '';
        updateListVisualization();
        highlightNode(newSize - 1);
    } else {
        opResult.textContent = 'Failed to insert at end';
    }
});

insertPosBtn.addEventListener('click', () => {
    const value = parseInt(valueInput.value);
    const position = parseInt(positionInput.value);
    
    if (isNaN(value)) {
        opResult.textContent = 'Please enter a valid number';
        return;
    }
    
    if (isNaN(position)) {
        opResult.textContent = 'Please enter a valid position';
        return;
    }
    
    if (listModule.isFull()) {
        opResult.textContent = 'List is full';
        return;
    }
    
    const success = listModule.insertAtPosition(value, position);
    
    if (success) {
        opResult.textContent = `Inserted ${value} at position ${position}`;
        valueInput.value = '';
        positionInput.value = '';
        updateListVisualization();
        highlightNode(position);
    } else {
        opResult.textContent = 'Failed to insert at position (invalid position or list full)';
    }
});

deleteBeginBtn.addEventListener('click', () => {
    if (listModule.isEmpty()) {
        opResult.textContent = 'List is empty';
        return;
    }
    
    const elements = listModule.getElements();
    const deletedValue = elements[0];
    const success = listModule.deleteAtBeginning();
    
    if (success) {
        opResult.textContent = `Deleted ${deletedValue} from the beginning`;
        updateListVisualization();
    } else {
        opResult.textContent = 'Failed to delete from beginning';
    }
});

deleteEndBtn.addEventListener('click', () => {
    if (listModule.isEmpty()) {
        opResult.textContent = 'List is empty';
        return;
    }
    
    const elements = listModule.getElements();
    const deletedValue = elements[elements.length - 1];
    const success = listModule.deleteAtEnd();
    
    if (success) {
        opResult.textContent = `Deleted ${deletedValue} from the end`;
        updateListVisualization();
    } else {
        opResult.textContent = 'Failed to delete from end';
    }
});

deletePosBtn.addEventListener('click', () => {
    const position = parseInt(positionInput.value);
    
    if (isNaN(position)) {
        opResult.textContent = 'Please enter a valid position';
        return;
    }
    
    if (listModule.isEmpty()) {
        opResult.textContent = 'List is empty';
        return;
    }
    
    const elements = listModule.getElements();
    
    if (position >= elements.length) {
        opResult.textContent = 'Invalid position';
        return;
    }
    
    const deletedValue = elements[position];
    const success = listModule.deleteAtPosition(position);
    
    if (success) {
        opResult.textContent = `Deleted ${deletedValue} from position ${position}`;
        positionInput.value = '';
        updateListVisualization();
    } else {
        opResult.textContent = 'Failed to delete from position';
    }
});

searchBtn.addEventListener('click', () => {
    const value = parseInt(valueInput.value);
    
    if (isNaN(value)) {
        opResult.textContent = 'Please enter a valid number to search';
        return;
    }
    
    const position = listModule.search(value);
    
    if (position !== -1) {
        opResult.textContent = `Found ${value} at position ${position}`;
        highlightNode(position);
    } else {
        opResult.textContent = `${value} not found in the list`;
    }
});

clearBtn.addEventListener('click', () => {
    if (listModule.isEmpty()) {
        opResult.textContent = 'List is already empty';
        return;
    }
    
    listModule.clear();
    opResult.textContent = 'List cleared';
    updateListVisualization();
});

// Add keyboard event listeners
valueInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (positionInput.value) {
            insertPosBtn.click();
        } else {
            insertEndBtn.click();
        }
    }
});

positionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        insertPosBtn.click();
    }
}); 