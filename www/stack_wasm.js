// Mock WebAssembly module for testing
function StackModule() {
    // Create a simple stack implementation in JavaScript
    let elements = [];
    const maxSize = 10;

    return Promise.resolve({
        isEmpty: function() {
            return elements.length === 0;
        },
        isFull: function() {
            return elements.length >= maxSize;
        },
        push: function(value) {
            if (elements.length >= maxSize) {
                return false;
            }
            elements.push(value);
            return true;
        },
        pop: function() {
            if (elements.length === 0) {
                return -1;
            }
            return elements.pop();
        },
        peek: function() {
            if (elements.length === 0) {
                return -1;
            }
            return elements[elements.length - 1];
        },
        size: function() {
            return elements.length;
        },
        maxSize: function() {
            return maxSize;
        },
        getElements: function() {
            return elements;
        }
    });
} 