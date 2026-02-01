// AVL tree + UI
class AVLTreeVisualizer {
    constructor() {
        this.tree = new AVLTree();
        this.visualization = document.getElementById('tree-visualization');
        this.nodeValueInput = document.getElementById('node-value');
        this.resultContent = document.getElementById('result-content');
        this.treeHeight = document.getElementById('tree-height');
        this.nodeCount = document.getElementById('node-count');

        // tooltip for balance info
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'node-tooltip';
        document.body.appendChild(this.tooltip);

        this.visualization.addEventListener('scroll', () => {
            if (this.tooltip.classList.contains('visible')) {
                this.tooltip.classList.remove('visible');
            }
        });

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('insert-btn').addEventListener('click', () => {
            const value = parseInt(this.nodeValueInput.value);
            if (!isNaN(value)) {
                this.insert(value);
            } else {
                this.showResult('Please enter a valid number', 'error');
            }
        });

        document.getElementById('delete-btn').addEventListener('click', () => {
            const value = parseInt(this.nodeValueInput.value);
            if (!isNaN(value)) {
                this.delete(value);
            } else {
                this.showResult('Please enter a valid number', 'error');
            }
        });

        document.getElementById('search-btn').addEventListener('click', () => {
            const value = parseInt(this.nodeValueInput.value);
            if (!isNaN(value)) {
                this.search(value);
            } else {
                this.showResult('Please enter a valid number', 'error');
            }
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clear();
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
            this.visualization.innerHTML = '';

            if (!this.tree.root) {
                this.updateTreeInfo();
                return;
            }

            const height = this.tree.getHeight(this.tree.root);
            const levelHeight = 150;
            const nodeRadius = 45;

            const maxNodesAtBottom = Math.pow(2, height - 1);
            const minSpacing = nodeRadius * 6;
            const totalWidth = maxNodesAtBottom * minSpacing * 2;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', `${height * levelHeight + 250}`);

            const viewBoxWidth = Math.max(totalWidth, 1400);
            const viewBoxHeight = height * levelHeight + 250;
            svg.setAttribute('viewBox', `${-viewBoxWidth/2} 0 ${viewBoxWidth} ${viewBoxHeight}`);
            svg.style.maxHeight = '90vh';

            this.visualization.appendChild(svg);
            this.drawNode(svg, this.tree.root, 0, -viewBoxWidth/2, viewBoxWidth/2, levelHeight, nodeRadius);
            this.updateTreeInfo();
        } catch (error) {
            console.error('Error drawing tree:', error);
            this.showResult('Error visualizing tree', 'error');
        }
    }

    drawNode(svg, node, level, left, right, levelHeight, nodeRadius) {
        if (!node) return;

        const x = (left + right) / 2;
        const y = level * levelHeight + nodeRadius * 2;

        // draw lines to kids first so they're behind the circles
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

        const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodeGroup.setAttribute('class', 'node-group');
        nodeGroup.setAttribute('data-value', node.value);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', nodeRadius);
        circle.setAttribute('class', 'tree-node');
        nodeGroup.appendChild(circle);

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

        const leftHeight = node.left ? this.tree.getHeight(node.left) : 0;
        const rightHeight = node.right ? this.tree.getHeight(node.right) : 0;
        const balance = rightHeight - leftHeight;

        if (balance !== 0) {
            const balanceText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            balanceText.setAttribute('x', x + nodeRadius * 1.3);
            balanceText.setAttribute('y', y - nodeRadius * 1.3);
            balanceText.setAttribute('class', 'balance-factor');
            balanceText.textContent = balance;
            nodeGroup.appendChild(balanceText);
        }

        let tooltipTimeout;
        nodeGroup.addEventListener('mouseenter', (e) => {
            clearTimeout(tooltipTimeout);
            const rect = nodeGroup.getBoundingClientRect();
            const centerX = rect.left + (rect.width / 2);
            const topY = rect.top;
            const balanceInfo = `Value: ${node.value}
Left Height: ${leftHeight}
Right Height: ${rightHeight}
Balance Factor: ${balance}
${this.getBalanceStatus(balance)}`;
            this.tooltip.innerHTML = balanceInfo.replace(/\n/g, '<br>');
            this.tooltip.style.left = `${centerX}px`;
            this.tooltip.style.top = `${topY}px`;
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

    getTextSize(text) {
        const length = text.length;
        if (length <= 2) return '28px';
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
        const groups = document.querySelectorAll('.node-group');
        groups.forEach(grp => {
            if (parseInt(grp.getAttribute('data-value')) === value) {
                const circle = grp.querySelector('.tree-node');
                if (circle) {
                    circle.classList.add('highlighted');
                    setTimeout(() => circle.classList.remove('highlighted'), 1000);
                }
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

    getBalanceStatus(balance) {
        if (balance === 0) return "Status: Perfectly balanced";
        if (balance === 1 || balance === -1) return "Status: Balanced";
        if (balance > 1) return "Status: Right heavy (needs rotation)";
        if (balance < -1) return "Status: Left heavy (needs rotation)";
        return "Status: Balanced";
    }
}

// theme stuff
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    const visualizer = new AVLTreeVisualizer();
});
