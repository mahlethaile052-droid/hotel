class IncomeManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    render() {
        const income = this.dataManager.getIncome();
        const todayTotal = this.getTodayTotal();
        const weekTotal = this.getWeekTotal();
        
        document.querySelector('#app').innerHTML = `
            <div class="dashboard">
                <header class="dashboard-header">
                    <div class="header-content">
                        <div class="header-logo">
                            <div class="header-logo-image">
                                <img src="assets/bridge.jpg" alt="Harar Bridge Hotel Logo">
                            </div>
                            <div class="header-logo-text">Harar Bridge Hotel</div>
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
                
                <main class="dashboard-main">
                    <div class="page-header">
                        <h2>Income Tracking</h2>
                        <button id="addIncomeBtn" class="btn btn-primary">Add Income</button>
                    </div>
                    
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
                                ${income.map(item => this.renderIncomeRow(item)).join('')}
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
                                    <input type="text" id="incomeDescription" required>
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

        // Set today's date as default
        document.getElementById('incomeDate').value = new Date().toISOString().split('T')[0];

        addBtn.addEventListener('click', () => this.showModal());
        closeBtn.addEventListener('click', () => this.hideModal());
        cancelBtn.addEventListener('click', () => this.hideModal());
        form.addEventListener('submit', (e) => this.handleSubmit(e));

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

    handleSubmit(e) {
        e.preventDefault();
        
        const incomeData = {
            category: document.getElementById('incomeCategory').value,
            description: document.getElementById('incomeDescription').value,
            amount: parseFloat(document.getElementById('incomeAmount').value),
            date: document.getElementById('incomeDate').value
        };

        this.dataManager.addIncome(incomeData);
        this.hideModal();
        this.render();
    }

    deleteIncome(id) {
        if (confirm('Are you sure you want to delete this income record?')) {
            const income = this.dataManager.getIncome();
            const filtered = income.filter(item => item.id !== id);
            localStorage.setItem('income', JSON.stringify(filtered));
            this.render();
        }
    }

    getTodayTotal() {
        const today = new Date().toISOString().split('T')[0];
        return this.dataManager.getIncome()
            .filter(item => item.date === today)
            .reduce((total, item) => total + item.amount, 0);
    }

    getWeekTotal() {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return this.dataManager.getIncome()
            .filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= weekAgo && itemDate <= today;
            })
            .reduce((total, item) => total + item.amount, 0);
    }
}

export default IncomeManager;