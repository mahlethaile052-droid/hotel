class InventoryManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    render() {
        const items = this.dataManager.getInventory();
        const lowStock = this.dataManager.getLowStockItems();
        
        document.querySelector('#app').innerHTML = `
            <div class="dashboard">
                <header class="dashboard-header">
                    <div class="header-content">
                        <div class="header-logo">
                            <div class="header-logo-image">
                                <img src="/assets/images/bridge.jpg" alt="Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                <div style="display:none; width:100%; height:100%; align-items:center; justify-content:center; font-size:1.2rem;">🏨</div>
                            </div>
                            <div class="header-logo-text">Bridge</div>
                        </div>
                        <div class="user-info">
                            <span>Welcome, ${window.authManager.currentUser.name}</span>
                            <button id="logoutBtn" class="logout-btn">Logout</button>
                        </div>
                    </div>
                </header>
                
                <nav class="dashboard-nav">
                    <div class="nav-content">
                        <button class="nav-btn" onclick="router.navigate('/dashboard')">Dashboard</button>
                        <button class="nav-btn" onclick="router.navigate('/employees')">Employees</button>
                        <button class="nav-btn" onclick="router.navigate('/income')">Income</button>
                        <button class="nav-btn" onclick="router.navigate('/expenses')">Expenses</button>
                        <button class="nav-btn active">Inventory</button>
                        <button class="nav-btn" onclick="router.navigate('/reports')">Reports</button>
                    </div>
                </nav>
                
                <main class="dashboard-main">
                    <div class="page-header">
                        <h2>Inventory Management</h2>
                        <div>
                            <button id="addItemBtn" class="btn btn-primary">Add Item</button>
                        </div>
                    </div>
                    
                    ${lowStock.length ? `
                        <div class="alert alert-warning">
                            <h4>Low Stock Alerts</h4>
                            ${lowStock.map(i => `<p>${i.name}: ${i.quantity}/${i.minStock} ${i.unit}</p>`).join('')}
                        </div>
                    ` : ''}

                    <div class="inventory-grid">
                        ${items.map(item => this.renderInventoryCard(item)).join('')}
                    </div>
                    
                    ${this.renderItemModal()}
                    ${this.renderStockModal()}
                </main>
            </div>
        `;

        this.attachEventListeners();
    }

    renderInventoryCard(item) {
        const isLow = item.quantity <= item.minStock;
        return `
            <div class="inventory-card ${isLow ? 'low-stock' : ''}">
                ${isLow ? '<div class="low-stock-indicator">Low</div>' : ''}
                <div class="item-header">
                    <h4>${item.name}</h4>
                    <div>
                        <button class="btn btn-small" onclick="inventoryManager.openStockModal(${item.id}, 'in')">Stock In</button>
                        <button class="btn btn-small" onclick="inventoryManager.openStockModal(${item.id}, 'out')">Stock Out</button>
                    </div>
                </div>
                <div class="item-details">
                    <p class="quantity">Quantity: ${item.quantity} ${item.unit}</p>
                    <p>Category: ${item.category}</p>
                    <p>Min stock: ${item.minStock}</p>
                    <p>Last Updated: ${item.lastUpdated}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-small" onclick="inventoryManager.editItem(${item.id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="inventoryManager.deleteItem(${item.id})">Delete</button>
                </div>
            </div>
        `;
    }

    renderItemModal() {
        return `
            <div id="itemModal" class="modal" style="display:none;">
                        <div class="modal-content">
                    <span class="close" id="closeItemModal">&times;</span>
                    <h3 id="itemModalTitle">Add Item</h3>
                    <form id="itemForm">
                        <input type="hidden" id="itemId">
                        <div class="form-group">
                            <label for="itemName">Name</label>
                            <input type="text" id="itemName" required>
                        </div>
                                <div class="form-group">
                            <label for="itemCategory">Category</label>
                            <select id="itemCategory" required>
                                <option value="supplies">Supplies</option>
                                        <option value="drinks">Drinks</option>
                                <option value="meat">Meat</option>
                                        <option value="meals">Meals</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="form-group">
                            <label for="itemQuantity">Quantity</label>
                            <input type="number" id="itemQuantity" step="0.01" required>
                                </div>
                                <div class="form-group">
                            <label for="itemUnit">Unit</label>
                            <input type="text" id="itemUnit" placeholder="kg, cases, pcs" required>
                                </div>
                                <div class="form-group">
                            <label for="itemMinStock">Minimum Stock</label>
                            <input type="number" id="itemMinStock" step="0.01" required>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary">Save</button>
                            <button type="button" id="cancelItemBtn" class="btn btn-secondary">Cancel</button>
                                </div>
                            </form>
                        </div>
            </div>
        `;
    }

    renderStockModal() {
        return `
            <div id="stockModal" class="modal" style="display:none;">
                <div class="modal-content">
                    <span class="close" id="closeStockModal">&times;</span>
                    <h3 id="stockModalTitle">Stock In</h3>
                    <form id="stockForm">
                        <input type="hidden" id="stockItemId">
                        <div class="form-group">
                            <label for="stockQuantity">Quantity</label>
                            <input type="number" id="stockQuantity" step="0.01" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Apply</button>
                            <button type="button" id="cancelStockBtn" class="btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Add/Edit item
        document.getElementById('addItemBtn').addEventListener('click', () => this.openItemModal());
        document.getElementById('closeItemModal').addEventListener('click', () => this.closeItemModal());
        document.getElementById('cancelItemBtn').addEventListener('click', () => this.closeItemModal());
        document.getElementById('itemForm').addEventListener('submit', (e) => this.handleItemSubmit(e));

        // Stock modal
        document.getElementById('closeStockModal').addEventListener('click', () => this.closeStockModal());
        document.getElementById('cancelStockBtn').addEventListener('click', () => this.closeStockModal());
        document.getElementById('stockForm').addEventListener('submit', (e) => this.handleStockSubmit(e));

        // Logout handler
        document.getElementById('logoutBtn').addEventListener('click', () => {
            window.authManager.logout();
            window.router.navigate('/login');
        });

        window.inventoryManager = this;
    }

    // Item CRUD
    openItemModal(item = null) {
        const title = document.getElementById('itemModalTitle');
        const idInput = document.getElementById('itemId');
        const nameInput = document.getElementById('itemName');
        const categorySelect = document.getElementById('itemCategory');
        const qtyInput = document.getElementById('itemQuantity');
        const unitInput = document.getElementById('itemUnit');
        const minStockInput = document.getElementById('itemMinStock');

        if (item) {
            title.textContent = 'Edit Item';
            idInput.value = item.id;
            nameInput.value = item.name;
            categorySelect.value = item.category;
            qtyInput.value = item.quantity;
            unitInput.value = item.unit;
            minStockInput.value = item.minStock;
        } else {
            title.textContent = 'Add Item';
            idInput.value = '';
            nameInput.value = '';
            categorySelect.value = 'supplies';
            qtyInput.value = '';
            unitInput.value = '';
            minStockInput.value = '';
        }

        document.getElementById('itemModal').style.display = 'block';
    }

    closeItemModal() {
        document.getElementById('itemModal').style.display = 'none';
    }

    async handleItemSubmit(e) {
        e.preventDefault();
        const idVal = document.getElementById('itemId').value;
        const data = {
            name: document.getElementById('itemName').value,
            category: document.getElementById('itemCategory').value,
            quantity: parseFloat(document.getElementById('itemQuantity').value),
            unit: document.getElementById('itemUnit').value,
            minStock: parseFloat(document.getElementById('itemMinStock').value),
            price: 0 // Default price
        };

        try {
            let result;
            if (idVal) {
                result = await this.dataManager.updateInventoryItem(parseInt(idVal, 10), data);
            } else {
                result = await this.dataManager.addInventoryItem(data);
            }

            if (result.success) {
                this.closeItemModal();
                this.render();
                this.showMessage(`Item ${idVal ? 'updated' : 'added'} successfully!`, 'success');
            } else {
                this.showMessage(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('Error saving item:', error);
            this.showMessage('An unexpected error occurred', 'error');
        }
    }

    editItem(id) {
        const item = this.dataManager.getInventory().find(i => i.id === id);
        if (item) this.openItemModal(item);
    }

    async deleteItem(id) {
        if (confirm('Delete this item?')) {
            try {
                const result = await this.dataManager.deleteInventoryItem(id);
                if (result.success) {
                    this.render();
                    this.showMessage('Item deleted successfully!', 'success');
                } else {
                    this.showMessage(`Error: ${result.error}`, 'error');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                this.showMessage('An unexpected error occurred', 'error');
            }
        }
    }

    // Stock in/out
    openStockModal(id, direction) {
        this.stockDirection = direction; // 'in' | 'out'
        document.getElementById('stockItemId').value = id;
        document.getElementById('stockModalTitle').textContent = direction === 'in' ? 'Stock In' : 'Stock Out';
        document.getElementById('stockQuantity').value = '';
        document.getElementById('stockModal').style.display = 'block';
    }

    closeStockModal() {
        document.getElementById('stockModal').style.display = 'none';
    }

    showMessage(message, type = 'info') {
        // Remove existing message if any
        const existingMessage = document.getElementById('inventoryMessage');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.id = 'inventoryMessage';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
        `;

        // Set colors based on type
        if (type === 'success') {
            messageDiv.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else if (type === 'error') {
            messageDiv.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } else {
            messageDiv.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        }

        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                messageDiv.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    async handleStockSubmit(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('stockItemId').value, 10);
        const qty = parseFloat(document.getElementById('stockQuantity').value);
        const item = this.dataManager.getInventory().find(i => i.id === id);
        if (!item) return;

        const newQty = this.stockDirection === 'in' ? (item.quantity + qty) : (item.quantity - qty);
        
        if (newQty < 0) {
            alert('Cannot reduce stock below zero');
            return;
        }

        try {
            const result = await this.dataManager.updateInventoryItem(id, { 
                name: item.name,
                category: item.category,
                quantity: newQty,
                unit: item.unit,
                minStock: item.min_stock,
                price: item.price
            });
            
            if (result.success) {
                this.closeStockModal();
                this.render();
                this.showMessage(`Stock ${this.stockDirection === 'in' ? 'added' : 'removed'} successfully!`, 'success');
            } else {
                this.showMessage(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('Error updating inventory:', error);
            this.showMessage('An unexpected error occurred', 'error');
        }
    }
}

export default InventoryManager;