#include <emscripten/bind.h>
#include <emscripten/emscripten.h>
#include "../include/LinkedList.h"
#include <vector>
#include <string>

LinkedList linkedList(20);

bool isEmpty() {
    return linkedList.isEmpty();
}

bool isFull() {
    return linkedList.isFull();
}

size_t size() {
    return linkedList.getSize();
}

size_t maxSize() {
    return linkedList.getMaxSize();
}

bool insertAtBeginning(int value) {
    return linkedList.insertAtBeginning(value);
}

bool insertAtEnd(int value) {
    return linkedList.insertAtEnd(value);
}

bool insertAtPosition(int value, size_t position) {
    return linkedList.insertAtPosition(value, position);
}

bool deleteAtBeginning() {
    return linkedList.deleteAtBeginning();
}

bool deleteAtEnd() {
    return linkedList.deleteAtEnd();
}

bool deleteAtPosition(size_t position) {
    return linkedList.deleteAtPosition(position);
}

int search(int value) {
    return linkedList.search(value);
}

emscripten::val getElements() {
    std::vector<int> elements = linkedList.getElements();
    return emscripten::val(emscripten::typed_memory_view(
        elements.size(),
        elements.data()
    ));
}

void clear() {
    linkedList.clear();
}

EMSCRIPTEN_BINDINGS(linked_list_module) {
    emscripten::function("isEmpty", &isEmpty);
    emscripten::function("isFull", &isFull);
    emscripten::function("size", &size);
    emscripten::function("maxSize", &maxSize);
    emscripten::function("insertAtBeginning", &insertAtBeginning);
    emscripten::function("insertAtEnd", &insertAtEnd);
    emscripten::function("insertAtPosition", &insertAtPosition);
    emscripten::function("deleteAtBeginning", &deleteAtBeginning);
    emscripten::function("deleteAtEnd", &deleteAtEnd);
    emscripten::function("deleteAtPosition", &deleteAtPosition);
    emscripten::function("search", &search);
    emscripten::function("getElements", &getElements);
    emscripten::function("clear", &clear);
}
