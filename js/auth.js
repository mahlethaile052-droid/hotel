class AuthManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

        // Demo users
        this.demoUsers = {
            admin: { password: 'admin123', name: 'Admin User', role: 'admin' },
            manager: { password: 'manager123', name: 'Manager User', role: 'manager' },
            staff: { password: 'staff123', name: 'Staff User', role: 'staff' }
        };
    }

    login(username, password) {
        const userKey = (username || '').toLowerCase();
        const record = this.demoUsers[userKey];
        if (record && record.password === password) {
            this.currentUser = { name: record.name, role: record.role, username: userKey };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    requireAuth() {
        return this.isAuthenticated();
    }

    hasPermission(requiredRole) {
        if (!this.currentUser) return false;
        if (!requiredRole) return true;
        if (requiredRole === 'admin') return this.currentUser.role === 'admin';
        if (requiredRole === 'manager') return this.currentUser.role === 'admin' || this.currentUser.role === 'manager';
        return true;
    }
}

export default AuthManager;