import EmployeeManager from './components/employeeManager.js';
import IncomeManager from './components/incomeManager.js';
import ExpenseManager from './components/expenseManager.js';
import InventoryManager from './components/inventoryManager.js';
import ReportsManager from './components/reportsManager.js';

class Router {
  constructor(authManager, dataManager) {
    this.authManager = authManager;
    this.dataManager = dataManager;

    this.routes = {
      '/': () => this.showHome(),
      '/login': () => this.showLoginPage(),
      '/dashboard': () => this.showProtectedDashboard(),
      '/employees': () => this.showProtectedEmployees(),
      '/income': () => this.showProtectedIncome(),
      '/expenses': () => this.showProtectedExpenses(),
      '/inventory': () => this.showProtectedInventory(),
      '/reports': () => this.showProtectedReports()
    };
  }

  init() {
    window.addEventListener('popstate', () => this.handleRoute());
    this.handleRoute();
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    const route = this.routes[path] || this.routes['/'];
    route();
  }

  // --- Pages ---

  showHome() {
    if (this.authManager.isAuthenticated) {
      this.navigate('/dashboard');
    } else {
      this.navigate('/login');
    }
  }

  showLoginPage() {
    document.querySelector('#app').innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <div class="hotel-logo">
            <h2>🏨 Harar Bridge Hotel</h2>
            <p>Management System</p>
          </div>
          
          <form id="loginForm" class="login-form">
            <div class="form-group">
              <label for="username">👤 Username</label>
              <input type="text" id="username" name="username" required placeholder="Enter username">
            </div>
            
            <div class="form-group">
              <label for="password">🔒 Password</label>
              <input type="password" id="password" name="password" required placeholder="Enter password">
            </div>
            
            <button type="submit" class="login-btn">Sign In</button>
            <div id="loginError" class="error-message" style="display: none;"></div>
          </form>
          
          <div class="demo-credentials">
            <h4>Demo Credentials</h4>
            <ul>
              <li><strong>Admin:</strong> admin / admin123</li>
              <li><strong>Manager:</strong> manager / manager123</li>
              <li><strong>Staff:</strong> staff / staff123</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (this.authManager.login(username, password)) {
        this.navigate('/dashboard');
      } else {
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = '❌ Invalid username or password';
        errorDiv.style.display = 'block';
      }
    });
  }

  showProtectedDashboard() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    this.showDashboard();
  }

  showProtectedEmployees() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    this.showEmployeesPage();
  }

  showProtectedIncome() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    this.showIncomePage();
  }

  showProtectedExpenses() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    this.showExpensesPage();
  }

  showProtectedInventory() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    this.showInventoryPage();
  }

  showProtectedReports() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    this.showReportsPage();
  }

  // --- Dashboard ---
  showDashboard() {
    document.querySelector('#app').innerHTML = `
      <div class="dashboard">
        <header class="dashboard-header">
          <h1>🏨 Harar Bridge Hotel - Dashboard</h1>
          <div>
            <span class="welcome-text">Welcome, ${this.authManager.currentUser.name}</span>
            <button id="logoutBtn" class="logout-btn">Logout</button>
          </div>
        </header>
        
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>👥 Employees</h3>
            <p>Manage hotel staff</p>
            <button onclick="router.navigate('/employees')">Open</button>
          </div>
          
          <div class="dashboard-card">
            <h3>💰 Income</h3>
            <p>Track sales and revenue</p>
            <button onclick="router.navigate('/income')">Open</button>
          </div>
          
          <div class="dashboard-card">
            <h3>💸 Expenses</h3>
            <p>Track daily spending</p>
            <button onclick="router.navigate('/expenses')">Open</button>
          </div>
          
          <div class="dashboard-card">
            <h3>📦 Inventory</h3>
            <p>Manage stock levels</p>
            <button onclick="router.navigate('/inventory')">Open</button>
          </div>
          
          <div class="dashboard-card">
            <h3>📊 Reports</h3>
            <p>View charts & exports</p>
            <button onclick="router.navigate('/reports')">Open</button>
          </div>
        </div>
      </div>
    `;

    this.attachLogoutHandler();
  }

  // --- Other Pages ---
  showEmployeesPage() {
    const employeeManager = new EmployeeManager(this.dataManager);
    employeeManager.render();
    this.attachLogoutHandler();
  }

  showIncomePage() {
    const incomeManager = new IncomeManager(this.dataManager);
    incomeManager.render();
    this.attachLogoutHandler();
  }

  showExpensesPage() {
    const expenseManager = new ExpenseManager(this.dataManager);
    expenseManager.render();
    this.attachLogoutHandler();
  }

  showInventoryPage() {
    const inventoryManager = new InventoryManager(this.dataManager);
    inventoryManager.render();
    this.attachLogoutHandler();
  }

  showReportsPage() {
    const reportsManager = new ReportsManager(this.dataManager);
    reportsManager.render();
    this.attachLogoutHandler();
  }

  // --- Helpers ---
  attachLogoutHandler() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.authManager.logout();
        this.navigate('/login');
      });
    }
  }
}

export default Router;
