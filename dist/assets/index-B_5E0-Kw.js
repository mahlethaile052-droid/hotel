(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();class v{constructor(e){this.dataManager=e,this.currentUser=JSON.parse(localStorage.getItem("currentUser"))||null,this.demoUsers={admin:{password:"admin123",name:"Admin User",role:"admin"},manager:{password:"manager123",name:"Manager User",role:"manager"},staff:{password:"staff123",name:"Staff User",role:"staff"}}}login(e,t){const a=(e||"").toLowerCase(),n=this.demoUsers[a];return n&&n.password===t?(this.currentUser={name:n.name,role:n.role,username:a},localStorage.setItem("currentUser",JSON.stringify(this.currentUser)),!0):!1}logout(){this.currentUser=null,localStorage.removeItem("currentUser")}isAuthenticated(){return this.currentUser!==null}requireAuth(){return this.isAuthenticated()}hasPermission(e){return this.currentUser?e?e==="admin"?this.currentUser.role==="admin":e==="manager"?this.currentUser.role==="admin"||this.currentUser.role==="manager":!0:!0:!1}}class y{constructor(e){this.dataManager=e}render(){const e=this.dataManager.getEmployees();document.querySelector("#app").innerHTML=`
            <div class="dashboard" style="min-height:100vh;background:
                linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
                url('/assets/images/emplo.webp') center/cover no-repeat fixed;">
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
                        <button class="nav-btn active">Employees</button>
                        <button class="nav-btn" onclick="router.navigate('/income')">Income</button>
                        <button class="nav-btn" onclick="router.navigate('/expenses')">Expenses</button>
                        <button class="nav-btn" onclick="router.navigate('/inventory')">Inventory</button>
                        <button class="nav-btn" onclick="router.navigate('/reports')">Reports</button>
                    </div>
                </nav>
                
                <main class="dashboard-main" style="max-width:1200px;margin:0 auto;padding:2rem 1rem;">
                    <div class="page-header">
                        <h2>Employee Management</h2>
                        <button id="addEmployeeBtn" class="btn btn-primary">Add Employee</button>
                    </div>
                    
                    <div class="employees-grid">
                        ${e.map(t=>this.renderEmployeeCard(t)).join("")}
                    </div>
                    
                    <div id="employeeModal" class="modal" style="display: none;">
                        <div class="modal-content">
                            <span class="close">&times;</span>
                            <h3 id="modalTitle">Add Employee</h3>
                            <form id="employeeForm">
                                <input type="hidden" id="employeeId">
                                <div class="form-group">
                                    <label for="employeeName">Name</label>
                                    <input type="text" id="employeeName" required>
                                </div>
                                <div class="form-group">
                                    <label for="employeeSex">Sex</label>
                                    <select id="employeeSex" required>
                                        <option value="">Select Sex</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="employeeAge">Age</label>
                                    <input type="number" id="employeeAge" min="18" required>
                                    <small class="error-message" id="ageError" style="color: red; display: none;">Age must be 18 or older</small>
                                </div>
                                <div class="form-group">
                                    <label for="employeeRole">Role</label>
                                    <select id="employeeRole" required>
                                        <option value="">Select Role</option>
                                        <option value="chef">Chef</option>
                                        <option value="cashier">Cashier</option>
                                        <option value="cleaner">Cleaner</option>
                                        <option value="waiter">Waiter</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="employeePhone">Phone</label>
                                    <input type="tel" id="employeePhone" required>
                                </div>
                                <div class="form-group">
                                    <label for="employeeEmail">Email</label>
                                    <input type="email" id="employeeEmail" required>
                                </div>
                                <div class="form-group">
                                    <label for="employeeSalary">Salary (ETB)</label>
                                    <input type="number" id="employeeSalary" required>
                                </div>
                                <div class="form-group">
                                    <label for="employeeHireDate">Hire Date</label>
                                    <input type="date" id="employeeHireDate" required>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary">Save</button>
                                    <button type="button" id="cancelBtn" class="btn btn-secondary">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        `,this.attachEventListeners()}renderEmployeeCard(e){return`
            <div class="employee-card">
                <div class="employee-info">
                    <h4>${e.name}</h4>
                    <p class="employee-role">${e.role}</p>
                    <p class="employee-contact">${e.sex?`Sex: ${e.sex.charAt(0).toUpperCase()+e.sex.slice(1)}`:""}</p>
                    <p class="employee-contact">${e.age?`Age: ${e.age}`:""}</p>
                    <p class="employee-contact">${e.phone}</p>
                    <p class="employee-contact">${e.email}</p>
                    <p class="employee-salary">${e.salary.toLocaleString()} ETB/month</p>
                    <p class="employee-hire-date">Hired: ${new Date(e.hireDate).toLocaleDateString()}</p>
                </div>
                <div class="employee-actions">
                    <button onclick="employeeManager.editEmployee(${e.id})" class="btn btn-small">Edit</button>
                    <button onclick="employeeManager.deleteEmployee(${e.id})" class="btn btn-small btn-danger">Delete</button>
                </div>
            </div>
        `}attachEventListeners(){const e=document.getElementById("employeeModal"),t=document.getElementById("addEmployeeBtn"),a=document.querySelector(".close"),n=document.getElementById("cancelBtn"),o=document.getElementById("employeeForm"),s=document.getElementById("employeeAge");t.addEventListener("click",()=>this.showModal()),a.addEventListener("click",()=>this.hideModal()),n.addEventListener("click",()=>this.hideModal()),o.addEventListener("submit",i=>this.handleSubmit(i)),s.addEventListener("input",()=>{const i=parseInt(s.value),c=document.getElementById("ageError");i<18?c.style.display="block":c.style.display="none"}),window.onclick=i=>{i.target===e&&this.hideModal()},document.getElementById("logoutBtn").addEventListener("click",()=>{window.authManager.logout(),window.router.navigate("/login")}),window.employeeManager=this}showModal(e=null){const t=document.getElementById("employeeModal"),a=document.getElementById("modalTitle"),n=document.getElementById("employeeForm");e?(a.textContent="Edit Employee",document.getElementById("employeeId").value=e.id,document.getElementById("employeeName").value=e.name,document.getElementById("employeeSex").value=e.sex||"",document.getElementById("employeeAge").value=e.age||"",document.getElementById("employeeRole").value=e.role,document.getElementById("employeePhone").value=e.phone,document.getElementById("employeeEmail").value=e.email,document.getElementById("employeeSalary").value=e.salary,document.getElementById("employeeHireDate").value=e.hireDate):(a.textContent="Add Employee",n.reset(),document.getElementById("employeeId").value="",document.getElementById("ageError").style.display="none"),t.style.display="flex";const o=t.querySelector(".modal-content");o&&(o.scrollTop=0)}hideModal(){document.getElementById("employeeModal").style.display="none"}handleSubmit(e){e.preventDefault();const t=parseInt(document.getElementById("employeeAge").value),a=document.getElementById("ageError");if(t<18){a.style.display="block";return}a.style.display="none";const n={name:document.getElementById("employeeName").value,sex:document.getElementById("employeeSex").value,age:t,role:document.getElementById("employeeRole").value,phone:document.getElementById("employeePhone").value,email:document.getElementById("employeeEmail").value,salary:parseInt(document.getElementById("employeeSalary").value),hireDate:document.getElementById("employeeHireDate").value},o=document.getElementById("employeeId").value;o?this.dataManager.updateEmployee(parseInt(o),n):this.dataManager.addEmployee(n),this.hideModal(),this.render()}editEmployee(e){const t=this.dataManager.getEmployees().find(a=>a.id===e);t&&this.showModal(t)}deleteEmployee(e){confirm("Are you sure you want to delete this employee?")&&(this.dataManager.deleteEmployee(e),this.render())}}class b{constructor(e){this.dataManager=e}render(){const e=this.currentPeriod||"day",{filtered:t,todayTotal:a,weekTotal:n}=this.getPeriodData(e);document.querySelector("#app").innerHTML=`
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
                                <option value="day" ${e==="day"?"selected":""}>Today</option>
                                <option value="week" ${e==="week"?"selected":""}>This Week</option>
                                <option value="month" ${e==="month"?"selected":""}>This Month</option>
                                <option value="year" ${e==="year"?"selected":""}>This Year</option>
                                <option value="all" ${e==="all"?"selected":""}>All</option>
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
                            <p class="stat-value">${a.toLocaleString()} ETB</p>
                        </div>
                        <div class="stat-card">
                            <h3>This Week</h3>
                            <p class="stat-value">${n.toLocaleString()} ETB</p>
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
                                ${t.map(o=>this.renderIncomeRow(o)).join("")}
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
        `,this.attachEventListeners()}renderIncomeRow(e){return`
            <tr>
                <td>${new Date(e.date).toLocaleDateString()}</td>
                <td><span class="category-badge category-${e.category}">${e.category}</span></td>
                <td>${e.description}</td>
                <td>${e.quantity?`${e.quantity} × ${e.price?e.price.toLocaleString():0} = `:""}${e.amount.toLocaleString()} ETB</td>
                <td>
                    <button onclick="incomeManager.deleteIncome(${e.id})" class="btn btn-small btn-danger">Delete</button>
                </td>
            </tr>
        `}attachEventListeners(){const e=document.getElementById("incomeModal"),t=document.querySelector(".close"),a=document.getElementById("cancelIncomeBtn"),n=document.getElementById("incomeForm"),o=document.getElementById("incomePeriod"),s=document.getElementById("incomeQuantity"),i=document.getElementById("incomePrice"),c=document.getElementById("incomeAmount");document.getElementById("incomeDate").value=new Date().toISOString().split("T")[0];const l=()=>{const r=parseInt(s.value)||0,d=parseFloat(i.value)||0;c.value=(r*d).toFixed(2)};s.addEventListener("input",l),i.addEventListener("input",l),t.addEventListener("click",()=>this.hideModal()),a.addEventListener("click",()=>this.hideModal()),n.addEventListener("submit",r=>this.handleSubmit(r)),o.addEventListener("change",r=>{this.currentPeriod=r.target.value,this.render()}),window.onclick=r=>{r.target===e&&this.hideModal()},document.getElementById("logoutBtn").addEventListener("click",()=>{window.authManager.logout(),window.router.navigate("/login")}),window.incomeManager=this}showModal(){document.getElementById("incomeModal").style.display="block"}hideModal(){document.getElementById("incomeModal").style.display="none"}quickAdd(e){this.showModal();const t=document.getElementById("incomeCategory");t&&(t.value=e);const a=document.getElementById("incomeDescription");a&&a.focus()}handleSubmit(e){e.preventDefault();const t=document.getElementById("incomeCategory").value,a=parseInt(document.getElementById("incomeQuantity").value),n=parseFloat(document.getElementById("incomePrice").value),o=a*n,s={category:t,description:document.getElementById("incomeDescription").value,quantity:a,price:n,amount:o,date:document.getElementById("incomeDate").value};this.dataManager.addIncome(s),this.hideModal(),this.render()}deleteIncome(e){if(confirm("Are you sure you want to delete this income record?")){const a=this.dataManager.getIncome().filter(n=>n.id!==e);localStorage.setItem("income",JSON.stringify(a)),this.render()}}getTodayTotal(){const e=new Date().toISOString().split("T")[0];return this.dataManager.getIncome().filter(t=>t.date===e).reduce((t,a)=>t+a.amount,0)}getWeekTotal(){const e=new Date,t=new Date(e.getTime()-7*24*60*60*1e3);return this.dataManager.getIncome().filter(a=>{const n=new Date(a.date);return n>=t&&n<=e}).reduce((a,n)=>a+n.amount,0)}getPeriodData(e){const t=this.dataManager.getIncome(),a=new Date;let n;switch(e){case"day":n=new Date(a.getFullYear(),a.getMonth(),a.getDate());break;case"week":n=new Date(a.getTime()-7*24*60*60*1e3);break;case"month":n=new Date(a.getFullYear(),a.getMonth(),1);break;case"year":n=new Date(a.getFullYear(),0,1);break;default:n=new Date(0)}return{filtered:t.filter(s=>{const i=new Date(s.date);return i>=n&&i<=a}),todayTotal:this.getTodayTotal(),weekTotal:this.getWeekTotal()}}}class x{constructor(e){this.dataManager=e}render(){const e=this.currentPeriod||"day",{filtered:t,todayTotal:a,weekTotal:n}=this.getPeriodData(e);document.querySelector("#app").innerHTML=`
      <div class="dashboard">
        ${this.getHeader()}
        ${this.getNavigation()}
        
        <main class="dashboard-main">
          <div class="page-header">
            <h2>Expense Tracking</h2>
            <div>
              <select id="expensePeriod">
                <option value="day" ${e==="day"?"selected":""}>Today</option>
                <option value="week" ${e==="week"?"selected":""}>This Week</option>
                <option value="month" ${e==="month"?"selected":""}>This Month</option>
                <option value="year" ${e==="year"?"selected":""}>This Year</option>
                <option value="all" ${e==="all"?"selected":""}>All</option>
              </select>
              <button id="addExpenseBtn" class="btn btn-primary">Add Expense</button>
            </div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Today's Expenses</h3>
              <p class="stat-value">${a.toLocaleString()} ETB</p>
            </div>
            <div class="stat-card">
              <h3>This Week</h3>
              <p class="stat-value">${n.toLocaleString()} ETB</p>
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
                  ${t.map(o=>this.renderExpenseRow(o)).join("")}
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
    `,this.attachEventListeners()}renderExpenseRow(e){return`
      <tr>
        <td>${new Date(e.date).toLocaleDateString()}</td>
        <td><span class="category-badge category-${e.category}">${e.category}</span></td>
        <td>${e.description}</td>
        <td>${e.amount.toLocaleString()} ETB</td>
        <td>
          <button onclick="expenseManager.deleteExpense(${e.id})" class="btn btn-small btn-danger">Delete</button>
        </td>
      </tr>
    `}attachEventListeners(){const e=document.getElementById("expenseModal"),t=document.getElementById("addExpenseBtn"),a=document.querySelector(".close"),n=document.getElementById("cancelExpenseBtn"),o=document.getElementById("expenseForm"),s=document.getElementById("expensePeriod");document.getElementById("expenseDate").value=new Date().toISOString().split("T")[0],t.addEventListener("click",()=>this.showModal()),a.addEventListener("click",()=>this.hideModal()),n.addEventListener("click",()=>this.hideModal()),o.addEventListener("submit",i=>this.handleSubmit(i)),s.addEventListener("change",i=>{this.currentPeriod=i.target.value,this.render()}),window.onclick=i=>{i.target===e&&this.hideModal()},document.getElementById("logoutBtn").addEventListener("click",()=>{window.authManager.logout(),window.router.navigate("/login")}),window.expenseManager=this}showModal(){document.getElementById("expenseModal").style.display="block"}hideModal(){document.getElementById("expenseModal").style.display="none"}handleSubmit(e){e.preventDefault();const t={category:document.getElementById("expenseCategory").value,description:document.getElementById("expenseDescription").value,amount:parseFloat(document.getElementById("expenseAmount").value),date:document.getElementById("expenseDate").value};this.dataManager.addExpense(t),this.hideModal(),this.render()}deleteExpense(e){if(confirm("Are you sure you want to delete this expense record?")){const a=this.dataManager.getExpenses().filter(n=>n.id!==e);localStorage.setItem("expenses",JSON.stringify(a)),this.render()}}getTodayTotal(){const e=new Date().toISOString().split("T")[0];return this.dataManager.getExpenses().filter(t=>t.date===e).reduce((t,a)=>t+a.amount,0)}getWeekTotal(){const e=new Date,t=new Date(e.getTime()-7*24*60*60*1e3);return this.dataManager.getExpenses().filter(a=>{const n=new Date(a.date);return n>=t&&n<=e}).reduce((a,n)=>a+n.amount,0)}getPeriodData(e){const t=this.dataManager.getExpenses(),a=new Date;let n;switch(e){case"day":n=new Date(a.getFullYear(),a.getMonth(),a.getDate());break;case"week":n=new Date(a.getTime()-7*24*60*60*1e3);break;case"month":n=new Date(a.getFullYear(),a.getMonth(),1);break;case"year":n=new Date(a.getFullYear(),0,1);break;default:n=new Date(0)}return{filtered:t.filter(s=>{const i=new Date(s.date);return i>=n&&i<=a}),todayTotal:this.getTodayTotal(),weekTotal:this.getWeekTotal()}}getHeader(){return`
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
    `}getNavigation(){return`
      <nav class="dashboard-nav">
        <button onclick="router.navigate('/dashboard')" class="nav-btn">Dashboard</button>
        <button onclick="router.navigate('/employees')" class="nav-btn">Employees</button>
        <button onclick="router.navigate('/income')" class="nav-btn">Income</button>
        <button onclick="router.navigate('/expenses')" class="nav-btn active">Expenses</button>
        <button onclick="router.navigate('/inventory')" class="nav-btn">Inventory</button>
        <button onclick="router.navigate('/reports')" class="nav-btn">Reports</button>
      </nav>
    `}}class f{constructor(e){this.dataManager=e}render(){const e=this.dataManager.getInventory(),t=this.dataManager.getLowStockItems();document.querySelector("#app").innerHTML=`
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
                    
                    ${t.length?`
                        <div class="alert alert-warning">
                            <h4>Low Stock Alerts</h4>
                            ${t.map(a=>`<p>${a.name}: ${a.quantity}/${a.minStock} ${a.unit}</p>`).join("")}
                        </div>
                    `:""}

                    <div class="inventory-grid">
                        ${e.map(a=>this.renderInventoryCard(a)).join("")}
                    </div>
                    
                    ${this.renderItemModal()}
                    ${this.renderStockModal()}
                </main>
            </div>
        `,this.attachEventListeners()}renderInventoryCard(e){const t=e.quantity<=e.minStock;return`
            <div class="inventory-card ${t?"low-stock":""}">
                ${t?'<div class="low-stock-indicator">Low</div>':""}
                <div class="item-header">
                    <h4>${e.name}</h4>
                    <div>
                        <button class="btn btn-small" onclick="inventoryManager.openStockModal(${e.id}, 'in')">Stock In</button>
                        <button class="btn btn-small" onclick="inventoryManager.openStockModal(${e.id}, 'out')">Stock Out</button>
                    </div>
                </div>
                <div class="item-details">
                    <p class="quantity">Quantity: ${e.quantity} ${e.unit}</p>
                    <p>Category: ${e.category}</p>
                    <p>Min stock: ${e.minStock}</p>
                    <p>Last Updated: ${e.lastUpdated}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-small" onclick="inventoryManager.editItem(${e.id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="inventoryManager.deleteItem(${e.id})">Delete</button>
                </div>
            </div>
        `}renderItemModal(){return`
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
        `}renderStockModal(){return`
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
        `}attachEventListeners(){document.getElementById("addItemBtn").addEventListener("click",()=>this.openItemModal()),document.getElementById("closeItemModal").addEventListener("click",()=>this.closeItemModal()),document.getElementById("cancelItemBtn").addEventListener("click",()=>this.closeItemModal()),document.getElementById("itemForm").addEventListener("submit",e=>this.handleItemSubmit(e)),document.getElementById("closeStockModal").addEventListener("click",()=>this.closeStockModal()),document.getElementById("cancelStockBtn").addEventListener("click",()=>this.closeStockModal()),document.getElementById("stockForm").addEventListener("submit",e=>this.handleStockSubmit(e)),document.getElementById("logoutBtn").addEventListener("click",()=>{window.authManager.logout(),window.router.navigate("/login")}),window.inventoryManager=this}openItemModal(e=null){const t=document.getElementById("itemModalTitle"),a=document.getElementById("itemId"),n=document.getElementById("itemName"),o=document.getElementById("itemCategory"),s=document.getElementById("itemQuantity"),i=document.getElementById("itemUnit"),c=document.getElementById("itemMinStock");e?(t.textContent="Edit Item",a.value=e.id,n.value=e.name,o.value=e.category,s.value=e.quantity,i.value=e.unit,c.value=e.minStock):(t.textContent="Add Item",a.value="",n.value="",o.value="supplies",s.value="",i.value="",c.value=""),document.getElementById("itemModal").style.display="block"}closeItemModal(){document.getElementById("itemModal").style.display="none"}handleItemSubmit(e){e.preventDefault();const t=document.getElementById("itemId").value,a={name:document.getElementById("itemName").value,category:document.getElementById("itemCategory").value,quantity:parseFloat(document.getElementById("itemQuantity").value),unit:document.getElementById("itemUnit").value,minStock:parseFloat(document.getElementById("itemMinStock").value)};t?this.dataManager.updateInventoryItem(parseInt(t,10),a):this.dataManager.addInventoryItem(a),this.closeItemModal(),this.render()}editItem(e){const t=this.dataManager.getInventory().find(a=>a.id===e);t&&this.openItemModal(t)}deleteItem(e){confirm("Delete this item?")&&(this.dataManager.deleteInventoryItem(e),this.render())}openStockModal(e,t){this.stockDirection=t,document.getElementById("stockItemId").value=e,document.getElementById("stockModalTitle").textContent=t==="in"?"Stock In":"Stock Out",document.getElementById("stockQuantity").value="",document.getElementById("stockModal").style.display="block"}closeStockModal(){document.getElementById("stockModal").style.display="none"}handleStockSubmit(e){e.preventDefault();const t=parseInt(document.getElementById("stockItemId").value,10),a=parseFloat(document.getElementById("stockQuantity").value),n=this.dataManager.getInventory().find(s=>s.id===t);if(!n)return;const o=this.stockDirection==="in"?n.quantity+a:n.quantity-a;this.dataManager.updateInventoryItem(t,{quantity:Math.max(0,o)}),this.closeStockModal(),this.render()}}class w{constructor(e){this.dataManager=e}render(){document.querySelector("#app").innerHTML=`
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
        `,this.attachEventListeners(),this.initializeCharts()}renderFinancialSummary(){const e=this.getCurrentPeriod(),t=this.dataManager.getIncomeByPeriod(e.start,e.end),a=this.dataManager.getExpensesByPeriod(e.start,e.end),n=t.reduce((i,c)=>i+c.amount,0),o=a.reduce((i,c)=>i+c.amount,0),s=n-o;return`
            <div class="financial-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Income</span>
                    <span class="stat-value income">${n.toLocaleString()} ETB</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Expenses</span>
                    <span class="stat-value expense">${o.toLocaleString()} ETB</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Net Profit</span>
                    <span class="stat-value ${s>=0?"profit":"loss"}">${s.toLocaleString()} ETB</span>
                </div>
            </div>
        `}renderLowStockReport(){const e=this.dataManager.getLowStockItems();return e.length===0?'<p class="no-data">All items are adequately stocked</p>':`
            <div class="low-stock-list">
                ${e.map(t=>`
                    <div class="low-stock-item">
                        <span class="item-name">${t.name}</span>
                        <span class="stock-info">${t.quantity}/${t.minStock} ${t.unit}</span>
                    </div>
                `).join("")}
            </div>
        `}renderEmployeeSummary(){const e=this.dataManager.getEmployees(),t=e.reduce((n,o)=>n+o.salary,0),a=e.reduce((n,o)=>(n[o.role]=(n[o.role]||0)+1,n),{});return`
            <div class="employee-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Employees</span>
                    <span class="stat-value">${e.length}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Monthly Salaries</span>
                    <span class="stat-value expense">${t.toLocaleString()} ETB</span>
                </div>
                ${Object.entries(a).map(([n,o])=>`
                    <div class="stat-item">
                        <span class="stat-label">${n.charAt(0).toUpperCase()+n.slice(1)}s</span>
                        <span class="stat-value">${o}</span>
                    </div>
                `).join("")}
            </div>
        `}getCurrentPeriod(){const e=new Date;return{start:new Date(e.getTime()-7*24*60*60*1e3).toISOString().split("T")[0],end:e.toISOString().split("T")[0]}}initializeCharts(){this.createFinancialChart(),this.createComparisonChart()}createFinancialChart(){const e=document.getElementById("financialChart").getContext("2d"),t=this.getCurrentPeriod(),a=this.dataManager.getIncomeByPeriod(t.start,t.end),n=this.dataManager.getExpensesByPeriod(t.start,t.end),o=a.reduce((s,i)=>(s[i.category]=(s[i.category]||0)+i.amount,s),{});n.reduce((s,i)=>(s[i.category]=(s[i.category]||0)+i.amount,s),{}),new Chart(e,{type:"doughnut",data:{labels:Object.keys(o),datasets:[{label:"Income by Category",data:Object.values(o),backgroundColor:["#dc2626","#059669","#d97706","#7c3aed","#0891b2"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}})}createComparisonChart(){const e=document.getElementById("comparisonChart").getContext("2d");this.getCurrentPeriod();const t=[],a=[],n=[];for(let o=6;o>=0;o--){const s=new Date;s.setDate(s.getDate()-o);const i=s.toISOString().split("T")[0];t.push(s.toLocaleDateString("en-US",{weekday:"short"}));const c=this.dataManager.getIncome().filter(r=>r.date===i).reduce((r,d)=>r+d.amount,0),l=this.dataManager.getExpenses().filter(r=>r.date===i).reduce((r,d)=>r+d.amount,0);a.push(c),n.push(l)}new Chart(e,{type:"bar",data:{labels:t,datasets:[{label:"Income",data:a,backgroundColor:"#059669"},{label:"Expenses",data:n,backgroundColor:"#dc2626"}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{beginAtZero:!0}}}})}attachEventListeners(){const e=document.getElementById("reportPeriod"),t=document.getElementById("customDateRange"),a=document.getElementById("generateReportBtn"),n=document.getElementById("exportPdfBtn");e.addEventListener("change",o=>{o.target.value==="custom"?t.style.display="flex":t.style.display="none"}),a.addEventListener("click",()=>this.generateReport()),n.addEventListener("click",()=>this.exportToPDF()),document.getElementById("logoutBtn").addEventListener("click",()=>{window.authManager.logout(),window.router.navigate("/login")})}generateReport(){this.render()}async exportToPDF(){const{jsPDF:e}=window.jspdf,t=new e;t.setFontSize(20),t.text("Bridge Hotel - Financial Report",20,20),t.setFontSize(12),t.text(`Generated on: ${new Date().toLocaleDateString()}`,20,35);const a=this.getCurrentPeriod(),n=this.dataManager.getIncomeByPeriod(a.start,a.end),o=this.dataManager.getExpensesByPeriod(a.start,a.end),s=n.reduce((d,u)=>d+u.amount,0),i=o.reduce((d,u)=>d+u.amount,0),c=s-i;t.text(`Total Income: ${s.toLocaleString()} ETB`,20,55),t.text(`Total Expenses: ${i.toLocaleString()} ETB`,20,70),t.text(`Net Profit: ${c.toLocaleString()} ETB`,20,85);const l=this.dataManager.getEmployees();t.text(`Total Employees: ${l.length}`,20,105);const r=this.dataManager.getLowStockItems();if(t.text(`Low Stock Items: ${r.length}`,20,120),r.length>0){let d=135;r.forEach(u=>{t.text(`- ${u.name}: ${u.quantity}/${u.minStock} ${u.unit}`,25,d),d+=15})}t.save("bridge-hotel-report.pdf")}}class E{constructor(e){this.dataManager=e,this.taxRates={income:.15,vat:.15,service:.1}}render(){const e=this.currentPeriod||"month",{incomeData:t,taxData:a}=this.calculateTaxes(e);document.querySelector("#app").innerHTML=`
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
                                <option value="day" ${e==="day"?"selected":""}>Today</option>
                                <option value="week" ${e==="week"?"selected":""}>This Week</option>
                                <option value="month" ${e==="month"?"selected":""}>This Month</option>
                                <option value="year" ${e==="year"?"selected":""}>This Year</option>
                                <option value="all" ${e==="all"?"selected":""}>All</option>
                            </select>
                        </div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Total Income</h3>
                            <p class="stat-value">${t.totalIncome.toLocaleString()} ETB</p>
                        </div>
                        <div class="stat-card">
                            <h3>Income Tax (15%)</h3>
                            <p class="stat-value">${a.incomeTax.toLocaleString()} ETB</p>
                        </div>
                        <div class="stat-card">
                            <h3>VAT (15%)</h3>
                            <p class="stat-value">${a.vat.toLocaleString()} ETB</p>
                        </div>
                        <div class="stat-card">
                            <h3>Service Charge (10%)</h3>
                            <p class="stat-value">${a.serviceCharge.toLocaleString()} ETB</p>
                        </div>
                    </div>
                    
                    <div class="tax-details">
                        <div class="tax-card">
                            <h3>Tax Summary</h3>
                            <div class="tax-summary">
                                <div class="tax-row">
                                    <span class="tax-label">Total Income:</span>
                                    <span class="tax-value">${t.totalIncome.toLocaleString()} ETB</span>
                                </div>
                                <div class="tax-row">
                                    <span class="tax-label">Income Tax (15%):</span>
                                    <span class="tax-value">${a.incomeTax.toLocaleString()} ETB</span>
                                </div>
                                <div class="tax-row">
                                    <span class="tax-label">VAT (15%):</span>
                                    <span class="tax-value">${a.vat.toLocaleString()} ETB</span>
                                </div>
                                <div class="tax-row">
                                    <span class="tax-label">Service Charge (10%):</span>
                                    <span class="tax-value">${a.serviceCharge.toLocaleString()} ETB</span>
                                </div>
                                <div class="tax-row total">
                                    <span class="tax-label">Total Tax:</span>
                                    <span class="tax-value">${a.totalTax.toLocaleString()} ETB</span>
                                </div>
                                <div class="tax-row net">
                                    <span class="tax-label">Net Income (After Tax):</span>
                                    <span class="tax-value">${(t.totalIncome-a.totalTax).toLocaleString()} ETB</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tax-card">
                            <h3>Tax Breakdown by Category</h3>
                            <div class="tax-category-breakdown">
                                ${this.renderTaxCategoryBreakdown(t.incomeByCategory)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="tax-settings">
                        <h3>Tax Rate Settings</h3>
                        <form id="taxSettingsForm">
                            <div class="form-group">
                                <label for="incomeTaxRate">Income Tax Rate (%)</label>
                                <input type="number" id="incomeTaxRate" value="${this.taxRates.income*100}" min="0" max="100" step="0.1">
                            </div>
                            <div class="form-group">
                                <label for="vatRate">VAT Rate (%)</label>
                                <input type="number" id="vatRate" value="${this.taxRates.vat*100}" min="0" max="100" step="0.1">
                            </div>
                            <div class="form-group">
                                <label for="serviceChargeRate">Service Charge Rate (%)</label>
                                <input type="number" id="serviceChargeRate" value="${this.taxRates.service*100}" min="0" max="100" step="0.1">
                            </div>
                            <button type="submit" class="btn btn-primary">Update Tax Rates</button>
                        </form>
                    </div>
                </main>
            </div>
        `,this.attachEventListeners()}calculateTaxes(e){const t=this.getPeriodData(e),a={totalIncome:t.filtered.reduce((o,s)=>o+s.amount,0),incomeByCategory:this.groupIncomeByCategory(t.filtered)},n={incomeTax:a.totalIncome*this.taxRates.income,vat:a.totalIncome*this.taxRates.vat,serviceCharge:a.totalIncome*this.taxRates.service};return n.totalTax=n.incomeTax+n.vat+n.serviceCharge,{incomeData:a,taxData:n}}getPeriodData(e){const t=this.dataManager.getIncome(),a=new Date;a.setHours(0,0,0,0);let n,o=0,s=0;if(e==="day"){const l=a.toISOString().split("T")[0];n=t.filter(r=>r.date===l)}else if(e==="week"){const l=new Date(a);l.setDate(a.getDate()-7),n=t.filter(r=>{const d=new Date(r.date);return d>=l&&d<=a})}else if(e==="month"){const l=new Date(a.getFullYear(),a.getMonth(),1);n=t.filter(r=>{const d=new Date(r.date);return d>=l&&d<=a})}else if(e==="year"){const l=new Date(a.getFullYear(),0,1);n=t.filter(r=>{const d=new Date(r.date);return d>=l&&d<=a})}else n=[...t];const i=a.toISOString().split("T")[0];o=t.filter(l=>l.date===i).reduce((l,r)=>l+r.amount,0);const c=new Date(a);return c.setDate(a.getDate()-7),s=t.filter(l=>{const r=new Date(l.date);return r>=c&&r<=a}).reduce((l,r)=>l+r.amount,0),{filtered:n,todayTotal:o,weekTotal:s}}groupIncomeByCategory(e){return e.reduce((t,a)=>(t[a.category]||(t[a.category]={total:0,items:[]}),t[a.category].total+=a.amount,t[a.category].items.push(a),t),{})}renderTaxCategoryBreakdown(e){return Object.keys(e).length===0?'<p class="no-data">No income data available for this period</p>':Object.entries(e).map(([t,a])=>{const n=a.total*this.taxRates.income,o=a.total*this.taxRates.vat,s=a.total*this.taxRates.service,i=n+o+s;return`
                <div class="category-tax-item">
                    <div class="category-header">
                        <span class="category-badge category-${t}">${t}</span>
                        <span class="category-amount">${a.total.toLocaleString()} ETB</span>
                    </div>
                    <div class="category-tax-details">
                        <div class="tax-row">
                            <span class="tax-label">Income Tax:</span>
                            <span class="tax-value">${n.toLocaleString()} ETB</span>
                        </div>
                        <div class="tax-row">
                            <span class="tax-label">VAT:</span>
                            <span class="tax-value">${o.toLocaleString()} ETB</span>
                        </div>
                        <div class="tax-row">
                            <span class="tax-label">Service Charge:</span>
                            <span class="tax-value">${s.toLocaleString()} ETB</span>
                        </div>
                        <div class="tax-row total">
                            <span class="tax-label">Total Tax:</span>
                            <span class="tax-value">${i.toLocaleString()} ETB</span>
                        </div>
                    </div>
                </div>
            `}).join("")}attachEventListeners(){const e=document.getElementById("taxPeriod"),t=document.getElementById("taxSettingsForm");e.addEventListener("change",a=>{this.currentPeriod=a.target.value,this.render()}),t.addEventListener("submit",a=>{a.preventDefault(),this.taxRates={income:parseFloat(document.getElementById("incomeTaxRate").value)/100,vat:parseFloat(document.getElementById("vatRate").value)/100,service:parseFloat(document.getElementById("serviceChargeRate").value)/100},localStorage.setItem("taxRates",JSON.stringify(this.taxRates)),this.render()}),document.getElementById("logoutBtn").addEventListener("click",()=>{window.authManager.logout(),window.router.navigate("/login")}),window.taxManager=this}}class I{constructor(e,t){this.authManager=e,this.dataManager=t,this.routes={"/":()=>this.showHome(),"/login":()=>this.showLoginPage(),"/dashboard":()=>this.showProtectedDashboard(),"/employees":()=>this.showProtectedEmployees(),"/income":()=>this.showProtectedIncome(),"/expenses":()=>this.showProtectedExpenses(),"/inventory":()=>this.showProtectedInventory(),"/reports":()=>this.showProtectedReports(),"/tax":()=>this.showProtectedTax()}}init(){window.addEventListener("popstate",()=>this.handleRoute()),this.handleRoute()}navigate(e){window.history.pushState({},"",e),this.handleRoute()}handleRoute(){const e=window.location.pathname;(this.routes[e]||this.routes["/"])()}showHome(){this.authManager.isAuthenticated()?this.navigate("/dashboard"):this.navigate("/login")}showLoginPage(){document.querySelector("#app").innerHTML=`
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
                <label for="username" style="color:#374151;font-weight:600;">Username</label>
                <div class="input-group" style="position:relative;">
                  <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af;">👤</span>
                  <input type="text" id="username" name="username" required placeholder="Enter username" style="width:100%;padding:0.9rem 0.9rem 0.9rem 2.2rem;border:1px solid #e5e7eb;border-radius:12px;font-size:1rem;outline:none;transition:box-shadow .2s,border-color .2s;" onfocus="this.style.boxShadow='0 0 0 4px rgba(220,38,38,0.15)'; this.style.borderColor='#dc2626'" onblur="this.style.boxShadow='none'; this.style.borderColor='#e5e7eb'">
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
              <h4 style="margin:0 0 0.5rem 0;color:#374151;">Demo Credentials</h4>
              <ul style="margin:0;padding-left:1rem;color:#6b7280;">
              <li><strong>Admin:</strong> admin / admin123</li>
              <li><strong>Manager:</strong> manager / manager123</li>
              <li><strong>Staff:</strong> staff / staff123</li>
            </ul>
            </div>
          </div>
        </div>

        <div class="login-right" style="flex:1;color:#fff;display:flex;flex-direction:column;justify-content:center;padding:3.25rem;">
          <div class="hotel-info" style="max-width:560px;margin:0 auto;">
            <h2 style="font-size:2.4rem;margin-bottom:1rem;font-weight:900;text-shadow:0 2px 10px rgba(0,0,0,0.25);">Welcome to Bridge Hotel</h2>
            <p style="font-size:1.05rem;margin-bottom:2rem;opacity:0.95;">Ethiopia's trusted hotel management system. Handle reservations, employees, inventory, and finances seamlessly.</p>
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
    `,document.getElementById("loginForm").addEventListener("submit",t=>{t.preventDefault();const a=document.getElementById("username").value,n=document.getElementById("password").value;if(this.authManager.login(a,n))this.navigate("/dashboard");else{const o=document.getElementById("loginError");o.textContent="❌ Invalid username or password",o.style.display="block"}});const e=document.getElementById("togglePassword");e&&e.addEventListener("click",()=>{const t=document.getElementById("password"),a=t.getAttribute("type")==="password";t.setAttribute("type",a?"text":"password"),e.textContent=a?"Hide":"Show"})}showProtectedDashboard(){if(!this.authManager.requireAuth()){this.navigate("/login");return}this.showDashboard()}showProtectedEmployees(){if(!this.authManager.requireAuth()){this.navigate("/login");return}this.showEmployeesPage()}showProtectedIncome(){if(!this.authManager.requireAuth()){this.navigate("/login");return}this.showIncomePage()}showProtectedExpenses(){if(!this.authManager.requireAuth()){this.navigate("/login");return}this.showExpensesPage()}showProtectedInventory(){if(!this.authManager.requireAuth()){this.navigate("/login");return}this.showInventoryPage()}showProtectedReports(){if(!this.authManager.requireAuth()){this.navigate("/login");return}this.showReportsPage()}showProtectedTax(){if(!this.authManager.requireAuth()){this.navigate("/login");return}this.showTaxPage()}showDashboard(){const e=this.getDashboardBackgroundStyle();document.querySelector("#app").innerHTML=`
      <div class="dashboard" style="min-height:100vh;${e}">
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
              <div style="font-size:1.8rem;font-weight:800;color:#059669;">${this.dataManager.getThisMonthIncome().toLocaleString()} ETB</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);backdrop-filter:saturate(140%) blur(6px);border-radius:16px;padding:1.25rem;border:1px solid rgba(255,255,255,0.6);box-shadow:0 10px 25px rgba(0,0,0,0.15);">
              <div style="font-size:0.9rem;color:#6b7280;margin-bottom:0.25rem;">This Month Expenses</div>
              <div style="font-size:1.8rem;font-weight:800;color:#dc2626;">${this.dataManager.getThisMonthExpenses().toLocaleString()} ETB</div>
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
    `,this.attachLogoutHandler(),this.attachDashboardHandlers()}getDashboardBackgroundStyle(){const e=localStorage.getItem("dashboardBg")||"photo";return e==="gradient"?"background: radial-gradient(1200px 600px at -10% -10%, rgba(239,68,68,0.6) 0%, rgba(0,0,0,0.85) 70%), linear-gradient(135deg,#dc2626 0%, #000000 100%);":e==="pattern"?`background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${this.getPatternDataUrl()}) center/600px repeat fixed;`:"background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/assets/images/ethiopia.png') center/cover no-repeat fixed;"}getPatternDataUrl(){return`data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'>
        <rect width='300' height='300' fill='#111827'/>
        <g opacity='0.07'>
          <circle cx='50' cy='50' r='40' fill='#dc2626'/>
          <circle cx='150' cy='150' r='40' fill='#f59e0b'/>
          <circle cx='250' cy='250' r='40' fill='#16a34a'/>
          <path d='M0 150 L150 0 L300 150 L150 300 Z' fill='none' stroke='#ffffff' stroke-width='2'/>
        </g>
      </svg>`)}`}attachDashboardHandlers(){const e=document.getElementById("bgSelect");if(!e)return;const t=localStorage.getItem("dashboardBg")||"photo";e.value=t,e.addEventListener("change",a=>{localStorage.setItem("dashboardBg",a.target.value),this.showDashboard()})}showEmployeesPage(){new y(this.dataManager).render(),this.attachLogoutHandler()}showIncomePage(){new b(this.dataManager).render(),this.attachLogoutHandler()}showExpensesPage(){new x(this.dataManager).render(),this.attachLogoutHandler()}showInventoryPage(){new f(this.dataManager).render(),this.attachLogoutHandler()}showReportsPage(){new w(this.dataManager).render(),this.attachLogoutHandler()}showTaxPage(){new E(this.dataManager).render(),this.attachLogoutHandler()}attachLogoutHandler(){const e=document.getElementById("logoutBtn");e&&e.addEventListener("click",()=>{this.authManager.logout(),this.navigate("/login")})}}class k{constructor(){this.employees=JSON.parse(localStorage.getItem("employees"))||[{id:1,name:"Ahmed Mohammed",role:"chef",phone:"+251912345678",email:"ahmed@hararbridge.com",salary:8e3,hireDate:"2023-01-15"},{id:2,name:"Selamawit Bekele",role:"cashier",phone:"+251911234567",email:"selam@hararbridge.com",salary:5e3,hireDate:"2023-03-20"},{id:3,name:"Tewodros Alemayehu",role:"manager",phone:"+251922345678",email:"tewodros@hararbridge.com",salary:12e3,hireDate:"2022-11-10"}],this.income=JSON.parse(localStorage.getItem("income"))||[{id:1,category:"meals",description:"Lunch service",amount:12500,date:"2023-10-15"},{id:2,category:"drinks",description:"Beverage sales",amount:5600,date:"2023-10-15"},{id:3,category:"meat",description:"Special grill night",amount:8900,date:"2023-10-14"}],this.expenses=JSON.parse(localStorage.getItem("expenses"))||[{id:1,category:"supplies",description:"Kitchen supplies",amount:2500,date:"2023-10-15"},{id:2,category:"utilities",description:"Electricity bill",amount:1800,date:"2023-10-14"},{id:3,category:"salaries",description:"Staff payroll",amount:25e3,date:"2023-10-10"}],this.inventory=JSON.parse(localStorage.getItem("inventory"))||[{id:1,name:"Rice",category:"supplies",quantity:50,unit:"kg",minStock:20,price:60,lastUpdated:"2023-10-15"},{id:2,name:"Chicken",category:"meat",quantity:25,unit:"kg",minStock:15,price:180,lastUpdated:"2023-10-14"},{id:3,name:"Soft Drinks",category:"drinks",quantity:10,unit:"cases",minStock:5,price:450,lastUpdated:"2023-10-13"}]}getEmployees(){return this.employees}addEmployee(e){const t={id:Date.now(),...e};return this.employees.push(t),this.saveEmployees(),t}updateEmployee(e,t){const a=this.employees.findIndex(n=>n.id===e);a!==-1&&(this.employees[a]={...this.employees[a],...t},this.saveEmployees())}deleteEmployee(e){this.employees=this.employees.filter(t=>t.id!==e),this.saveEmployees()}saveEmployees(){localStorage.setItem("employees",JSON.stringify(this.employees))}getIncome(){return this.income}addIncome(e){const t={id:Date.now(),...e};return this.income.push(t),this.saveIncome(),t}getIncomeByPeriod(e,t){return this.income.filter(a=>{const n=new Date(a.date);return n>=new Date(e)&&n<=new Date(t)})}getThisMonthIncome(){const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),1);return this.getIncomeByPeriod(t,e).reduce((a,n)=>a+n.amount,0)}saveIncome(){localStorage.setItem("income",JSON.stringify(this.income))}getExpenses(){return this.expenses}addExpense(e){const t={id:Date.now(),...e};return this.expenses.push(t),this.saveExpenses(),t}getExpensesByPeriod(e,t){return this.expenses.filter(a=>{const n=new Date(a.date);return n>=new Date(e)&&n<=new Date(t)})}getThisMonthExpenses(){const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),1);return this.getExpensesByPeriod(t,e).reduce((a,n)=>a+n.amount,0)}saveExpenses(){localStorage.setItem("expenses",JSON.stringify(this.expenses))}getInventory(){return this.inventory}addInventoryItem(e){const t={id:Date.now(),lastUpdated:new Date().toISOString().split("T")[0],...e};return this.inventory.push(t),this.saveInventory(),t}updateInventoryItem(e,t){const a=this.inventory.findIndex(n=>n.id===e);a!==-1&&(this.inventory[a]={...this.inventory[a],...t,lastUpdated:new Date().toISOString().split("T")[0]},this.saveInventory())}deleteInventoryItem(e){this.inventory=this.inventory.filter(t=>t.id!==e),this.saveInventory()}getLowStockItems(){return this.inventory.filter(e=>e.quantity<=e.minStock)}saveInventory(){localStorage.setItem("inventory",JSON.stringify(this.inventory))}}const m=new k,g=new v(m),h=new I(g,m);window.router=h;window.authManager=g;window.dataManager=m;h.init();
