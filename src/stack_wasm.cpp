#include <emscripten/bind.h>
#include <emscripten/emscripten.h>
#include "../include/Stack.h"
#include <vector>
#include <string>

Stack stack(10);

bool isEmpty() {
    return stack.isEmpty();
}

bool isFull() {
    return stack.isFull();
}

bool push(int value) {
    try {
        stack.push(value);
        return true;
    } catch (const std::exception& e) {
        return false;
    }
}

int pop() {
    try {
        return stack.pop();
    } catch (const std::exception& e) {
        return -1;
    }
}

int peek() {
    try {
        return stack.peek();
    } catch (const std::exception& e) {
        return -1;
    }
}

size_t size() {
    return stack.size();
}

size_t maxSize() {
    return stack.getMaxSize();
}

emscripten::val getElements() {
    std::vector<int> elements = stack.getElements();
    return emscripten::val(emscripten::typed_memory_view(
        elements.size(),
        elements.data()
    ));
}

EMSCRIPTEN_BINDINGS(stack_module) {
    emscripten::function("isEmpty", &isEmpty);
    emscripten::function("isFull", &isFull);
    emscripten::function("push", &push);
    emscripten::function("pop", &pop);
    emscripten::function("peek", &peek);
    emscripten::function("size", &size);
    emscripten::function("maxSize", &maxSize);
    emscripten::function("getElements", &getElements);
}
