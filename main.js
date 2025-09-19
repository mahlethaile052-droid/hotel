import './style.css'
import AuthManager from './js/auth.js'
import Router from './js/router.js'
import DataManager from './js/dataManager.js'

// Initialize core systems
const dataManager = new DataManager();
const authManager = new AuthManager(dataManager);
const router = new Router(authManager, dataManager);

// Make systems globally available for navigation
window.router = router;
window.authManager = authManager;
window.dataManager = dataManager;

// Initialize the application with async support
async function initApp() {
    try {
        // Show loading state
        showLoadingState();
        
        // Wait for data to load
        await dataManager.init();
        
        // Initialize router
        router.init();
        
        // Hide loading state
        hideLoadingState();
        
        console.log('Hotel management system initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        hideLoadingState();
        showErrorState('Failed to initialize the application. Please check your Supabase configuration and refresh the page.');
    }
}

function showLoadingState() {
    // You can customize this based on your UI
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'app-loading';
    loadingDiv.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.8); display: flex; justify-content: center; 
                    align-items: center; z-index: 9999; color: white; font-size: 18px;">
            <div style="text-align: center;">
                <div style="margin-bottom: 20px;">Loading Hotel Management System...</div>
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; 
                            border-top: 4px solid #3498db; border-radius: 50%; 
                            animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(loadingDiv);
}

function hideLoadingState() {
    const loadingDiv = document.getElementById('app-loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function showErrorState(message) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'app-error';
    errorDiv.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.9); display: flex; justify-content: center; 
                    align-items: center; z-index: 9999; color: white; font-size: 18px;">
            <div style="text-align: center; max-width: 500px; padding: 20px;">
                <h2 style="color: #e74c3c; margin-bottom: 20px;">Error</h2>
                <p style="margin-bottom: 20px;">${message}</p>
                <button onclick="location.reload()" style="padding: 10px 20px; 
                        background: #3498db; color: white; border: none; 
                        border-radius: 5px; cursor: pointer; font-size: 16px;">
                    Refresh Page
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(errorDiv);
}

// Start the application
initApp();