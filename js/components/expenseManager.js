class ExpenseManager {
  constructor(dataManager) {
    this.dataManager = dataManager;
  }

  render() {
    const expenses = this.dataManager.getExpenses();
    const todayTotal = this.getTodayTotal();
    const weekTotal = this.getWeekTotal();
    
    document.querySelector('#app').innerHTML = `
      <div class="dashboard">
        ${this.getHeader()}
        ${this.getNavigation()}
        
        <main class="dashboard-main">
          <div class="page-header">
            <h2>Expense Tracking</h2>
            <button id="addExpenseBtn" class="btn btn-primary">Add Expense</button>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Today's Expenses</h3>
              <p class="stat-value">${todayTotal.toLocaleString()} ETB</p>
            </div>
            <div class="stat-card">
              <h3>This Week</h3>
              <p class="stat-value">${weekTotal.toLocaleString()} ETB</p>
            </div>
          </div>
          
          <div class="expense-list">
            <h3>Recent Expenses</h3>
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
                  ${expenses.map(item => this.renderExpenseRow(item)).join('')}
                </tbody>
              </table>
            </div>
          </div>
          
          <div id="expenseModal" class="modal" style="display: none;">
            <div class="modal-content">
              <span class="close">&times;</span>
              <h3>Add Expense</h3>
              <form id="expenseForm">
                <div class="form-group">
                  <label for="expenseCategory">Category</label>
                  <select id="expenseCategory" required>
                    <option value="">Select Category</option>
                    <option value="supplies">Supplies</option>
                    <option value="repairs">Repairs</option>
                    <option value="purchases">Purchases</option>
                    <option value="utilities">Utilities</option>
                    <option value="salaries">Salaries</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="expenseDescription">Description</label>
                  <input type="text" id="expenseDescription" required>
                </div>
                <div class="form-group">
                  <label for="expenseAmount">Amount (ETB)</label>
                  <input type="number" id="expenseAmount" step="0.01" required>
                </div>
                <div class="form-group">
                  <label for="expenseDate">Date</label>
                  <input type="date" id="expenseDate" required>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">Save</button>
                  <button type="button" id="cancelExpenseBtn" class="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    `;

    this.attachEventListeners();
  }

  renderExpenseRow(item) {
    return `
      <tr>
        <td>${new Date(item.date).toLocaleDateString()}</td>
        <td><span class="category-badge category-${item.category}">${item.category}</span></td>
        <td>${item.description}</td>
        <td>${item.amount.toLocaleString()} ETB</td>
        <td>
          <button onclick="expenseManager.deleteExpense(${item.id})" class="btn btn-small btn-danger">Delete</button>
        </td>
      </tr>
    `;
  }

  attachEventListeners() {
    const modal = document.getElementById('expenseModal');
    const addBtn = document.getElementById('addExpenseBtn');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelExpenseBtn');
    const form = document.getElementById('expenseForm');

    // Set today's date as default
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];

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

    window.expenseManager = this;
  }

  showModal() {
    document.getElementById('expenseModal').style.display = 'block';
  }

  hideModal() {
    document.getElementById('expenseModal').style.display = 'none';
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const expenseData = {
      category: document.getElementById('expenseCategory').value,
      description: document.getElementById('expenseDescription').value,
      amount: parseFloat(document.getElementById('expenseAmount').value),
      date: document.getElementById('expenseDate').value
    };

    this.dataManager.addExpense(expenseData);
    this.hideModal();
    this.render();
  }

  deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense record?')) {
      const expenses = this.dataManager.getExpenses();
      const filtered = expenses.filter(item => item.id !== id);
      localStorage.setItem('expenses', JSON.stringify(filtered));
      this.render();
    }
  }

  getTodayTotal() {
    const today = new Date().toISOString().split('T')[0];
    return this.dataManager.getExpenses()
      .filter(item => item.date === today)
      .reduce((total, item) => total + item.amount, 0);
  }

  getWeekTotal() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.dataManager.getExpenses()
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= weekAgo && itemDate <= today;
      })
      .reduce((total, item) => total + item.amount, 0);
  }

  getHeader() {
    return `
      <header class="dashboard-header">
        <div class="header-content">
          <h1>🏨 Harar Bridge Hotel - Expenses</h1>
          <div class="user-info">
            <span>Welcome, ${window.authManager.currentUser.name}</span>
            <button id="logoutBtn" class="logout-btn">Logout</button>
          </div>
        </div>
      </header>
    `;
  }

  getNavigation() {
    return `
      <nav class="dashboard-nav">
        <button onclick="router.navigate('/dashboard')" class="nav-btn">Dashboard</button>
        <button onclick="router.navigate('/employees')" class="nav-btn">Employees</button>
        <button onclick="router.navigate('/income')" class="nav-btn">Income</button>
        <button onclick="router.navigate('/expenses')" class="nav-btn active">Expenses</button>
        <button onclick="router.navigate('/inventory')" class="nav-btn">Inventory</button>
        <button onclick="router.navigate('/reports')" class="nav-btn">Reports</button>
      </nav>
    `;
  }
}

export default ExpenseManager;