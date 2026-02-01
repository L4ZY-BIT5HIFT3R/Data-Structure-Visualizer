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
    Stack(size_t size = 10) : maxSize(size) {}

    bool isEmpty() const {
        return elements.empty();
    }

    bool isFull() const {
        return elements.size() >= maxSize;
    }

    void push(int value) {
        if (isFull())
            throw std::overflow_error("Stack overflow");
        elements.push_back(value);
    }

    int pop() {
        if (isEmpty())
            throw std::underflow_error("Stack underflow");
        int value = elements.back();
        elements.pop_back();
        return value;
    }

    int peek() const {
        if (isEmpty())
            throw std::underflow_error("Stack underflow");
        return elements.back();
    }

    size_t size() const {
        return elements.size();
    }

    size_t getMaxSize() const {
        return maxSize;
    }

    std::vector<int> getElements() const {
        return elements;
    }
};

#endif
