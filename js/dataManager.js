class DataManager {
    constructor() {
        this.employees = JSON.parse(localStorage.getItem('employees')) || [
            { id: 1, name: "Ahmed Mohammed", role: "chef", phone: "+251912345678", email: "ahmed@hararbridge.com", salary: 8000, hireDate: "2023-01-15" },
            { id: 2, name: "Selamawit Bekele", role: "cashier", phone: "+251911234567", email: "selam@hararbridge.com", salary: 5000, hireDate: "2023-03-20" },
            { id: 3, name: "Tewodros Alemayehu", role: "manager", phone: "+251922345678", email: "tewodros@hararbridge.com", salary: 12000, hireDate: "2022-11-10" }
        ];
        
        this.income = JSON.parse(localStorage.getItem('income')) || [
            { id: 1, category: "meals", description: "Lunch service", amount: 12500, date: "2023-10-15" },
            { id: 2, category: "drinks", description: "Beverage sales", amount: 5600, date: "2023-10-15" },
            { id: 3, category: "meat", description: "Special grill night", amount: 8900, date: "2023-10-14" }
        ];
        
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [
            { id: 1, category: "supplies", description: "Kitchen supplies", amount: 2500, date: "2023-10-15" },
            { id: 2, category: "utilities", description: "Electricity bill", amount: 1800, date: "2023-10-14" },
            { id: 3, category: "salaries", description: "Staff payroll", amount: 25000, date: "2023-10-10" }
        ];
        
        this.inventory = JSON.parse(localStorage.getItem('inventory')) || [
            { id: 1, name: "Rice", category: "supplies", quantity: 50, unit: "kg", minStock: 20, price: 60, lastUpdated: "2023-10-15" },
            { id: 2, name: "Chicken", category: "meat", quantity: 25, unit: "kg", minStock: 15, price: 180, lastUpdated: "2023-10-14" },
            { id: 3, name: "Soft Drinks", category: "drinks", quantity: 10, unit: "cases", minStock: 5, price: 450, lastUpdated: "2023-10-13" }
        ];
    }
    
    // Employee methods
    getEmployees() {
        return this.employees;
    }
    
    addEmployee(employeeData) {
        const newEmployee = {
            id: Date.now(),
            ...employeeData
        };
        this.employees.push(newEmployee);
        this.saveEmployees();
        return newEmployee;
    }
    
    updateEmployee(id, employeeData) {
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
            this.employees[index] = { ...this.employees[index], ...employeeData };
            this.saveEmployees();
        }
    }
    
    deleteEmployee(id) {
        this.employees = this.employees.filter(emp => emp.id !== id);
        this.saveEmployees();
    }
    
    saveEmployees() {
        localStorage.setItem('employees', JSON.stringify(this.employees));
    }
    
    // Income methods
    getIncome() {
        return this.income;
    }
    
    addIncome(incomeData) {
        const newIncome = {
            id: Date.now(),
            ...incomeData
        };
        this.income.push(newIncome);
        this.saveIncome();
        return newIncome;
    }
    
    getIncomeByPeriod(startDate, endDate) {
        return this.income.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
    }
    
    getThisMonthIncome() {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        return this.getIncomeByPeriod(firstDay, today)
            .reduce((total, item) => total + item.amount, 0);
    }
    
    saveIncome() {
        localStorage.setItem('income', JSON.stringify(this.income));
    }
    
    // Expense methods
    getExpenses() {
        return this.expenses;
    }
    
    addExpense(expenseData) {
        const newExpense = {
            id: Date.now(),
            ...expenseData
        };
        this.expenses.push(newExpense);
        this.saveExpenses();
        return newExpense;
    }
    
    getExpensesByPeriod(startDate, endDate) {
        return this.expenses.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
    }
    
    getThisMonthExpenses() {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        return this.getExpensesByPeriod(firstDay, today)
            .reduce((total, item) => total + item.amount, 0);
    }
    
    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }
    
    // Inventory methods
    getInventory() {
        return this.inventory;
    }
    
    addInventoryItem(itemData) {
        const newItem = {
            id: Date.now(),
            lastUpdated: new Date().toISOString().split('T')[0],
            ...itemData
        };
        this.inventory.push(newItem);
        this.saveInventory();
        return newItem;
    }
    
    updateInventoryItem(id, itemData) {
        const index = this.inventory.findIndex(item => item.id === id);
        if (index !== -1) {
            this.inventory[index] = { 
                ...this.inventory[index], 
                ...itemData,
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            this.saveInventory();
        }
    }
    
    deleteInventoryItem(id) {
        this.inventory = this.inventory.filter(item => item.id !== id);
        this.saveInventory();
    }
    
    getLowStockItems() {
        return this.inventory.filter(item => item.quantity <= item.minStock);
    }
    
    saveInventory() {
        localStorage.setItem('inventory', JSON.stringify(this.inventory));
    }
}

export default DataManager;