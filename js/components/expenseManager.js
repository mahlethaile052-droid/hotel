class ExpenseManager {
  constructor(dataManager) {
    this.dataManager = dataManager;
  }

  async render() {
    const period = this.currentPeriod || 'day';
    const todayTotal = await this.getTodayTotal();
    const weekTotal = await this.getWeekTotal();
    const { filtered } = this.getPeriodData(period);
    
    document.querySelector('#app').innerHTML = `
      <div class="dashboard">
        ${this.getHeader()}
        ${this.getNavigation()}
        
        <main class="dashboard-main">
          <div class="page-header">
            <h2>Expense Tracking</h2>
            <div>
              <select id="expensePeriod">
                <option value="day" ${period==='day'?'selected':''}>Today</option>
                <option value="week" ${period==='week'?'selected':''}>This Week</option>
                <option value="month" ${period==='month'?'selected':''}>This Month</option>
                <option value="year" ${period==='year'?'selected':''}>This Year</option>
                <option value="all" ${period==='all'?'selected':''}>All</option>
              </select>
              <button id="addExpenseBtn" class="btn btn-primary">Add Expense</button>
              <button id="bankExpenseBtn" class="btn btn-primary" style="background:#16a34a;margin-left:8px;">Bank Payment (Neged)</button>
            </div>
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
                  ${filtered.map(item => this.renderExpenseRow(item)).join('')}
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

          <div id="bankExpenseModal" class="modal" style="display:none;">
            <div class="modal-content">
              <span class="close" id="bankClose">&times;</span>
              <h3>Withdraw from Neged Bank</h3>
              <form id="bankExpenseForm">
                <div class="form-group">
                  <label for="bankAccount">Account Number</label>
                  <input type="text" id="bankAccount" required placeholder="e.g. 1000-XXXX-XXXX" />
                </div>
                <div class="form-group">
                  <label for="bankAmount">Amount (ETB)</label>
                  <input type="number" id="bankAmount" step="0.01" min="0.01" required />
                </div>
                <div class="form-group">
                  <label for="bankDesc">Description (optional)</label>
                  <input type="text" id="bankDesc" placeholder="Purpose of withdrawal" />
                </div>
                <div class="form-group">
                  <label for="bankDate">Date</label>
                  <input type="date" id="bankDate" required />
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary" id="bankSubmit">Withdraw</button>
                  <button type="button" id="bankCancel" class="btn btn-secondary">Cancel</button>
                </div>
              </form>
              <small style="display:block;margin-top:8px;color:#6b7280;">This records a bank withdrawal and adds it to expenses.</small>
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
    const bankBtn = document.getElementById('bankExpenseBtn');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelExpenseBtn');
    const form = document.getElementById('expenseForm');
    const periodSelect = document.getElementById('expensePeriod');

    // Bank modal elements
    const bankModal = document.getElementById('bankExpenseModal');
    const bankForm = document.getElementById('bankExpenseForm');
    const bankCancel = document.getElementById('bankCancel');
    const bankClose = document.getElementById('bankClose');

    // Set today's date as default
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];

    addBtn.addEventListener('click', () => this.showModal());
    bankBtn.addEventListener('click', () => this.showBankModal());
    closeBtn.addEventListener('click', () => this.hideModal());
    cancelBtn.addEventListener('click', () => this.hideModal());
    form.addEventListener('submit', (e) => this.handleSubmit(e));
    periodSelect.addEventListener('change', (e) => {
      this.currentPeriod = e.target.value;
      this.render();
    });

    // Bank modal handlers
    bankClose.addEventListener('click', () => this.hideBankModal());
    bankCancel.addEventListener('click', () => this.hideBankModal());
    // Default bank date
    document.getElementById('bankDate').value = new Date().toISOString().split('T')[0];
    bankForm.addEventListener('submit', (e) => this.handleBankWithdraw(e));

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

  showBankModal() {
    document.getElementById('bankExpenseModal').style.display = 'block';
  }

  hideBankModal() {
    document.getElementById('bankExpenseModal').style.display = 'none';
  }

  showMessage(message, type = 'info') {
    // Remove existing message if any
    const existingMessage = document.getElementById('expenseMessage');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.id = 'expenseMessage';
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
    
    const expenseData = {
      category: document.getElementById('expenseCategory').value,
      description: document.getElementById('expenseDescription').value,
      amount: parseFloat(document.getElementById('expenseAmount').value),
      date: document.getElementById('expenseDate').value
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    try {
      // Show loading state
      submitBtn.textContent = 'Saving...';
      submitBtn.disabled = true;

      const result = await this.dataManager.addExpense(expenseData);
      
      if (result.success) {
        this.showMessage('Expense record saved successfully!', 'success');
        this.hideModal();
        this.render();
      } else {
        this.showMessage(`Error: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      this.showMessage('An unexpected error occurred', 'error');
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  async handleBankWithdraw(e) {
    e.preventDefault();

    const account = document.getElementById('bankAccount').value.trim();
    const amount = parseFloat(document.getElementById('bankAmount').value);
    const description = document.getElementById('bankDesc').value.trim();
    const date = document.getElementById('bankDate').value;

    const submitBtn = document.getElementById('bankSubmit');
    const originalText = submitBtn.textContent;

    if (!account || !amount || amount <= 0) {
      this.showMessage('Enter a valid account and amount', 'error');
      return;
    }

    try {
      submitBtn.textContent = 'Processing...';
      submitBtn.disabled = true;

      // 1) Record a payment with provider 'bank' (simulated withdrawal)
      const email = window.authManager.getUserEmail() || 'cashier@bridge.local';
      const payRes = await this.dataManager.createPayment({
        amount,
        currency: 'ETB',
        description: description || `Neged Bank withdrawal (${account})`,
        provider: 'bank',
        providerPaymentId: null,
        userEmail: email,
        status: 'captured'
      });
      if (!payRes.success) throw new Error(payRes.error);

      // 2) Add an expense row reflecting the withdrawal
      const expenseRes = await this.dataManager.addExpense({
        category: 'withdrawal',
        description: description || `Bank withdrawal from Neged (${account})`,
        amount,
        date
      });
      if (!expenseRes.success) throw new Error(expenseRes.error);

      // 3) Add a negative income entry to decrease total income
      const incomeRes = await this.dataManager.addIncome({
        category: 'withdrawal',
        description: `Bank withdrawal from Neged (${account})`,
        amount: -amount,
        date
      });
      if (!incomeRes.success) throw new Error(incomeRes.error);

      this.hideBankModal();
      this.showMessage('Bank withdrawal recorded - income decreased and expense added', 'success');
      this.render();
    } catch (err) {
      console.error('Bank withdrawal failed', err);
      this.showMessage('Failed to record bank withdrawal', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  async deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense record?')) {
      try {
        // Show loading state on the delete button
        const deleteBtn = event.target;
        const originalText = deleteBtn.textContent;
        deleteBtn.textContent = 'Deleting...';
        deleteBtn.disabled = true;

        const result = await this.dataManager.deleteExpense(id);
        
        if (result.success) {
          this.showMessage('Expense record deleted successfully!', 'success');
          this.render();
        } else {
          this.showMessage(`Error: ${result.error}`, 'error');
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
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
    const expenses = await this.dataManager.getExpensesByPeriod(today, today);
    return expenses.reduce((total, item) => total + item.amount, 0);
  }

  async getWeekTotal() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const expenses = await this.dataManager.getExpensesByPeriod(
      weekAgo.toISOString().split('T')[0], 
      today.toISOString().split('T')[0]
    );
    return expenses.reduce((total, item) => total + item.amount, 0);
  }

  getPeriodData(period) {
    const all = this.dataManager.getExpenses();
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

  getHeader() {
    return `
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