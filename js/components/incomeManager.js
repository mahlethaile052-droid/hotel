class IncomeManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    async render() {
        const period = this.currentPeriod || 'day';
        const todayTotal = await this.getTodayTotal();
        const weekTotal = await this.getWeekTotal();
        const { filtered } = this.getPeriodData(period);
        
        document.querySelector('#app').innerHTML = `
            <div class="dashboard" style="min-height:100vh;background:
                linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
                url('/assets/images/income.jpg') center/cover no-repeat fixed;">
                <header class="dashboard-header" style="background:rgba(255,255,255,0.9);backdrop-filter:saturate(140%) blur(6px);">
                    <div class="header-content" style="max-width:1200px;margin:0 auto;padding:0 1rem;display:flex;justify-content:space-between;align-items:center;">
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
                        <button class="nav-btn active">Income</button>
                        <button class="nav-btn" onclick="router.navigate('/expenses')">Expenses</button>
                        <button class="nav-btn" onclick="router.navigate('/inventory')">Inventory</button>
                        <button class="nav-btn" onclick="router.navigate('/reports')">Reports</button>
                    </div>
                </nav>
                
                <main class="dashboard-main" style="max-width:1200px;margin:0 auto;padding:2rem 1rem;">
                    <div class="page-header">
                        <h2>Income Tracking</h2>
                        <div>
                            <select id="incomePeriod">
                                <option value="day" ${period==='day'?'selected':''}>Today</option>
                                <option value="week" ${period==='week'?'selected':''}>This Week</option>
                                <option value="month" ${period==='month'?'selected':''}>This Month</option>
                                <option value="year" ${period==='year'?'selected':''}>This Year</option>
                                <option value="all" ${period==='all'?'selected':''}>All</option>
                            </select>
                        </div>
                    </div>

                    <section class="quick-add-section">
                        <h3>Add Income</h3>
                        <button id="addIncomeBtn" class="btn btn-primary">Add New Income</button>
                    </section>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Today's Income</h3>
                            <p class="stat-value">${todayTotal.toLocaleString()} ETB</p>
                        </div>
                        <div class="stat-card">
                            <h3>This Week</h3>
                            <p class="stat-value">${weekTotal.toLocaleString()} ETB</p>
                        </div>
                    </div>
                    
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filtered.map(item => this.renderIncomeRow(item)).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div id="incomeModal" class="modal" style="display: none;">
                        <div class="modal-content">
                            <span class="close">&times;</span>
                            <h3>Add Income</h3>
                            <form id="incomeForm">
                                <div class="form-group">
                                    <label for="incomeCategory">Category</label>
                                    <select id="incomeCategory" required>
                                        <option value="">Select Category</option>
                                        <option value="drinks">Drinks</option>
                                        <option value="meals">Meals</option>
                                        <option value="meat">Meat</option>
                                        <option value="draft">Draft</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="incomeDescription">Description</label>
                                    <input type="text" id="incomeDescription" required placeholder="Enter description">
                                </div>
                                
                                <div class="form-group">
                                    <label for="incomeAmount">Amount (ETB)</label>
                                    <input type="number" id="incomeAmount" step="0.01" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="incomeDate">Date</label>
                                    <input type="date" id="incomeDate" required>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary">Save</button>
                                    <button type="button" id="cancelIncomeBtn" class="btn btn-secondary">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        `;

        this.attachEventListeners();
    }

    renderIncomeRow(item) {
        return `
            <tr>
                <td>${new Date(item.date).toLocaleDateString()}</td>
                <td><span class="category-badge category-${item.category}">${item.category}</span></td>
                <td>${item.description}</td>
                <td>${item.amount.toLocaleString()} ETB</td>
                <td>
                    <button onclick="incomeManager.deleteIncome(${item.id})" class="btn btn-small btn-danger">Delete</button>
                </td>
            </tr>
        `;
    }

    attachEventListeners() {
        const modal = document.getElementById('incomeModal');
        const addBtn = document.getElementById('addIncomeBtn');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancelIncomeBtn');
        const form = document.getElementById('incomeForm');
        const periodSelect = document.getElementById('incomePeriod');

        // Set today's date as default
        document.getElementById('incomeDate').value = new Date().toISOString().split('T')[0];

        // Event listeners
        addBtn.addEventListener('click', () => this.showModal());
        closeBtn.addEventListener('click', () => this.hideModal());
        cancelBtn.addEventListener('click', () => this.hideModal());
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        periodSelect.addEventListener('change', (e) => {
            this.currentPeriod = e.target.value;
            this.render();
        });

        window.onclick = (event) => {
            if (event.target === modal) {
                this.hideModal();
            }
        };

        // Logout handler
        document.getElementById('logoutBtn').addEventListener('click', () => {
            window.authManager.logout();
            window.router.navigate('/login');
        });

        window.incomeManager = this;
    }

    showModal() {
        document.getElementById('incomeModal').style.display = 'block';
    }

    hideModal() {
        document.getElementById('incomeModal').style.display = 'none';
    }


    showMessage(message, type = 'info') {
        // Remove existing message if any
        const existingMessage = document.getElementById('incomeMessage');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.id = 'incomeMessage';
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

    async handleSubmit(e) {
        e.preventDefault();
        
        const incomeData = {
            category: document.getElementById('incomeCategory').value,
            description: document.getElementById('incomeDescription').value,
            amount: parseFloat(document.getElementById('incomeAmount').value),
            date: document.getElementById('incomeDate').value
        };

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            // Show loading state
            submitBtn.textContent = 'Saving...';
            submitBtn.disabled = true;

            const result = await this.dataManager.addIncome(incomeData);
            
            if (result.success) {
                this.showMessage('Income record saved successfully!', 'success');
                this.hideModal();
                this.render();
            } else {
                this.showMessage(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('Error saving income:', error);
            this.showMessage('An unexpected error occurred', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async deleteIncome(id) {
        if (confirm('Are you sure you want to delete this income record?')) {
            try {
                // Show loading state on the delete button
                const deleteBtn = event.target;
                const originalText = deleteBtn.textContent;
                deleteBtn.textContent = 'Deleting...';
                deleteBtn.disabled = true;

                const result = await this.dataManager.deleteIncome(id);
                
                if (result.success) {
                    this.showMessage('Income record deleted successfully!', 'success');
                    this.render();
                } else {
                    this.showMessage(`Error: ${result.error}`, 'error');
                }
            } catch (error) {
                console.error('Error deleting income:', error);
                this.showMessage('An unexpected error occurred', 'error');
            } finally {
                // Reset button state
                const deleteBtn = event.target;
                deleteBtn.textContent = 'Delete';
                deleteBtn.disabled = false;
            }
        }
    }

    async getTodayTotal() {
        const today = new Date().toISOString().split('T')[0];
        const income = await this.dataManager.getIncomeByPeriod(today, today);
        return income.reduce((total, item) => total + item.amount, 0);
    }

    async getWeekTotal() {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const income = await this.dataManager.getIncomeByPeriod(
            weekAgo.toISOString().split('T')[0], 
            today.toISOString().split('T')[0]
        );
        return income.reduce((total, item) => total + item.amount, 0);
    }

    getPeriodData(period) {
        const all = this.dataManager.getIncome();
        const today = new Date();
        let start;
        switch (period) {
            case 'day':
                start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                break;
            case 'week':
                start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'year':
                start = new Date(today.getFullYear(), 0, 1);
                break;
            default:
                start = new Date(0);
        }
        const filtered = all.filter(item => {
            const d = new Date(item.date);
            return d >= start && d <= today;
        });
        return {
            filtered,
            todayTotal: this.getTodayTotal(),
            weekTotal: this.getWeekTotal()
        };
    }
}

export default IncomeManager;