// Authentication Module
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        const togglePassword = document.getElementById('togglePassword');
        const rememberMe = document.getElementById('rememberMe');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Load saved username if "Remember me" was checked
        this.loadSavedCredentials();
    }

    async handleLogin(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Clear any previous error messages
        this.hideError();

        // Validate input
        if (!username || !password) {
            this.showError('Please enter both username and password.');
            return;
        }

        // Show loading spinner
        this.showLoading();

        try {
            // Simulate API call delay
            await this.delay(1500);

            // Demo authentication - replace with real authentication logic
            if (this.validateCredentials(username, password)) {
                // Save credentials if remember me is checked
                if (rememberMe) {
                    this.saveCredentials(username);
                } else {
                    this.clearSavedCredentials();
                }

                // Store authentication state
                this.setAuthState(username);

                // Redirect to dashboard
                this.redirectToDashboard();
            } else {
                this.showError('Invalid username or password. Please try again.');
            }
        } catch (error) {
            this.showError('Login failed. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    validateCredentials(username, password) {
        // Demo credentials - replace with real authentication
        const validCredentials = [
            { username: 'admin', password: 'admin123' },
            { username: 'user', password: 'user123' },
            { username: 'demo', password: 'demo123' }
        ];

        return validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('#togglePassword i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleIcon.className = 'fas fa-eye';
        }
    }

    saveCredentials(username) {
        localStorage.setItem('erp_remembered_username', username);
    }

    loadSavedCredentials() {
        const savedUsername = localStorage.getItem('erp_remembered_username');
        if (savedUsername) {
            const usernameInput = document.getElementById('username');
            const rememberCheckbox = document.getElementById('rememberMe');
            
            if (usernameInput) {
                usernameInput.value = savedUsername;
            }
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    }

    clearSavedCredentials() {
        localStorage.removeItem('erp_remembered_username');
    }

    setAuthState(username) {
        const authData = {
            username: username,
            loginTime: new Date().toISOString(),
            isAuthenticated: true
        };
        
        localStorage.setItem('erp_auth', JSON.stringify(authData));
        sessionStorage.setItem('erp_session', 'active');
    }

    checkAuthStatus() {
        // If we're on the dashboard page, check if user is authenticated
        if (window.location.pathname.includes('dashboard.html')) {
            const authData = localStorage.getItem('erp_auth');
            const sessionData = sessionStorage.getItem('erp_session');

            if (!authData || !sessionData) {
                this.redirectToLogin();
            }
        }
    }

    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }

    redirectToLogin() {
        window.location.href = 'index.html';
    }

    logout() {
        localStorage.removeItem('erp_auth');
        sessionStorage.removeItem('erp_session');
        this.redirectToLogin();
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                this.hideError();
            }, 5000);
        }
    }

    hideError() {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    showLoading() {
        const loadingElement = document.getElementById('loadingSpinner');
        if (loadingElement) {
            loadingElement.classList.add('show');
        }
    }

    hideLoading() {
        const loadingElement = document.getElementById('loadingSpinner');
        if (loadingElement) {
            loadingElement.classList.remove('show');
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getCurrentUser() {
        const authData = localStorage.getItem('erp_auth');
        if (authData) {
            return JSON.parse(authData);
        }
        return null;
    }
}

// Enhanced Form Validation
class FormValidator {
    constructor() {
        this.rules = {
            username: {
                required: true,
                minLength: 3,
                pattern: /^[a-zA-Z0-9_]+$/,
                message: 'Username must be at least 3 characters and contain only letters, numbers, and underscores'
            },
            password: {
                required: true,
                minLength: 6,
                message: 'Password must be at least 6 characters long'
            }
        };
        
        this.bindValidationEvents();
    }

    bindValidationEvents() {
        const inputs = document.querySelectorAll('#loginForm input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(input) {
        const rule = this.rules[input.name];
        if (!rule) return true;

        const value = input.value.trim();
        let isValid = true;
        let message = '';

        // Check required
        if (rule.required && !value) {
            isValid = false;
            message = `${this.capitalizeFirst(input.name)} is required`;
        }

        // Check minimum length
        if (isValid && rule.minLength && value.length < rule.minLength) {
            isValid = false;
            message = rule.message || `${this.capitalizeFirst(input.name)} must be at least ${rule.minLength} characters`;
        }

        // Check pattern
        if (isValid && rule.pattern && !rule.pattern.test(value)) {
            isValid = false;
            message = rule.message || `${this.capitalizeFirst(input.name)} format is invalid`;
        }

        if (!isValid) {
            this.showFieldError(input, message);
        } else {
            this.clearFieldError(input);
        }

        return isValid;
    }

    validateForm() {
        const inputs = document.querySelectorAll('#loginForm input[required]');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    showFieldError(input, message) {
        this.clearFieldError(input);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--error-color);
            font-size: 12px;
            margin-top: 4px;
            display: block;
        `;
        
        input.style.borderColor = 'var(--error-color)';
        input.parentNode.parentNode.appendChild(errorElement);
    }

    clearFieldError(input) {
        const errorElement = input.parentNode.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        input.style.borderColor = '';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication manager
    window.authManager = new AuthManager();
    
    // Initialize form validator for login page
    if (document.getElementById('loginForm')) {
        window.formValidator = new FormValidator();
        
        // Enhance login form validation
        const loginForm = document.getElementById('loginForm');
        const originalSubmitHandler = loginForm.onsubmit;
        
        loginForm.addEventListener('submit', function(e) {
            if (!window.formValidator.validateForm()) {
                e.preventDefault();
                return false;
            }
        });
    }

    // Add some interactive animations
    addInteractiveAnimations();
});

function addInteractiveAnimations() {
    // Floating label effect
    const inputs = document.querySelectorAll('.input-wrapper input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentNode.classList.add('focused');
        }
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.login-btn, .quick-action-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .input-wrapper.focused input {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
    `;
    document.head.appendChild(style);
}