// list module (wasm)
let listModule;

// refs to DOM
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

LinkedListModule().then(module => {
    listModule = module;
    listMaxSize.textContent = listModule.maxSize();
    updateListVisualization();
}).catch(error => {
    console.error('WASM load failed:', error);
    document.body.innerHTML = `<div class="error">Couldn't load WebAssembly. Make sure your browser supports it.</div>`;
});

// refresh the list view
function updateListVisualization() {
    listVisual.innerHTML = '';

    const elements = listModule.getElements();
    const size = listModule.size();

    listSize.textContent = size;

    if (size === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Linked List is empty';
        emptyMessage.style.color = '#999';
        emptyMessage.style.padding = '20px';
        listVisual.appendChild(emptyMessage);
        return;
    }

    for (let i = 0; i < size; i++) {
        const node = document.createElement('div');
        node.className = 'node';

        const dataElement = document.createElement('div');
        dataElement.className = 'node-data';
        dataElement.textContent = elements[i];
        node.appendChild(dataElement);

        if (i < size - 1) {
            const pointerElement = document.createElement('div');
            pointerElement.className = 'node-pointer';
            const arrow = document.createElement('div');
            arrow.className = 'arrow';
            pointerElement.appendChild(arrow);
            node.appendChild(pointerElement);
        } else {
            // last node -> null
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

// highlight one node by index
function highlightNode(position) {
    const nodes = listVisual.querySelectorAll('.node');
    nodes.forEach(node => node.classList.remove('highlighted'));

    if (position >= 0 && position < nodes.length) {
        nodes[position].classList.add('highlighted');
    }
}

// --- event handlers ---
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

// keyboard: enter on value -> insert end or at position depending on field
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
