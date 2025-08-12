# Data Structures Visualizer

An interactive web-based tool for visualizing and learning common data structures. This project helps students and developers understand data structures through hands-on visualization and interaction.

## Features

### Stack Visualizer
- Interactive stack operations (Push, Pop, Peek, Clear)
- Real-time visualization of stack elements
- Animated transitions for operations
- Stack overflow and underflow handling
- Dark/Light theme support
- C++ implementation view with syntax highlighting
- Maximum stack size configuration
- Error handling visualization
- Operation history tracking

### Linked List Visualizer
- Visual representation of linked list nodes and connections
- Node insertion and deletion operations
  - Insert at beginning
  - Insert at end
  - Insert at position
  - Delete from beginning
  - Delete from end
  - Delete by value
- Interactive node traversal
- Dark/Light theme support
- Real-time updates and animations
- Pointer visualization
- Node value modification
- List reversal visualization
- Cycle detection

### AVL Tree Visualizer
- Interactive AVL tree visualization
- Auto-balancing demonstration
- Node insertion and deletion with rotations
- Balance factor display
- Hover effects for detailed node information
- Dark/Light theme support
- Tree traversal animations
  - In-order
  - Pre-order
  - Post-order
- Height and depth display
- Path highlighting
- Rotation animation
- Search visualization

## Quick Start Guide

1. **Choose a Data Structure:**
   - Click on any data structure card on the home page
   - Each visualizer opens in a new view

2. **Basic Operations:**
   - Stack:
     - Enter a number and click "Push" to add
     - Click "Pop" to remove top element
     - Use "Peek" to view top element
   - Linked List:
     - Add nodes at beginning/end
     - Remove nodes from any position
     - Traverse through nodes
   - AVL Tree:
     - Insert numbers to create tree
     - Watch auto-balancing in action
     - Hover over nodes for details

3. **Theme Toggle:**
   - Click the sun/moon icon to switch themes
   - Theme preference is saved automatically

## Detailed Usage Guide

### Stack Operations
```javascript
// Example operations
push(5)    // Adds 5 to top
pop()      // Removes and returns top element
peek()     // Views top element without removing
clear()    // Removes all elements
```

### Linked List Operations
```javascript
// Example operations
insertAtBeginning(3)   // Adds 3 at start
insertAtEnd(7)         // Adds 7 at end
deleteValue(5)         // Removes first occurrence of 5
reverse()             // Reverses the entire list
```

### AVL Tree Operations
```javascript
// Example operations
insert(10)            // Adds 10 to tree
delete(5)             // Removes 5 from tree
search(7)             // Highlights path to 7
showBalance()         // Displays balance factors
```

## Technical Details

### Stack Implementation
```cpp
template <typename T>
class Stack {
    std::vector<T> elements;
    size_t maxSize;
public:
    Stack(size_t size = 10);
    void push(const T& value);
    T pop();
    T peek() const;
    bool isEmpty() const;
    bool isFull() const;
    size_t size() const;
    void clear();
};
```

### Linked List Implementation
```cpp
template <typename T>
class Node {
    T data;
    Node* next;
public:
    Node(const T& value);
    // ... methods
};

template <typename T>
class LinkedList {
    Node<T>* head;
public:
    LinkedList();
    void insertAtBeginning(const T& value);
    void insertAtEnd(const T& value);
    void deleteNode(const T& value);
    // ... methods
};
```

### AVL Tree Implementation
```cpp
template <typename T>
class AVLNode {
    T data;
    AVLNode *left, *right;
    int height;
public:
    AVLNode(const T& value);
    // ... methods
};

template <typename T>
class AVLTree {
    AVLNode<T>* root;
public:
    AVLTree();
    void insert(const T& value);
    void remove(const T& value);
    // ... methods
};
```

## Examples

### Stack Example Scenarios
1. **Number Storage:**
   - Push: 5, 10, 15
   - Pop: Returns 15
   - Peek: Shows 10

2. **Expression Evaluation:**
   - Push: 2, 3, '+'
   - Result: 5

### Linked List Example Scenarios
1. **Sequential Storage:**
   - Insert: 1 → 2 → 3 → 4
   - Delete: 2
   - Result: 1 → 3 → 4

2. **List Manipulation:**
   - Original: 1 → 2 → 3
   - Reverse: 3 → 2 → 1

### AVL Tree Example Scenarios
1. **Balanced Insertion:**
   ```
   Insert 10:      10
   Insert 5:    5     
   Insert 15:   5  10  15
   ```

2. **Rotation Example:**
   ```
   Before:        10
                 /
                5
               /
              3
   
   After:         5
                /   \
               3     10
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Visualization Not Showing**
   - Clear browser cache
   - Check browser compatibility
   - Ensure JavaScript is enabled

2. **Operations Not Working**
   - Verify input format
   - Check console for errors
   - Ensure within size limits

3. **Theme Not Saving**
   - Enable cookies
   - Clear local storage
   - Try different browser

4. **Performance Issues**
   - Limit large data sets
   - Close unused tabs
   - Update browser

### Error Messages

1. **Stack:**
   - "Stack overflow" - Reached maximum size
   - "Stack underflow" - Empty stack operation

2. **Linked List:**
   - "Node not found" - Delete/search failure
   - "Invalid position" - Insert position error

3. **AVL Tree:**
   - "Duplicate value" - Value exists
   - "Value not found" - Delete/search failure

## Development Guide

### Setting Up Development Environment

1. **Prerequisites:**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd data-structures-visualizer
   ```

2. **File Structure:**
   ```
   /www
     ├── index.html
     ├── stack.html
     ├── linked_list.html
     ├── avl_tree.html
     ├── styles/
     │   ├── main.css
     │   ├── stack_styles.css
     │   └── ...
     └── js/
         ├── stack_app.js
         └── ...
   ```

### Adding New Features

1. **New Visualization:**
   - Copy template HTML
   - Create CSS file
   - Implement JavaScript logic
   - Update index.html

2. **New Operations:**
   - Add UI elements
   - Implement logic
   - Update documentation

### Testing

1. **Manual Testing:**
   - Test all operations
   - Verify animations
   - Check error handling
   - Test responsiveness

2. **Cross-browser Testing:**
   - Test in all supported browsers
   - Verify theme switching
   - Check performance

## Browser Support

- Chrome (recommended) - Version 80+
- Firefox - Version 75+
- Safari - Version 13+
- Edge - Version 80+

### Browser-Specific Notes

1. **Chrome:**
   - Best performance
   - All features supported
   - Recommended for development

2. **Firefox:**
   - Smooth animations
   - Good developer tools
   - Minor rendering differences

3. **Safari:**
   - iOS compatibility
   - Some CSS differences
   - Check webkit prefixes

4. **Edge:**
   - Good Windows integration
   - ChromiumEngine support
   - Modern features supported

## Contributing

### How to Contribute

1. **Code Contributions:**
   - Fork repository
   - Create feature branch
   - Submit pull request
   - Follow style guide

2. **Documentation:**
   - Improve README
   - Add examples
   - Fix typos
   - Add comments

3. **Testing:**
   - Report bugs
   - Suggest improvements
   - Test in different environments

4. **Feature Requests:**
   - Open detailed issues
   - Provide use cases
   - Suggest implementations



### Permissions
- Commercial use
- Modification
- Distribution
- Private use

### Limitations
- No Liability
- No Warranty


### Acknowledgments
- Font Awesome for icons
- Modern CSS features
- WebAssembly community
- Educational institutions using this tool 
