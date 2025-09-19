import { supabase, TABLES, handleSupabaseError, handleSupabaseSuccess } from './supabase.js';

class DataManager {
    constructor() {
        this.employees = [];
        this.income = [];
        this.expenses = [];
        this.inventory = [];
        this.payments = [];
        this.isLoading = false;
        
        // Initialize data from Supabase
        this.init();
    }

    async init() {
        try {
            await Promise.all([
                this.loadEmployees(),
                this.loadIncome(),
                this.loadExpenses(),
                this.loadInventory(),
                this.loadPayments()
            ]);
        } catch (error) {
            console.error('Error initializing data:', error);
        }
    }

    async loadPayments() {
        try {
            const { data, error } = await supabase
                .from(TABLES.PAYMENTS)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            this.payments = data || [];
        } catch (error) {
            console.error('Error loading payments:', error);
            this.payments = [];
        }
    }

    getPayments() {
        return this.payments;
    }

    async createPayment({ amount, currency = 'ETB', description, provider = 'paypal', providerPaymentId, userEmail, status = 'created' }) {
        try {
            this.isLoading = true;
            const { data, error } = await supabase
                .from(TABLES.PAYMENTS)
                .insert([{ amount, currency, description, status, provider, provider_payment_id: providerPaymentId, user_email: userEmail }])
                .select()
                .single();

            if (error) throw error;

            this.payments.unshift(data);
            return handleSupabaseSuccess(data, 'create payment');
        } catch (error) {
            return handleSupabaseError(error, 'create payment');
        } finally {
            this.isLoading = false;
        }
    }

    async updatePaymentStatus(id, status, providerPaymentId) {
        try {
            this.isLoading = true;
            const { data, error } = await supabase
                .from(TABLES.PAYMENTS)
                .update({ status, provider_payment_id: providerPaymentId, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            const index = this.payments.findIndex(p => p.id === id);
            if (index !== -1) this.payments[index] = data;
            return handleSupabaseSuccess(data, 'update payment');
        } catch (error) {
            return handleSupabaseError(error, 'update payment');
        } finally {
            this.isLoading = false;
        }
    }

    async loadEmployees() {
        try {
            const { data, error } = await supabase
                .from(TABLES.EMPLOYEES)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            this.employees = data || [];
        } catch (error) {
            console.error('Error loading employees:', error);
            this.employees = [];
        }
    }

    async loadIncome() {
        try {
            const { data, error } = await supabase
                .from(TABLES.INCOME)
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            this.income = data || [];
        } catch (error) {
            console.error('Error loading income:', error);
            this.income = [];
        }
    }

    async loadExpenses() {
        try {
            const { data, error } = await supabase
                .from(TABLES.EXPENSES)
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            this.expenses = data || [];
        } catch (error) {
            console.error('Error loading expenses:', error);
            this.expenses = [];
        }
    }

    async loadInventory() {
        try {
            const { data, error } = await supabase
                .from(TABLES.INVENTORY)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            this.inventory = data || [];
        } catch (error) {
            console.error('Error loading inventory:', error);
            this.inventory = [];
        }
    }
    
    // Employee methods
    getEmployees() {
        return this.employees;
    }
    
    async addEmployee(employeeData) {
        try {
            this.isLoading = true;
            const { data, error } = await supabase
                .from(TABLES.EMPLOYEES)
                .insert([{
                    name: employeeData.name,
                    role: employeeData.role,
                    phone: employeeData.phone,
                    email: employeeData.email,
                    salary: employeeData.salary,
                    hire_date: employeeData.hireDate
                }])
                .select()
                .single();

            if (error) throw error;
            
            this.employees.unshift(data);
            return handleSupabaseSuccess(data, 'add employee');
        } catch (error) {
            return handleSupabaseError(error, 'add employee');
        } finally {
            this.isLoading = false;
        }
    }
    
    async updateEmployee(id, employeeData) {
        try {
            this.isLoading = true;
            const { data, error } = await supabase
                .from(TABLES.EMPLOYEES)
                .update({
                    name: employeeData.name,
                    role: employeeData.role,
                    phone: employeeData.phone,
                    email: employeeData.email,
                    salary: employeeData.salary,
                    hire_date: employeeData.hireDate,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            
            const index = this.employees.findIndex(emp => emp.id === id);
            if (index !== -1) {
                this.employees[index] = data;
            }
            
            return handleSupabaseSuccess(data, 'update employee');
        } catch (error) {
            return handleSupabaseError(error, 'update employee');
        } finally {
            this.isLoading = false;
        }
    }
    
    async deleteEmployee(id) {
        try {
            this.isLoading = true;
            const { error } = await supabase
                .from(TABLES.EMPLOYEES)
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            this.employees = this.employees.filter(emp => emp.id !== id);
            return handleSupabaseSuccess(null, 'delete employee');
        } catch (error) {
            return handleSupabaseError(error, 'delete employee');
        } finally {
            this.isLoading = false;
        }
    }
    
    // Income methods
    getIncome() {
        return this.income;
    }
    
    async addIncome(incomeData) {
        try {
            this.isLoading = true;
            const { data, error } = await supabase
                .from(TABLES.INCOME)
                .insert([{
                    category: incomeData.category,
                    description: incomeData.description,
                    amount: incomeData.amount,
                    date: incomeData.date
                }])
                .select()
                .single();

            if (error) throw error;
            
            this.income.unshift(data);
            return handleSupabaseSuccess(data, 'add income');
        } catch (error) {
            return handleSupabaseError(error, 'add income');
        } finally {
            this.isLoading = false;
        }
    }
    
    async getIncomeByPeriod(startDate, endDate) {
        try {
            const { data, error } = await supabase
                .from(TABLES.INCOME)
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching income by period:', error);
            return [];
        }
    }
    
    async getThisMonthIncome() {
        try {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const incomeData = await this.getIncomeByPeriod(
                firstDay.toISOString().split('T')[0], 
                today.toISOString().split('T')[0]
            );
            return incomeData.reduce((total, item) => total + parseFloat(item.amount), 0);
        } catch (error) {
            console.error('Error calculating this month income:', error);
            return 0;
        }
    }

    async deleteIncome(id) {
        try {
            this.isLoading = true;
            const { error } = await supabase
                .from(TABLES.INCOME)
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            this.income = this.income.filter(item => item.id !== id);
            return handleSupabaseSuccess(null, 'delete income');
        } catch (error) {
            return handleSupabaseError(error, 'delete income');
        } finally {
            this.isLoading = false;
        }
    }
    
    // Expense methods
    getExpenses() {
        return this.expenses;
    }
    
    async addExpense(expenseData) {
        try {
            this.isLoading = true;
            const { data, error } = await supabase
                .from(TABLES.EXPENSES)
                .insert([{
                    category: expenseData.category,
                    description: expenseData.description,
                    amount: expenseData.amount,
                    date: expenseData.date
                }])
                .select()
                .single();

            if (error) throw error;
            
            this.expenses.unshift(data);
            return handleSupabaseSuccess(data, 'add expense');
        } catch (error) {
            return handleSupabaseError(error, 'add expense');
        } finally {
            this.isLoading = false;
        }
    }
    
    async getExpensesByPeriod(startDate, endDate) {
        try {
            const { data, error } = await supabase
                .from(TABLES.EXPENSES)
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching expenses by period:', error);
            return [];
        }
    }
    
    async getThisMonthExpenses() {
        try {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const expenseData = await this.getExpensesByPeriod(
                firstDay.toISOString().split('T')[0], 
                today.toISOString().split('T')[0]
            );
            return expenseData.reduce((total, item) => total + parseFloat(item.amount), 0);
        } catch (error) {
            console.error('Error calculating this month expenses:', error);
            return 0;
        }
    }

    async deleteExpense(id) {
        try {
            this.isLoading = true;
            const { error } = await supabase
                .from(TABLES.EXPENSES)
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            this.expenses = this.expenses.filter(item => item.id !== id);
            return handleSupabaseSuccess(null, 'delete expense');
        } catch (error) {
            return handleSupabaseError(error, 'delete expense');
        } finally {
            this.isLoading = false;
        }
    }
    
    // Inventory methods
    getInventory() {
        return this.inventory;
    }
    
    async addInventoryItem(itemData) {
        try {
            this.isLoading = true;
            const { data, error } = await supabase
                .from(TABLES.INVENTORY)
                .insert([{
                    name: itemData.name,
                    category: itemData.category,
                    quantity: itemData.quantity,
                    unit: itemData.unit,
                    min_stock: itemData.minStock,
                    price: itemData.price,
                    last_updated: new Date().toISOString().split('T')[0]
                }])
                .select()
                .single();

            if (error) throw error;
            
            this.inventory.unshift(data);
            return handleSupabaseSuccess(data, 'add inventory item');
        } catch (error) {
            return handleSupabaseError(error, 'add inventory item');
        } finally {
            this.isLoading = false;
        }
    }
    
    async updateInventoryItem(id, itemData) {
        try {
            this.isLoading = true;
            const { data, error } = await supabase
                .from(TABLES.INVENTORY)
                .update({
                    name: itemData.name,
                    category: itemData.category,
                    quantity: itemData.quantity,
                    unit: itemData.unit,
                    min_stock: itemData.minStock,
                    price: itemData.price,
                    last_updated: new Date().toISOString().split('T')[0],
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            
            const index = this.inventory.findIndex(item => item.id === id);
            if (index !== -1) {
                this.inventory[index] = data;
            }
            
            return handleSupabaseSuccess(data, 'update inventory item');
        } catch (error) {
            return handleSupabaseError(error, 'update inventory item');
        } finally {
            this.isLoading = false;
        }
    }
    
    async deleteInventoryItem(id) {
        try {
            this.isLoading = true;
            const { error } = await supabase
                .from(TABLES.INVENTORY)
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            this.inventory = this.inventory.filter(item => item.id !== id);
            return handleSupabaseSuccess(null, 'delete inventory item');
        } catch (error) {
            return handleSupabaseError(error, 'delete inventory item');
        } finally {
            this.isLoading = false;
        }
    }
    
    getLowStockItems() {
        return this.inventory.filter(item => parseFloat(item.quantity) <= parseFloat(item.min_stock));
    }
}

export default DataManager;