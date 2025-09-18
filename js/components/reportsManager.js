class ReportsManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    render() {
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
                        <button class="nav-btn" onclick="router.navigate('/inventory')">Inventory</button>
                        <button class="nav-btn active">Reports</button>
                    </div>
                </nav>
                
                <main class="dashboard-main">
                    <div class="page-header">
                        <h2>Reports & Analytics</h2>
                        <div class="export-buttons">
                            <button id="exportPdfBtn" class="btn btn-export">Export PDF</button>
                            <button id="generateReportBtn" class="btn btn-primary">Generate Report</button>
                        </div>
                    </div>
                    
                    <div class="report-controls">
                        <select id="reportPeriod">
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                    
                    <div id="customDateRange" class="date-range" style="display: none;">
                        <div class="form-group">
                            <label for="startDate">Start Date</label>
                            <input type="date" id="startDate">
                        </div>
                        <div class="form-group">
                            <label for="endDate">End Date</label>
                            <input type="date" id="endDate">
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <h3>Financial Overview</h3>
                        <div class="chart-wrapper">
                            <canvas id="financialChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <h3>Income vs Expenses</h3>
                        <div class="chart-wrapper">
                            <canvas id="comparisonChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="reports-grid">
                        <div class="report-card">
                            <h3>Financial Summary</h3>
                            <div id="financialSummary">
                                ${this.renderFinancialSummary()}
                            </div>
                        </div>
                        
                        <div class="report-card">
                            <h3>Low Stock Items</h3>
                            <div id="lowStockReport">
                                ${this.renderLowStockReport()}
                            </div>
                        </div>
                        
                        <div class="report-card">
                            <h3>Employee Summary</h3>
                            <div id="employeeSummary">
                                ${this.renderEmployeeSummary()}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;

        this.attachEventListeners();
        this.initializeCharts();
    }

    renderFinancialSummary() {
        const period = this.getCurrentPeriod();
        const income = this.dataManager.getIncomeByPeriod(period.start, period.end);
        const expenses = this.dataManager.getExpensesByPeriod(period.start, period.end);
        
        const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
        const profit = totalIncome - totalExpenses;

        return `
            <div class="financial-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Income</span>
                    <span class="stat-value income">${totalIncome.toLocaleString()} ETB</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Expenses</span>
                    <span class="stat-value expense">${totalExpenses.toLocaleString()} ETB</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Net Profit</span>
                    <span class="stat-value ${profit >= 0 ? 'profit' : 'loss'}">${profit.toLocaleString()} ETB</span>
                </div>
            </div>
        `;
    }

    renderLowStockReport() {
        const lowStockItems = this.dataManager.getLowStockItems();
        
        if (lowStockItems.length === 0) {
            return '<p class="no-data">All items are adequately stocked</p>';
        }

        return `
            <div class="low-stock-list">
                ${lowStockItems.map(item => `
                    <div class="low-stock-item">
                        <span class="item-name">${item.name}</span>
                        <span class="stock-info">${item.quantity}/${item.minStock} ${item.unit}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmployeeSummary() {
        const employees = this.dataManager.getEmployees();
        const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
        
        const roleCount = employees.reduce((acc, emp) => {
            acc[emp.role] = (acc[emp.role] || 0) + 1;
            return acc;
        }, {});

        return `
            <div class="employee-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Employees</span>
                    <span class="stat-value">${employees.length}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Monthly Salaries</span>
                    <span class="stat-value expense">${totalSalary.toLocaleString()} ETB</span>
                </div>
                ${Object.entries(roleCount).map(([role, count]) => `
                    <div class="stat-item">
                        <span class="stat-label">${role.charAt(0).toUpperCase() + role.slice(1)}s</span>
                        <span class="stat-value">${count}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getCurrentPeriod() {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        return {
            start: weekAgo.toISOString().split('T')[0],
            end: today.toISOString().split('T')[0]
        };
    }

    initializeCharts() {
        this.createFinancialChart();
        this.createComparisonChart();
    }

    createFinancialChart() {
        const ctx = document.getElementById('financialChart').getContext('2d');
        const period = this.getCurrentPeriod();
        const income = this.dataManager.getIncomeByPeriod(period.start, period.end);
        const expenses = this.dataManager.getExpensesByPeriod(period.start, period.end);

        // Group by category
        const incomeByCategory = income.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + item.amount;
            return acc;
        }, {});

        const expensesByCategory = expenses.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + item.amount;
            return acc;
        }, {});

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(incomeByCategory),
                datasets: [{
                    label: 'Income by Category',
                    data: Object.values(incomeByCategory),
                    backgroundColor: [
                        '#dc2626', '#059669', '#d97706', '#7c3aed', '#0891b2'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createComparisonChart() {
        const ctx = document.getElementById('comparisonChart').getContext('2d');
        const period = this.getCurrentPeriod();
        
        // Get last 7 days data
        const last7Days = [];
        const incomeData = [];
        const expenseData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            const dayIncome = this.dataManager.getIncome()
                .filter(item => item.date === dateStr)
                .reduce((sum, item) => sum + item.amount, 0);
                
            const dayExpenses = this.dataManager.getExpenses()
                .filter(item => item.date === dateStr)
                .reduce((sum, item) => sum + item.amount, 0);
                
            incomeData.push(dayIncome);
            expenseData.push(dayExpenses);
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: '#059669'
                }, {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: '#dc2626'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    attachEventListeners() {
        const periodSelect = document.getElementById('reportPeriod');
        const customRange = document.getElementById('customDateRange');
        const generateBtn = document.getElementById('generateReportBtn');
        const exportBtn = document.getElementById('exportPdfBtn');

        periodSelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customRange.style.display = 'flex';
            } else {
                customRange.style.display = 'none';
            }
        });

        generateBtn.addEventListener('click', () => this.generateReport());
        exportBtn.addEventListener('click', () => this.exportToPDF());

        // Logout handler
        document.getElementById('logoutBtn').addEventListener('click', () => {
            window.authManager.logout();
            window.router.navigate('/login');
        });
    }

    generateReport() {
        // Refresh the current view with updated data
        this.render();
    }

    async exportToPDF() {
        const { jsPDF } = window.jspdf;
        const html2canvas = window.html2canvas;
        
        const pdf = new jsPDF();
        
        // Add title
        pdf.setFontSize(20);
        pdf.text('Bridge Hotel - Financial Report', 20, 20);
        
        // Add date
        pdf.setFontSize(12);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
        
        // Add financial summary
        const period = this.getCurrentPeriod();
        const income = this.dataManager.getIncomeByPeriod(period.start, period.end);
        const expenses = this.dataManager.getExpensesByPeriod(period.start, period.end);
        
        const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
        const profit = totalIncome - totalExpenses;
        
        pdf.text(`Total Income: ${totalIncome.toLocaleString()} ETB`, 20, 55);
        pdf.text(`Total Expenses: ${totalExpenses.toLocaleString()} ETB`, 20, 70);
        pdf.text(`Net Profit: ${profit.toLocaleString()} ETB`, 20, 85);
        
        // Add employee summary
        const employees = this.dataManager.getEmployees();
        pdf.text(`Total Employees: ${employees.length}`, 20, 105);
        
        // Add low stock items
        const lowStockItems = this.dataManager.getLowStockItems();
        pdf.text(`Low Stock Items: ${lowStockItems.length}`, 20, 120);
        
        if (lowStockItems.length > 0) {
            let yPos = 135;
            lowStockItems.forEach(item => {
                pdf.text(`- ${item.name}: ${item.quantity}/${item.minStock} ${item.unit}`, 25, yPos);
                yPos += 15;
            });
        }
        
        // Save the PDF
        pdf.save('bridge-hotel-report.pdf');
    }
}

export default ReportsManager;