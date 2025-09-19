import { supabase } from './supabase.js';

class AuthManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.currentUser = null;
        this.isLoading = false;
        
        // Initialize auth state
        this.init();
    }

    async init() {
        try {
            // Get initial session
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                this.currentUser = session.user;
                this.updateUserRole(session.user);
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    this.currentUser = session.user;
                    await this.updateUserRole(session.user);
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                }
                
                // Trigger any UI updates if needed
                this.onAuthStateChange?.(event, session);
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
        }
    }

    async updateUserRole(user) {
        try {
            // Get user role from your users table
            const { data, error } = await supabase
                .from('users')
                .select('role')
                .eq('email', user.email)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Error fetching user role:', error);
                return;
            }

            // Set default role if not found in database
            this.currentUser.role = data?.role || 'staff';
        } catch (error) {
            console.error('Error updating user role:', error);
            this.currentUser.role = 'staff'; // Default role
        }
    }

    async login(email, password) {
        try {
            this.isLoading = true;
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error('Login error:', error.message);
                return { success: false, error: error.message };
            }

            this.currentUser = data.user;
            await this.updateUserRole(data.user);
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'An unexpected error occurred' };
        } finally {
            this.isLoading = false;
        }
    }

    async signup(email, password, name, role = 'staff') {
        try {
            this.isLoading = true;
            
            // Sign up user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password
            });

            if (authError) {
                console.error('Signup error:', authError.message);
                return { success: false, error: authError.message };
            }

            // Add user to users table
            const { error: userError } = await supabase
                .from('users')
                .insert([
                    {
                        email: email,
                        name: name,
                        role: role
                    }
                ]);

            if (userError) {
                console.error('Error adding user to database:', userError);
                // Don't fail the signup if this fails, user can still log in
            }

            return { success: true, user: authData.user };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: 'An unexpected error occurred' };
        } finally {
            this.isLoading = false;
        }
    }

    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
                return { success: false, error: error.message };
            }
            
            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: 'An unexpected error occurred' };
        }
    }

    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) {
                console.error('Password reset error:', error);
                return { success: false, error: error.message };
            }
            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, error: 'An unexpected error occurred' };
        }
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

    getUser() {
        return this.currentUser;
    }

    getUserId() {
        return this.currentUser?.id;
    }

    getUserEmail() {
        return this.currentUser?.email;
    }

    getUserRole() {
        return this.currentUser?.role;
    }

    // Method to set callback for auth state changes
    setAuthStateChangeCallback(callback) {
        this.onAuthStateChange = callback;
    }
}

export default AuthManager;