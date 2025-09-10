class AuthManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    login(username, password) {
        // Simple demo authentication
        if (username === 'admin' && password === 'password123') {
            this.currentUser = { name: 'Admin User', role: 'admin' };
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

    hasPermission(permission) {
        // For now, admin has all permissions
        return this.currentUser && this.currentUser.role === 'admin';
    }
}

export default AuthManager;