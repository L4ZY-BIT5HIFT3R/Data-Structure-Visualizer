#ifndef LINKED_LIST_H
#define LINKED_LIST_H

#include <vector>
#include <stdexcept>
#include <string>

// Node structure for linked list
struct Node {
    int data;
    Node* next;
    
    Node(int value) : data(value), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
    size_t size;
    size_t maxSize;

public:
    // Constructor
    LinkedList(size_t maxSize = 20) : head(nullptr), size(0), maxSize(maxSize) {}
    
    // Destructor
    ~LinkedList() {
        clear();
    }
    
    // Clear the list
    void clear() {
        Node* current = head;
        while (current != nullptr) {
            Node* temp = current;
            current = current->next;
            delete temp;
        }
        head = nullptr;
        size = 0;
    }
    
    // Check if list is empty
    bool isEmpty() const {
        return head == nullptr;
    }
    
    // Check if list is full
    bool isFull() const {
        return size >= maxSize;
    }
    
    // Get current size
    size_t getSize() const {
        return size;
    }
    
    // Get max size
    size_t getMaxSize() const {
        return maxSize;
    }
    
    // Insert at beginning
    bool insertAtBeginning(int value) {
        if (isFull()) {
            return false;
        }
        
        Node* newNode = new Node(value);
        newNode->next = head;
        head = newNode;
        size++;
        return true;
    }
    
    // Insert at end
    bool insertAtEnd(int value) {
        if (isFull()) {
            return false;
        }
        
        Node* newNode = new Node(value);
        
        if (isEmpty()) {
            head = newNode;
        } else {
            Node* current = head;
            while (current->next != nullptr) {
                current = current->next;
            }
            current->next = newNode;
        }
        
        size++;
        return true;
    }
    
    // Insert at position
    bool insertAtPosition(int value, size_t position) {
        if (isFull()) {
            return false;
        }
        
        if (position > size) {
            return false;
        }
        
        if (position == 0) {
            return insertAtBeginning(value);
        }
        
        if (position == size) {
            return insertAtEnd(value);
        }
        
        Node* newNode = new Node(value);
        Node* current = head;
        
        for (size_t i = 0; i < position - 1; i++) {
            current = current->next;
        }
        
        newNode->next = current->next;
        current->next = newNode;
        size++;
        return true;
    }
    
    // Delete at beginning
    bool deleteAtBeginning() {
        if (isEmpty()) {
            return false;
        }
        
        Node* temp = head;
        head = head->next;
        delete temp;
        size--;
        return true;
    }
    
    // Delete at end
    bool deleteAtEnd() {
        if (isEmpty()) {
            return false;
        }
        
        if (head->next == nullptr) {
            delete head;
            head = nullptr;
            size--;
            return true;
        }
        
        Node* current = head;
        while (current->next->next != nullptr) {
            current = current->next;
        }
        
        delete current->next;
        current->next = nullptr;
        size--;
        return true;
    }
    
    // Delete at position
    bool deleteAtPosition(size_t position) {
        if (isEmpty() || position >= size) {
            return false;
        }
        
        if (position == 0) {
            return deleteAtBeginning();
        }
        
        if (position == size - 1) {
            return deleteAtEnd();
        }
        
        Node* current = head;
        for (size_t i = 0; i < position - 1; i++) {
            current = current->next;
        }
        
        Node* temp = current->next;
        current->next = temp->next;
        delete temp;
        size--;
        return true;
    }
    
    // Search for a value
    int search(int value) const {
        if (isEmpty()) {
            return -1;
        }
        
        Node* current = head;
        int position = 0;
        
        while (current != nullptr) {
            if (current->data == value) {
                return position;
            }
            current = current->next;
            position++;
        }
        
        return -1;
    }
    
    // Get all elements as a vector
    std::vector<int> getElements() const {
        std::vector<int> elements;
        Node* current = head;
        
        while (current != nullptr) {
            elements.push_back(current->data);
            current = current->next;
        }
        
        return elements;
    }
};

#endif // LINKED_LIST_H 