// AVL Tree Node
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

// AVL Tree Implementation
class AVLTree {
    constructor() {
        this.root = null;
        this.nodeCount = 0;
    }

    // Get height of a node
    getHeight(node) {
        return node ? node.height : 0;
    }

    // Get balance factor of a node
    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    // Update height of a node
    updateHeight(node) {
        if (node) {
            node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
        }
    }

    // Right rotation
    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }

    // Left rotation
    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }

    // Insert a node
    insert(value) {
        this.root = this._insert(this.root, value);
        this.nodeCount++;
    }

    _insert(node, value) {
        // Normal BST insertion
        if (!node) {
            return new Node(value);
        }

        if (value < node.value) {
            node.left = this._insert(node.left, value);
        } else if (value > node.value) {
            node.right = this._insert(node.right, value);
        } else {
            return node; // Duplicate values not allowed
        }

        // Update height of current node
        this.updateHeight(node);

        // Get balance factor
        const balance = this.getBalance(node);

        // Left Left Case
        if (balance > 1 && value < node.left.value) {
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && value > node.right.value) {
            return this.leftRotate(node);
        }

        // Left Right Case
        if (balance > 1 && value > node.left.value) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Left Case
        if (balance < -1 && value < node.right.value) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    // Delete a node
    delete(value) {
        if (!this.search(value)) {
            return false;
        }
        this.root = this._delete(this.root, value);
        this.nodeCount--;
        return true;
    }

    _delete(node, value) {
        if (!node) {
            return null;
        }

        if (value < node.value) {
            node.left = this._delete(node.left, value);
        } else if (value > node.value) {
            node.right = this._delete(node.right, value);
        } else {
            // Node with only one child or no child
            if (!node.left || !node.right) {
                const temp = node.left || node.right;
                if (!temp) {
                    // No child case
                    node = null;
                } else {
                    // One child case
                    node = temp;
                }
            } else {
                // Node with two children
                const temp = this.getMinValueNode(node.right);
                node.value = temp.value;
                node.right = this._delete(node.right, temp.value);
            }
        }

        if (!node) {
            return null;
        }

        // Update height
        this.updateHeight(node);

        // Get balance factor
        const balance = this.getBalance(node);

        // Left Left Case
        if (balance > 1 && this.getBalance(node.left) >= 0) {
            return this.rightRotate(node);
        }

        // Left Right Case
        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && this.getBalance(node.right) <= 0) {
            return this.leftRotate(node);
        }

        // Right Left Case
        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    // Get minimum value node
    getMinValueNode(node) {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current;
    }

    // Search for a node
    search(value) {
        return this._search(this.root, value);
    }

    _search(node, value) {
        if (!node || node.value === value) {
            return node;
        }

        if (value < node.value) {
            return this._search(node.left, value);
        }

        return this._search(node.right, value);
    }

    // Get node count
    getNodeCount() {
        return this.nodeCount;
    }

    // Get tree height
    getTreeHeight() {
        return this.getHeight(this.root);
    }
} 