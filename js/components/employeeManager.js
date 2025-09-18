class EmployeeManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    render() {
        const employees = this.dataManager.getEmployees();
        
        document.querySelector('#app').innerHTML = `
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
                        ${employees.map(employee => this.renderEmployeeCard(employee)).join('')}
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
        `;

        this.attachEventListeners();
    }

    renderEmployeeCard(employee) {
        return `
            <div class="employee-card">
                <div class="employee-info">
                    <h4>${employee.name}</h4>
                    <p class="employee-role">${employee.role}</p>
                    <p class="employee-contact">${employee.sex ? `Sex: ${employee.sex.charAt(0).toUpperCase() + employee.sex.slice(1)}` : ''}</p>
                    <p class="employee-contact">${employee.age ? `Age: ${employee.age}` : ''}</p>
                    <p class="employee-contact">${employee.phone}</p>
                    <p class="employee-contact">${employee.email}</p>
                    <p class="employee-salary">${employee.salary.toLocaleString()} ETB/month</p>
                    <p class="employee-hire-date">Hired: ${new Date(employee.hireDate).toLocaleDateString()}</p>
                </div>
                <div class="employee-actions">
                    <button onclick="employeeManager.editEmployee(${employee.id})" class="btn btn-small">Edit</button>
                    <button onclick="employeeManager.deleteEmployee(${employee.id})" class="btn btn-small btn-danger">Delete</button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const modal = document.getElementById('employeeModal');
        const addBtn = document.getElementById('addEmployeeBtn');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancelBtn');
        const form = document.getElementById('employeeForm');
        const ageInput = document.getElementById('employeeAge');

        addBtn.addEventListener('click', () => this.showModal());
        closeBtn.addEventListener('click', () => this.hideModal());
        cancelBtn.addEventListener('click', () => this.hideModal());
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add age validation on input
        ageInput.addEventListener('input', () => {
            const age = parseInt(ageInput.value);
            const ageError = document.getElementById('ageError');
            
            if (age < 18) {
                ageError.style.display = 'block';
            } else {
                ageError.style.display = 'none';
            }
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

        // Make methods globally available
        window.employeeManager = this;
    }

    showModal(employee = null) {
        const modal = document.getElementById('employeeModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('employeeForm');

        if (employee) {
            title.textContent = 'Edit Employee';
            document.getElementById('employeeId').value = employee.id;
            document.getElementById('employeeName').value = employee.name;
            document.getElementById('employeeSex').value = employee.sex || '';
            document.getElementById('employeeAge').value = employee.age || '';
            document.getElementById('employeeRole').value = employee.role;
            document.getElementById('employeePhone').value = employee.phone;
            document.getElementById('employeeEmail').value = employee.email;
            document.getElementById('employeeSalary').value = employee.salary;
            document.getElementById('employeeHireDate').value = employee.hireDate;
        } else {
            title.textContent = 'Add Employee';
            form.reset();
            document.getElementById('employeeId').value = '';
            document.getElementById('ageError').style.display = 'none';
        }

        modal.style.display = 'flex';
        
        // Ensure the form is scrolled to the top when opened
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }

    hideModal() {
        document.getElementById('employeeModal').style.display = 'none';
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const age = parseInt(document.getElementById('employeeAge').value);
        const ageError = document.getElementById('ageError');
        
        // Validate age
        if (age < 18) {
            ageError.style.display = 'block';
            return;
        }
        
        ageError.style.display = 'none';
        
        const employeeData = {
            name: document.getElementById('employeeName').value,
            sex: document.getElementById('employeeSex').value,
            age: age,
            role: document.getElementById('employeeRole').value,
            phone: document.getElementById('employeePhone').value,
            email: document.getElementById('employeeEmail').value,
            salary: parseInt(document.getElementById('employeeSalary').value),
            hireDate: document.getElementById('employeeHireDate').value
        };

        const employeeId = document.getElementById('employeeId').value;

        if (employeeId) {
            this.dataManager.updateEmployee(parseInt(employeeId), employeeData);
        } else {
            this.dataManager.addEmployee(employeeData);
        }

        this.hideModal();
        this.render();
    }

    editEmployee(id) {
        const employee = this.dataManager.getEmployees().find(emp => emp.id === id);
        if (employee) {
            this.showModal(employee);
        }
    }

    deleteEmployee(id) {
        if (confirm('Are you sure you want to delete this employee?')) {
            this.dataManager.deleteEmployee(id);
            this.render();
        }
    }
}

export default EmployeeManager;