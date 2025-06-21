// AVL Tree Visualization
class AVLTreeVisualizer {
    constructor() {
        this.tree = new AVLTree();
        this.visualization = document.getElementById('tree-visualization');
        this.nodeValueInput = document.getElementById('node-value');
        this.resultContent = document.getElementById('result-content');
        this.treeHeight = document.getElementById('tree-height');
        this.nodeCount = document.getElementById('node-count');
        
        // Create tooltip element
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'node-tooltip';
        document.body.appendChild(this.tooltip);

        // Add scroll event listener to update tooltip position
        this.visualization.addEventListener('scroll', () => {
            if (this.tooltip.classList.contains('visible')) {
                this.tooltip.classList.remove('visible');
            }
        });
        
        // Initialize event listeners
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Insert button
        document.getElementById('insert-btn').addEventListener('click', () => {
            const value = parseInt(this.nodeValueInput.value);
            if (!isNaN(value)) {
                this.insert(value);
            } else {
                this.showResult('Please enter a valid number', 'error');
            }
        });

        // Delete button
        document.getElementById('delete-btn').addEventListener('click', () => {
            const value = parseInt(this.nodeValueInput.value);
            if (!isNaN(value)) {
                this.delete(value);
            } else {
                this.showResult('Please enter a valid number', 'error');
            }
        });

        // Search button
        document.getElementById('search-btn').addEventListener('click', () => {
            const value = parseInt(this.nodeValueInput.value);
            if (!isNaN(value)) {
                this.search(value);
            } else {
                this.showResult('Please enter a valid number', 'error');
            }
        });

        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clear();
        });

        // Theme toggle
        document.querySelector('.theme-toggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });
    }

    insert(value) {
        this.tree.insert(value);
        this.visualize();
        this.showResult(`Node ${value} inserted successfully`, 'success');
        this.updateTreeInfo();
    }

    delete(value) {
        if (this.tree.delete(value)) {
            this.visualize();
            this.showResult(`Node ${value} deleted successfully`, 'success');
            this.updateTreeInfo();
        } else {
            this.showResult(`Node ${value} not found`, 'error');
        }
    }

    search(value) {
        const node = this.tree.search(value);
        if (node) {
            this.highlightNode(value);
            this.showResult(`Node ${value} found`, 'success');
        } else {
            this.showResult(`Node ${value} not found`, 'error');
        }
    }

    clear() {
        this.tree = new AVLTree();
        this.visualize();
        this.showResult('Tree cleared', 'info');
        this.updateTreeInfo();
    }

    visualize() {
        try {
            // Clear previous visualization
            this.visualization.innerHTML = '';
            
            if (!this.tree.root) {
                this.updateTreeInfo();
                return;
            }

            // Calculate tree dimensions
            const height = this.tree.getHeight(this.tree.root);
            const levelHeight = 150; // Increased vertical space between levels
            const nodeRadius = 45; // Significantly increased node radius for better visibility

            // Calculate the width needed based on the number of possible nodes at the deepest level
            const maxNodesAtBottom = Math.pow(2, height - 1);
            const minSpacing = nodeRadius * 6; // Increased minimum space between nodes
            const totalWidth = maxNodesAtBottom * minSpacing * 2;
            
            // Create SVG with proper viewBox for scaling
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', `${height * levelHeight + 250}`);
            
            // Set viewBox to ensure the tree fits and centers properly
            const viewBoxWidth = Math.max(totalWidth, 1400); // Increased minimum width
            const viewBoxHeight = height * levelHeight + 250;
            svg.setAttribute('viewBox', `${-viewBoxWidth/2} 0 ${viewBoxWidth} ${viewBoxHeight}`);
            svg.style.maxHeight = '90vh';
            
            this.visualization.appendChild(svg);

            // Draw tree recursively starting from root
            this.drawNode(svg, this.tree.root, 0, -viewBoxWidth/2, viewBoxWidth/2, levelHeight, nodeRadius);
            
            // Update tree info
            this.updateTreeInfo();
        } catch (error) {
            console.error('Error visualizing tree:', error);
            this.showResult('Error visualizing tree', 'error');
        }
    }

    drawNode(svg, node, level, left, right, levelHeight, nodeRadius) {
        if (!node) return;

        const x = (left + right) / 2;
        const y = level * levelHeight + nodeRadius * 2;

        // Draw connections to children first
        if (node.left) {
            const leftX = (left + x) / 2;
            const leftY = (level + 1) * levelHeight + nodeRadius * 2;
            this.drawConnection(svg, x, y, leftX, leftY);
            this.drawNode(svg, node.left, level + 1, left, x, levelHeight, nodeRadius);
        }

        if (node.right) {
            const rightX = (x + right) / 2;
            const rightY = (level + 1) * levelHeight + nodeRadius * 2;
            this.drawConnection(svg, x, y, rightX, rightY);
            this.drawNode(svg, node.right, level + 1, x, right, levelHeight, nodeRadius);
        }

        // Create a group for the node
        const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodeGroup.setAttribute('class', 'node-group');
        nodeGroup.setAttribute('data-value', node.value);

        // Draw node circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', nodeRadius);
        circle.setAttribute('class', 'tree-node');
        nodeGroup.appendChild(circle);

        // Draw node value
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('class', 'node-text');
        const fontSize = this.getTextSize(node.value.toString());
        text.setAttribute('font-size', fontSize);
        text.textContent = node.value;
        nodeGroup.appendChild(text);

        // Calculate heights and balance factor
        const leftHeight = node.left ? this.tree.getHeight(node.left) : 0;
        const rightHeight = node.right ? this.tree.getHeight(node.right) : 0;
        const balance = rightHeight - leftHeight;

        // Draw balance factor
        if (balance !== 0) {
            const balanceText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            balanceText.setAttribute('x', x + nodeRadius * 1.3);
            balanceText.setAttribute('y', y - nodeRadius * 1.3);
            balanceText.setAttribute('class', 'balance-factor');
            balanceText.textContent = balance;
            nodeGroup.appendChild(balanceText);
        }

        // Add hover events for tooltip with detailed balance information
        let tooltipTimeout;
        nodeGroup.addEventListener('mouseenter', (e) => {
            clearTimeout(tooltipTimeout);
            
            const rect = nodeGroup.getBoundingClientRect();
            const centerX = rect.left + (rect.width / 2);
            const topY = rect.top;
            
            // Create detailed balance information
            const balanceInfo = `Value: ${node.value}
Left Height: ${leftHeight}
Right Height: ${rightHeight}
Balance Factor: ${balance}
${this.getBalanceStatus(balance)}`;
            
            this.tooltip.innerHTML = balanceInfo.replace(/\n/g, '<br>');
            this.tooltip.style.left = `${centerX}px`;
            this.tooltip.style.top = `${topY}px`;
            
            // Small delay to ensure smooth animation
            requestAnimationFrame(() => {
                this.tooltip.classList.add('visible');
            });
        });

        nodeGroup.addEventListener('mouseleave', () => {
            tooltipTimeout = setTimeout(() => {
                this.tooltip.classList.remove('visible');
            }, 100);
        });

        svg.appendChild(nodeGroup);
    }

    // Helper function to adjust text size based on content length
    getTextSize(text) {
        const length = text.length;
        if (length <= 2) return '28px';  // Further increased font sizes
        if (length <= 4) return '24px';
        if (length <= 6) return '20px';
        if (length <= 8) return '18px';
        return '16px';
    }

    drawConnection(svg, x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', 'tree-connection');
        svg.appendChild(line);
    }

    highlightNode(value) {
        const nodes = document.querySelectorAll('.tree-node');
        nodes.forEach(node => {
            if (parseInt(node.getAttribute('data-value')) === value) {
                node.classList.add('highlighted');
                setTimeout(() => {
                    node.classList.remove('highlighted');
                }, 1000);
            }
        });
    }

    showResult(message, type) {
        this.resultContent.textContent = message;
        this.resultContent.className = 'result-content';
        this.resultContent.classList.add(type);
    }

    updateTreeInfo() {
        this.treeHeight.textContent = this.tree.getHeight(this.tree.root);
        this.nodeCount.textContent = this.tree.getNodeCount();
    }

    // Helper function to get balance status description
    getBalanceStatus(balance) {
        if (balance === 0) return "Status: Perfectly balanced";
        if (balance === 1 || balance === -1) return "Status: Balanced";
        if (balance > 1) return "Status: Right heavy (needs rotation)";
        if (balance < -1) return "Status: Left heavy (needs rotation)";
        return "Status: Balanced";
    }
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    const visualizer = new AVLTreeVisualizer();
}); 