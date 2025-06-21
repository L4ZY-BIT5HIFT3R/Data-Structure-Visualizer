#ifndef STACK_H
#define STACK_H

#include <vector>
#include <stdexcept>
#include <string>

class Stack {
private:
    std::vector<int> elements;
    size_t maxSize;

public:
    // Constructor
    Stack(size_t size = 10) : maxSize(size) {}

    // Check if stack is empty
    bool isEmpty() const {
        return elements.empty();
    }

    // Check if stack is full
    bool isFull() const {
        return elements.size() >= maxSize;
    }

    // Push element to stack
    void push(int value) {
        if (isFull()) {
            throw std::overflow_error("Stack overflow");
        }
        elements.push_back(value);
    }

    // Pop element from stack
    int pop() {
        if (isEmpty()) {
            throw std::underflow_error("Stack underflow");
        }
        int value = elements.back();
        elements.pop_back();
        return value;
    }

    // Peek at the top element
    int peek() const {
        if (isEmpty()) {
            throw std::underflow_error("Stack underflow");
        }
        return elements.back();
    }

    // Get current size
    size_t size() const {
        return elements.size();
    }

    // Get max size
    size_t getMaxSize() const {
        return maxSize;
    }

    // Get all elements as a vector
    std::vector<int> getElements() const {
        return elements;
    }
};

#endif // STACK_H 