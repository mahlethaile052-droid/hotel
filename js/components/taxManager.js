class TaxManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.taxRates = {
            income: 0.15, // 15% income tax
            vat: 0.15,   // 15% VAT
            service: 0.10 // 10% service charge
        };
    }

    async render() {
        const period = this.currentPeriod || 'month';
        const { incomeData, taxData } = await this.calculateTaxes(period);
        
        document.querySelector('#app').innerHTML = `
            <div class="dashboard" style="min-height:100vh;background:
                linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
                url('/assets/images/tax.jpg') center/cover no-repeat fixed;">
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
                        <button class="nav-btn" onclick="router.navigate('/income')">Income</button>
                        <button class="nav-btn" onclick="router.navigate('/expenses')">Expenses</button>
                        <button class="nav-btn" onclick="router.navigate('/inventory')">Inventory</button>
                        <button class="nav-btn" onclick="router.navigate('/reports')">Reports</button>
                        <button class="nav-btn active">Tax</button>
                    </div>
                </nav>
                
                <main class="dashboard-main" style="max-width:1200px;margin:0 auto;padding:2rem 1rem;">
                    <div class="page-header">
                        <h2>Tax Management</h2>
                        <div>
                            <select id="taxPeriod">
                                <option value="day" ${period==='day'?'selected':''}>Today</option>
                                <option value="week" ${period==='week'?'selected':''}>This Week</option>
                                <option value="month" ${period==='month'?'selected':''}>This Month</option>
                                <option value="year" ${period==='year'?'selected':''}>This Year</option>
                                <option value="all" ${period==='all'?'selected':''}>All</option>
                            </select>
                        </div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Total Income</h3>
                            <p class="stat-value">${incomeData.totalIncome.toLocaleString()} ETB</p>
                        </div>
                        <div class="stat-card">
                            <h3>Income Tax (15%)</h3>
                            <p class="stat-value">${taxData.incomeTax.toLocaleString()} ETB</p>
                        </div>
                        <div class="stat-card">
                            <h3>VAT (15%)</h3>
                            <p class="stat-value">${taxData.vat.toLocaleString()} ETB</p>
                        </div>
                        <div class="stat-card">
                            <h3>Service Charge (10%)</h3>
                            <p class="stat-value">${taxData.serviceCharge.toLocaleString()} ETB</p>
                        </div>
                    </div>
                    
                    <div class="tax-details">
                        <div class="tax-card">
                            <h3>Tax Summary</h3>
                            <div class="tax-summary">
                                <div class="tax-row">
                                    <span class="tax-label">Total Income:</span>
                                    <span class="tax-value">${incomeData.totalIncome.toLocaleString()} ETB</span>
                                </div>
                                <div class="tax-row">
                                    <span class="tax-label">Income Tax (15%):</span>
                                    <span class="tax-value">${taxData.incomeTax.toLocaleString()} ETB</span>
                                </div>
                                <div class="tax-row">
                                    <span class="tax-label">VAT (15%):</span>
                                    <span class="tax-value">${taxData.vat.toLocaleString()} ETB</span>
                                </div>
                                <div class="tax-row">
                                    <span class="tax-label">Service Charge (10%):</span>
                                    <span class="tax-value">${taxData.serviceCharge.toLocaleString()} ETB</span>
                                </div>
                                <div class="tax-row total">
                                    <span class="tax-label">Total Tax:</span>
                                    <span class="tax-value">${taxData.totalTax.toLocaleString()} ETB</span>
                                </div>
                                <div class="tax-row net">
                                    <span class="tax-label">Net Income (After Tax):</span>
                                    <span class="tax-value">${(incomeData.totalIncome - taxData.totalTax).toLocaleString()} ETB</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tax-card">
                            <h3>Tax Breakdown by Category</h3>
                            <div class="tax-category-breakdown">
                                ${this.renderTaxCategoryBreakdown(incomeData.incomeByCategory)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="tax-settings">
                        <h3>Tax Rate Settings</h3>
                        <form id="taxSettingsForm">
                            <div class="form-group">
                                <label for="incomeTaxRate">Income Tax Rate (%)</label>
                                <input type="number" id="incomeTaxRate" value="${this.taxRates.income * 100}" min="0" max="100" step="0.1">
                            </div>
                            <div class="form-group">
                                <label for="vatRate">VAT Rate (%)</label>
                                <input type="number" id="vatRate" value="${this.taxRates.vat * 100}" min="0" max="100" step="0.1">
                            </div>
                            <div class="form-group">
                                <label for="serviceChargeRate">Service Charge Rate (%)</label>
                                <input type="number" id="serviceChargeRate" value="${this.taxRates.service * 100}" min="0" max="100" step="0.1">
                            </div>
                            <button type="submit" class="btn btn-primary">Update Tax Rates</button>
                        </form>
                    </div>
                </main>
            </div>
        `;

        this.attachEventListeners();
    }

    async calculateTaxes(period) {
        const periodData = await this.getPeriodData(period);
        const incomeData = {
            totalIncome: periodData.filtered.reduce((sum, item) => sum + item.amount, 0),
            incomeByCategory: this.groupIncomeByCategory(periodData.filtered)
        };

        const taxData = {
            incomeTax: incomeData.totalIncome * this.taxRates.income,
            vat: incomeData.totalIncome * this.taxRates.vat,
            serviceCharge: incomeData.totalIncome * this.taxRates.service
        };
        
        taxData.totalTax = taxData.incomeTax + taxData.vat + taxData.serviceCharge;
        
        return { incomeData, taxData };
    }

    async getPeriodData(period) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let filtered;
        let todayTotal = 0;
        let weekTotal = 0;
        
        // Filter income by period using async methods
        if (period === 'day') {
            const todayStr = today.toISOString().split('T')[0];
            filtered = await this.dataManager.getIncomeByPeriod(todayStr, todayStr);
        } else if (period === 'week') {
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            filtered = await this.dataManager.getIncomeByPeriod(
                weekAgo.toISOString().split('T')[0], 
                today.toISOString().split('T')[0]
            );
        } else if (period === 'month') {
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            filtered = await this.dataManager.getIncomeByPeriod(
                firstDayOfMonth.toISOString().split('T')[0], 
                today.toISOString().split('T')[0]
            );
        } else if (period === 'year') {
            const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
            filtered = await this.dataManager.getIncomeByPeriod(
                firstDayOfYear.toISOString().split('T')[0], 
                today.toISOString().split('T')[0]
            );
        } else {
            // All time - get all income
            const allIncome = this.dataManager.getIncome();
            filtered = allIncome;
        }
        
        // Calculate today's total
        const todayStr = today.toISOString().split('T')[0];
        const todayIncome = await this.dataManager.getIncomeByPeriod(todayStr, todayStr);
        todayTotal = todayIncome.reduce((sum, item) => sum + item.amount, 0);
        
        // Calculate this week's total
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        const weekIncome = await this.dataManager.getIncomeByPeriod(
            weekAgo.toISOString().split('T')[0], 
            today.toISOString().split('T')[0]
        );
        weekTotal = weekIncome.reduce((sum, item) => sum + item.amount, 0);
        
        return { filtered, todayTotal, weekTotal };
    }

    groupIncomeByCategory(income) {
        return income.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = {
                    total: 0,
                    items: []
                };
            }
            acc[item.category].total += item.amount;
            acc[item.category].items.push(item);
            return acc;
        }, {});
    }

    renderTaxCategoryBreakdown(incomeByCategory) {
        if (Object.keys(incomeByCategory).length === 0) {
            return '<p class="no-data">No income data available for this period</p>';
        }

        return Object.entries(incomeByCategory).map(([category, data]) => {
            const incomeTax = data.total * this.taxRates.income;
            const vat = data.total * this.taxRates.vat;
            const serviceCharge = data.total * this.taxRates.service;
            const totalTax = incomeTax + vat + serviceCharge;
            
            return `
                <div class="category-tax-item">
                    <div class="category-header">
                        <span class="category-badge category-${category}">${category}</span>
                        <span class="category-amount">${data.total.toLocaleString()} ETB</span>
                    </div>
                    <div class="category-tax-details">
                        <div class="tax-row">
                            <span class="tax-label">Income Tax:</span>
                            <span class="tax-value">${incomeTax.toLocaleString()} ETB</span>
                        </div>
                        <div class="tax-row">
                            <span class="tax-label">VAT:</span>
                            <span class="tax-value">${vat.toLocaleString()} ETB</span>
                        </div>
                        <div class="tax-row">
                            <span class="tax-label">Service Charge:</span>
                            <span class="tax-value">${serviceCharge.toLocaleString()} ETB</span>
                        </div>
                        <div class="tax-row total">
                            <span class="tax-label">Total Tax:</span>
                            <span class="tax-value">${totalTax.toLocaleString()} ETB</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    attachEventListeners() {
        const periodSelect = document.getElementById('taxPeriod');
        const taxSettingsForm = document.getElementById('taxSettingsForm');

        periodSelect.addEventListener('change', async (e) => {
            this.currentPeriod = e.target.value;
            await this.render();
        });

        taxSettingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            this.taxRates = {
                income: parseFloat(document.getElementById('incomeTaxRate').value) / 100,
                vat: parseFloat(document.getElementById('vatRate').value) / 100,
                service: parseFloat(document.getElementById('serviceChargeRate').value) / 100
            };
            
            // Save tax rates to localStorage
            localStorage.setItem('taxRates', JSON.stringify(this.taxRates));
            
            // Re-render with updated rates
            await this.render();
        });

        // Logout handler
        document.getElementById('logoutBtn').addEventListener('click', () => {
            window.authManager.logout();
            window.router.navigate('/login');
        });

        window.taxManager = this;
    }
}

export default TaxManager;