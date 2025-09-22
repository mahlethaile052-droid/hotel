import EmployeeManager from './components/employeeManager.js';
import IncomeManager from './components/incomeManager.js';
import ExpenseManager from './components/expenseManager.js';
import InventoryManager from './components/inventoryManager.js';
import ReportsManager from './components/reportsManager.js';
import TaxManager from './components/taxManager.js';
import PaymentsManager from './components/paymentsManager.js';

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
      '/reports': () => this.showProtectedReports(),
      '/tax': () => this.showProtectedTax(),
      '/payments': () => this.showProtectedPayments()
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
    if (this.authManager.isAuthenticated()) {
      this.navigate('/dashboard');
    } else {
      this.navigate('/login');
    }
  }

  showLoginPage() {
    document.querySelector('#app').innerHTML = `
      <div class="login-container" style="min-height:100vh;display:flex;position:relative;background:radial-gradient(1200px 600px at -10% -10%, #ef4444 0%, rgba(220,38,38,0.6) 35%, rgba(0,0,0,0.8) 80%), linear-gradient(135deg,#dc2626 0%, #000000 100%);">
        <div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(800px 300px at 120% 120%, rgba(220,38,38,0.35), transparent 60%);"></div>
        <div class="login-left" style="flex:1;display:flex;align-items:center;justify-content:center;padding:2rem;">
          <div class="login-card" style="backdrop-filter:saturate(140%) blur(8px);background:rgba(255,255,255,0.9);padding:2.5rem;border-radius:20px;box-shadow:0 20px 50px rgba(0,0,0,0.25);width:100%;max-width:420px;border:1px solid rgba(255,255,255,0.6);">
            <div class="logo" style="display:flex;flex-direction:column;align-items:center;margin-bottom:1.75rem;">
              <div class="header-logo-image" style="width:86px;height:86px;border-radius:20px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#dc2626 0%, #000000 100%);color:#fff;border:4px solid #fff;box-shadow:0 12px 24px rgba(220,38,38,0.25);">
                <img src="/assets/images/bridge.jpg" alt="Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="width:100%;height:100%;object-fit:cover;">
                <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:2rem;">🏨</div>
              </div>
              <div class="logo-text" style="font-size:1.8rem;font-weight:800;background:linear-gradient(135deg,#dc2626 0%, #000000 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-top:0.75rem;">Bridge Hotel</div>
              <div class="logo-subtitle" style="color:#6b7280;font-size:0.95rem;margin-top:0.25rem;">Management System</div>
          </div>
          
            <form id="loginForm" class="login-form" style="display:flex;flex-direction:column;gap:1rem;">
              <div class="form-group" style="display:flex;flex-direction:column;gap:0.5rem;">
                <label for="username" style="color:#374151;font-weight:600;">Email</label>
                <div class="input-group" style="position:relative;">
                  <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af;">📧</span>
                  <input type="email" id="username" name="username" required placeholder="Enter email address" style="width:100%;padding:0.9rem 0.9rem 0.9rem 2.2rem;border:1px solid #e5e7eb;border-radius:12px;font-size:1rem;outline:none;transition:box-shadow .2s,border-color .2s;" onfocus="this.style.boxShadow='0 0 0 4px rgba(220,38,38,0.15)'; this.style.borderColor='#dc2626'" onblur="this.style.boxShadow='none'; this.style.borderColor='#e5e7eb'">
                </div>
              </div>
              <div class="form-group" style="display:flex;flex-direction:column;gap:0.5rem;">
                <label for="password" style="color:#374151;font-weight:600;">Password</label>
                <div class="input-group" style="position:relative;">
                  <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af;">🔒</span>
                  <input type="password" id="password" name="password" required placeholder="Enter password" style="width:100%;padding:0.9rem 2.6rem 0.9rem 2.2rem;border:1px solid #e5e7eb;border-radius:12px;font-size:1rem;outline:none;transition:box-shadow .2s,border-color .2s;" onfocus="this.style.boxShadow='0 0 0 4px rgba(220,38,38,0.15)'; this.style.borderColor='#dc2626'" onblur="this.style.boxShadow='none'; this.style.borderColor='#e5e7eb'">
                  <button type="button" id="togglePassword" aria-label="Show password" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:#f3f4f6;border:none;border-radius:8px;padding:6px 10px;cursor:pointer;color:#374151;">Show</button>
                </div>
            </div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:0.25rem;">
                <label style="display:flex;align-items:center;gap:8px;color:#6b7280;font-size:0.95rem;">
                  <input type="checkbox" id="rememberMe"> Remember me
                </label>
                <a href="#" style="color:#dc2626;text-decoration:none;font-size:0.95rem;">Forgot password?</a>
            </div>
              <button type="submit" class="login-btn" style="width:100%;padding:0.9rem;background:linear-gradient(135deg,#dc2626 0%, #000000 100%);color:#fff;border:none;border-radius:12px;font-size:1.05rem;font-weight:700;cursor:pointer;box-shadow:0 10px 20px rgba(220,38,38,0.25);transition:transform .15s, box-shadow .15s;" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 14px 28px rgba(220,38,38,0.32)'" onmouseout="this.style.transform='none'; this.style.boxShadow='0 10px 20px rgba(220,38,38,0.25)';">Sign In</button>
              <div id="loginError" class="error-message" style="display:none;color:#dc2626;background:#fef2f2;border-left:4px solid #dc2626;padding:0.75rem;border-radius:8px;"></div>
          </form>
          
            <div class="demo-credentials" style="background:#f9fafb;padding:1rem;border-radius:12px;margin-top:1rem;border:1px solid #e5e7eb;">
              <h4 style="margin:0 0 0.5rem 0;color:#374151;">Setup Required</h4>
              <p style="margin:0;color:#6b7280;font-size:0.9rem;">
                First, set up your Supabase project and create users in the Supabase dashboard. 
                See <strong>SUPABASE_SETUP.md</strong> for detailed instructions.
              </p>
            </div>
          </div>
        </div>

        <div class="login-right" style="flex:1;color:#fff;display:flex;flex-direction:column;justify-content:center;padding:3.25rem;">
          <div class="hotel-info" style="max-width:560px;margin:0 auto;">
            <h2 style="font-size:2.4rem;margin-bottom:1rem;font-weight:900;text-shadow:0 2px 10px rgba(0,0,0,0.25);">Welcome to Bridge Hotel</h2>
            <p style="font-size:1.05rem;margin-bottom:2rem;opacity:0.95;">Ethiopia's trusted hotel management system. Manage employees, inventory, and finances seamlessly.</p>
            <div class="features" style="display:flex;flex-direction:column;gap:1rem;">
              <div class="feature" style="display:flex;align-items:center;gap:12px;">
                <div class="feature-icon" style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;font-size:1.35rem;box-shadow:inset 0 0 10px rgba(255,255,255,0.08);">👥</div>
                <div class="feature-text" style="font-weight:700;">Employee Management</div>
              </div>
              <div class="feature" style="display:flex;align-items:center;gap:12px;">
                <div class="feature-icon" style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;font-size:1.35rem;box-shadow:inset 0 0 10px rgba(255,255,255,0.08);">💰</div>
                <div class="feature-text" style="font-weight:700;">Sales & Daily Income</div>
              </div>
              <div class="feature" style="display:flex;align-items:center;gap:12px;">
                <div class="feature-icon" style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;font-size:1.35rem;box-shadow:inset 0 0 10px rgba(255,255,255,0.08);">📦</div>
                <div class="feature-text" style="font-weight:700;">Inventory Tracking</div>
              </div>
              <div class="feature" style="display:flex;align-items:center;gap:12px;">
                <div class="feature-icon" style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;font-size:1.35rem;box-shadow:inset 0 0 10px rgba(255,255,255,0.08);">📊</div>
                <div class="feature-text" style="font-weight:700;">Financial Reports</div>
              </div>
              <div class="feature" style="display:flex;align-items:center;gap:12px;">
                <div class="feature-icon" style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;font-size:1.35rem;box-shadow:inset 0 0 10px rgba(255,255,255,0.08);">🔐</div>
                <div class="feature-text" style="font-weight:700;">Secure Access Control</div>
              </div>
            </div>
            <div style="margin-top:2rem;background:rgba(255,255,255,0.15);padding:0.9rem 1rem;border-radius:12px;display:flex;align-items:center;gap:10px;max-width:520px;">
              <span style="font-size:1.1rem;">🛡️</span>
              <span style="font-size:0.95rem;">Secure & Encrypted Management System</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('username').value; // Using username field for email
      const password = document.getElementById('password').value;
      const errorDiv = document.getElementById('loginError');
      
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Signing In...';
      submitBtn.disabled = true;
      errorDiv.style.display = 'none';
      
      try {
        const result = await this.authManager.login(email, password);
        
        if (result.success) {
          this.navigate('/dashboard');
        } else {
          errorDiv.textContent = `❌ ${result.error}`;
          errorDiv.style.display = 'block';
        }
      } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = '❌ An unexpected error occurred';
        errorDiv.style.display = 'block';
      } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });

    // Password visibility toggle
    const toggle = document.getElementById('togglePassword');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const input = document.getElementById('password');
        const isPw = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPw ? 'text' : 'password');
        toggle.textContent = isPw ? 'Hide' : 'Show';
      });
    }
  }

  async showProtectedDashboard() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    await this.showDashboard();
  }

  showProtectedEmployees() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    this.showEmployeesPage();
  }

  async showProtectedIncome() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    await this.showIncomePage();
  }

  async showProtectedExpenses() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    await this.showExpensesPage();
  }

  showProtectedInventory() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    this.showInventoryPage();
  }

  async showProtectedReports() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    await this.showReportsPage();
  }

  async showProtectedTax() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    await this.showTaxPage();
  }

  showProtectedPayments() {
    if (!this.authManager.requireAuth()) {
      this.navigate('/login');
      return;
    }
    this.showPaymentsPage();
  }

  // --- Dashboard ---
  async showDashboard() {
    const bgStyle = this.getDashboardBackgroundStyle();
    
    // Get monthly data asynchronously
    const monthlyIncome = await this.dataManager.getThisMonthIncome();
    const monthlyExpenses = await this.dataManager.getThisMonthExpenses();
    
    document.querySelector('#app').innerHTML = `
      <div class="dashboard" style="min-height:100vh;${bgStyle}">
        <header class="dashboard-header" style="background:rgba(255,255,255,0.9);backdrop-filter:saturate(140%) blur(6px);">
          <div class="header-content" style="max-width:1200px;margin:0 auto;padding:0 1rem;display:flex;justify-content:space-between;align-items:center;">
            <div class="header-logo" style="display:flex;align-items:center;gap:12px;">
              <div class="header-logo-image" style="width:40px;height:40px;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#dc2626 0%, #000000 100%);color:#fff;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
                <img src="/assets/images/bridge.jpg" alt="Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="width:100%;height:100%;object-fit:cover;">
                <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:1.2rem;">🏨</div>
              </div>
              <div class="header-logo-text" style="font-weight:800;background:linear-gradient(135deg,#dc2626 0%, #000000 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Bridge Dashboard</div>
            </div>
            <div class="user-info" style="display:flex;align-items:center;gap:12px;">
              <select id="bgSelect" title="Background" style="border:1px solid #e5e7eb;border-radius:8px;padding:6px 8px;color:#374151;background:#fff;">
                <option value="photo">Ethiopia Photo</option>
                <option value="gradient">Red/Black Gradient</option>
                <option value="pattern">Pattern</option>
              </select>
              <span class="welcome-text" style="color:#111827;font-weight:600;">Welcome, ${this.authManager.currentUser.name}</span>
            <button id="logoutBtn" class="logout-btn">Logout</button>
            </div>
          </div>
        </header>
        
        <main class="dashboard-main" style="max-width:1200px;margin:0 auto;padding:2rem 1rem;">
          <section class="stats-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-bottom:1.5rem;">
            <div style="background:rgba(255,255,255,0.9);backdrop-filter:saturate(140%) blur(6px);border-radius:16px;padding:1.25rem;border:1px solid rgba(255,255,255,0.6);box-shadow:0 10px 25px rgba(0,0,0,0.15);">
              <div style="font-size:0.9rem;color:#6b7280;margin-bottom:0.25rem;">This Month Income</div>
              <div style="font-size:1.8rem;font-weight:800;color:#059669;">${monthlyIncome.toLocaleString()} ETB</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);backdrop-filter:saturate(140%) blur(6px);border-radius:16px;padding:1.25rem;border:1px solid rgba(255,255,255,0.6);box-shadow:0 10px 25px rgba(0,0,0,0.15);">
              <div style="font-size:0.9rem;color:#6b7280;margin-bottom:0.25rem;">This Month Expenses</div>
              <div style="font-size:1.8rem;font-weight:800;color:#dc2626;">${monthlyExpenses.toLocaleString()} ETB</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);backdrop-filter:saturate(140%) blur(6px);border-radius:16px;padding:1.25rem;border:1px solid rgba(255,255,255,0.6);box-shadow:0 10px 25px rgba(0,0,0,0.15);">
              <div style="font-size:0.9rem;color:#6b7280;margin-bottom:0.25rem;">Employees</div>
              <div style="font-size:1.8rem;font-weight:800;color:#111827;">${this.dataManager.getEmployees().length}</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);backdrop-filter:saturate(140%) blur(6px);border-radius:16px;padding:1.25rem;border:1px solid rgba(255,255,255,0.6);box-shadow:0 10px 25px rgba(0,0,0,0.15);">
              <div style="font-size:0.9rem;color:#6b7280;margin-bottom:0.25rem;">Low Stock Items</div>
              <div style="font-size:1.8rem;font-weight:800;color:#f59e0b;">${this.dataManager.getLowStockItems().length}</div>
          </div>
          </section>

          <section class="quick-nav" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;">
            <div style="background:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.6);backdrop-filter:saturate(140%) blur(6px);padding:1.25rem;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.15);display:flex;flex-direction:column;gap:0.5rem;">
              <h3 style="margin:0;color:#111827;font-size:1.05rem;">👥 Employees</h3>
              <p style="margin:0;color:#6b7280;">Manage staff and roles</p>
              <button onclick="router.navigate('/employees')" class="btn btn-primary" style="margin-top:0.5rem;">Open</button>
          </div>
            <div style="background:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.6);backdrop-filter:saturate(140%) blur(6px);padding:1.25rem;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.15);display:flex;flex-direction:column;gap:0.5rem;">
              <h3 style="margin:0;color:#111827;font-size:1.05rem;">💰 Income</h3>
              <p style="margin:0;color:#6b7280;">Track sales and revenue</p>
              <button onclick="router.navigate('/income')" class="btn btn-primary" style="margin-top:0.5rem;">Open</button>
          </div>
            <div style="background:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.6);backdrop-filter:saturate(140%) blur(6px);padding:1.25rem;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.15);display:flex;flex-direction:column;gap:0.5rem;">
              <h3 style="margin:0;color:#111827;font-size:1.05rem;">💸 Expenses</h3>
              <p style="margin:0;color:#6b7280;">Record daily spending</p>
              <button onclick="router.navigate('/expenses')" class="btn btn-primary" style="margin-top:0.5rem;">Open</button>
          </div>
            <div style="background:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.6);backdrop-filter:saturate(140%) blur(6px);padding:1.25rem;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.15);display:flex;flex-direction:column;gap:0.5rem;">
              <h3 style="margin:0;color:#111827;font-size:1.05rem;">📦 Inventory</h3>
              <p style="margin:0;color:#6b7280;">Manage stock levels</p>
              <button onclick="router.navigate('/inventory')" class="btn btn-primary" style="margin-top:0.5rem;">Open</button>
          </div>
            <div style="background:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.6);backdrop-filter:saturate(140%) blur(6px);padding:1.25rem;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.15);display:flex;flex-direction:column;gap:0.5rem;">
              <h3 style="margin:0;color:#111827;font-size:1.05rem;">📊 Reports</h3>
              <p style="margin:0;color:#6b7280;">Charts & PDF export</p>
              <button onclick="router.navigate('/reports')" class="btn btn-primary" style="margin-top:0.5rem;">Open</button>
        </div>
            <div style="background:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.6);backdrop-filter:saturate(140%) blur(6px);padding:1.25rem;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.15);display:flex;flex-direction:column;gap:0.5rem;">
              <h3 style="margin:0;color:#111827;font-size:1.05rem;">💵 Tax</h3>
              <p style="margin:0;color:#6b7280;">Calculate & manage taxes</p>
              <button onclick="router.navigate('/tax')" class="btn btn-primary" style="margin-top:0.5rem;">Open</button>
        </div>
          </section>
        </main>
      </div>
    `;

    this.attachLogoutHandler();
    this.attachDashboardHandlers();
  }

  getDashboardBackgroundStyle() {
    const choice = localStorage.getItem('dashboardBg') || 'photo';
    if (choice === 'gradient') {
      return "background: radial-gradient(1200px 600px at -10% -10%, rgba(239,68,68,0.6) 0%, rgba(0,0,0,0.85) 70%), linear-gradient(135deg,#dc2626 0%, #000000 100%);";
    }
    if (choice === 'pattern') {
      const pattern = this.getPatternDataUrl();
      return `background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${pattern}) center/600px repeat fixed;`;
    }
    // photo default
    return "background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/assets/images/ethiopia.png') center/cover no-repeat fixed;";
  }

  getPatternDataUrl() {
    // Subtle Ethiopian-inspired geometric pattern (green/gold/red accents)
    const svg = encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'>
        <rect width='300' height='300' fill='#111827'/>
        <g opacity='0.07'>
          <circle cx='50' cy='50' r='40' fill='#dc2626'/>
          <circle cx='150' cy='150' r='40' fill='#f59e0b'/>
          <circle cx='250' cy='250' r='40' fill='#16a34a'/>
          <path d='M0 150 L150 0 L300 150 L150 300 Z' fill='none' stroke='#ffffff' stroke-width='2'/>
        </g>
      </svg>`);
    return `data:image/svg+xml,${svg}`;
  }

  attachDashboardHandlers() {
    const select = document.getElementById('bgSelect');
    if (!select) return;
    const current = localStorage.getItem('dashboardBg') || 'photo';
    select.value = current;
    select.addEventListener('change', (e) => {
      localStorage.setItem('dashboardBg', e.target.value);
      this.showDashboard();
    });
  }

  // --- Other Pages ---
  showEmployeesPage() {
    const employeeManager = new EmployeeManager(this.dataManager);
    employeeManager.render();
    this.attachLogoutHandler();
  }

  async showIncomePage() {
    const incomeManager = new IncomeManager(this.dataManager);
    await incomeManager.render();
    this.attachLogoutHandler();
  }

  async showExpensesPage() {
    const expenseManager = new ExpenseManager(this.dataManager);
    await expenseManager.render();
    this.attachLogoutHandler();
  }

  showInventoryPage() {
    const inventoryManager = new InventoryManager(this.dataManager);
    inventoryManager.render();
    this.attachLogoutHandler();
  }

  async showReportsPage() {
    const reportsManager = new ReportsManager(this.dataManager);
    await reportsManager.render();
    this.attachLogoutHandler();
  }

  async showTaxPage() {
    const taxManager = new TaxManager(this.dataManager);
    await taxManager.render();
    this.attachLogoutHandler();
  }

  showPaymentsPage() {
    const paymentsManager = new PaymentsManager(this.dataManager);
    paymentsManager.render();
    this.attachLogoutHandler();
  }

  // --- Helpers ---
  attachLogoutHandler() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await this.authManager.logout();
          this.navigate('/login');
        } catch (error) {
          console.error('Logout error:', error);
          // Still navigate to login even if logout fails
          this.navigate('/login');
        }
      });
    }
  }
}

export default Router;
