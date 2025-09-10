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

// Initialize the application
router.init();