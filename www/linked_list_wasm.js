// Mock WebAssembly module for linked list
function LinkedListModule() {
    // Create a simple linked list implementation in JavaScript
    let elements = [];
    const maxSize = 20;

    return Promise.resolve({
        isEmpty: function() {
            return elements.length === 0;
        },
        isFull: function() {
            return elements.length >= maxSize;
        },
        size: function() {
            return elements.length;
        },
        maxSize: function() {
            return maxSize;
        },
        insertAtBeginning: function(value) {
            if (elements.length >= maxSize) {
                return false;
            }
            elements.unshift(value);
            return true;
        },
        insertAtEnd: function(value) {
            if (elements.length >= maxSize) {
                return false;
            }
            elements.push(value);
            return true;
        },
        insertAtPosition: function(value, position) {
            if (elements.length >= maxSize || position > elements.length) {
                return false;
            }
            elements.splice(position, 0, value);
            return true;
        },
        deleteAtBeginning: function() {
            if (elements.length === 0) {
                return false;
            }
            elements.shift();
            return true;
        },
        deleteAtEnd: function() {
            if (elements.length === 0) {
                return false;
            }
            elements.pop();
            return true;
        },
        deleteAtPosition: function(position) {
            if (elements.length === 0 || position >= elements.length) {
                return false;
            }
            elements.splice(position, 1);
            return true;
        },
        search: function(value) {
            return elements.indexOf(value);
        },
        getElements: function() {
            return elements;
        },
        clear: function() {
            elements = [];
        }
    });
} 