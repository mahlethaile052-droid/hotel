class IncomeManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    render() {
        const period = this.currentPeriod || 'day';
        const { filtered, todayTotal, weekTotal } = this.getPeriodData(period);
        
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
                        <h3>Quick Add (by category)</h3>
                        <div class="quick-add-buttons">
                            <button class="quick-add-btn" onclick="incomeManager.quickAdd('drinks')">
                                <span>🥤</span>
                                <span>Drinks</span>
                            </button>
                            <button class="quick-add-btn" onclick="incomeManager.quickAdd('meals')">
                                <span>🍽️</span>
                                <span>Meals</span>
                            </button>
                            <button class="quick-add-btn" onclick="incomeManager.quickAdd('meat')">
                                <span>🥩</span>
                                <span>Meat</span>
                            </button>
                            <button class="quick-add-btn" onclick="incomeManager.quickAdd('draft')">
                                <span>🍺</span>
                                <span>Draft</span>
                            </button>
                            <button class="quick-add-btn" onclick="incomeManager.quickAdd('other')">
                                <span>➕</span>
                                <span>Other</span>
                            </button>
                        </div>
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
                                    <input type="text" id="incomeDescription" required>
                                </div>
                                
                                <div id="quantityPriceContainer">
                                    <div class="form-group">
                                        <label for="incomeQuantity">How many</label>
                                        <input type="number" id="incomeQuantity" min="1" value="1" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="incomePrice">How much (ETB per unit)</label>
                                        <input type="number" id="incomePrice" step="0.01" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="incomeAmount">Total Amount (ETB)</label>
                                        <input type="number" id="incomeAmount" step="0.01" readonly>
                                    </div>
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
                <td>${item.quantity ? `${item.quantity} × ${item.price ? item.price.toLocaleString() : 0} = ` : ''}${item.amount.toLocaleString()} ETB</td>
                <td>
                    <button onclick="incomeManager.deleteIncome(${item.id})" class="btn btn-small btn-danger">Delete</button>
                </td>
            </tr>
        `;
    }

    attachEventListeners() {
        const modal = document.getElementById('incomeModal');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancelIncomeBtn');
        const form = document.getElementById('incomeForm');
        const periodSelect = document.getElementById('incomePeriod');
        const quantityInput = document.getElementById('incomeQuantity');
        const priceInput = document.getElementById('incomePrice');
        const amountInput = document.getElementById('incomeAmount');

        // Set today's date as default
        document.getElementById('incomeDate').value = new Date().toISOString().split('T')[0];

        // Calculate total amount when quantity or price changes
        const calculateTotal = () => {
            const quantity = parseInt(quantityInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            amountInput.value = (quantity * price).toFixed(2);
        };

        quantityInput.addEventListener('input', calculateTotal);
        priceInput.addEventListener('input', calculateTotal);

        // Quick-add cards call incomeManager.quickAdd()
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

    quickAdd(category) {
        // Open modal with category preselected
        this.showModal();
        const select = document.getElementById('incomeCategory');
        if (select) select.value = category;
        // Focus description for quick entry
        const desc = document.getElementById('incomeDescription');
        if (desc) desc.focus();
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const category = document.getElementById('incomeCategory').value;
        const quantity = parseInt(document.getElementById('incomeQuantity').value);
        const price = parseFloat(document.getElementById('incomePrice').value);
        const amount = quantity * price;
        
        const incomeData = {
            category: category,
            description: document.getElementById('incomeDescription').value,
            quantity: quantity,
            price: price,
            amount: amount,
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