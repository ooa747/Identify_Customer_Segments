// Dashboard Module
class DashboardManager {
    constructor() {
        this.currentPage = 'dashboard';
        this.sidebarCollapsed = false;
        this.isMobile = window.innerWidth <= 1024;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUserInfo();
        this.initializeResponsiveHandlers();
        this.startRealTimeUpdates();
        
        // Check authentication
        if (!this.isAuthenticated()) {
            window.location.href = 'index.html';
        }
    }

    bindEvents() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileSidebar());
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Quick action buttons
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e));
        });

        // User menu toggle
        const userMenuToggle = document.querySelector('.user-menu-toggle');
        if (userMenuToggle) {
            userMenuToggle.addEventListener('click', () => this.toggleUserMenu());
        }

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        // Notifications
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }

        // Close mobile sidebar when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            
            if (this.isMobile && 
                !sidebar.contains(e.target) && 
                !mobileToggle.contains(e.target) &&
                sidebar.classList.contains('mobile-open')) {
                this.closeMobileSidebar();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    isAuthenticated() {
        const authData = localStorage.getItem('erp_auth');
        const sessionData = sessionStorage.getItem('erp_session');
        return authData && sessionData;
    }

    updateUserInfo() {
        const authData = localStorage.getItem('erp_auth');
        if (authData) {
            const userData = JSON.parse(authData);
            const usernameElement = document.getElementById('currentUser');
            if (usernameElement) {
                usernameElement.textContent = this.capitalizeFirst(userData.username);
            }
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        this.sidebarCollapsed = !this.sidebarCollapsed;
        
        if (this.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }

        // Store preference
        localStorage.setItem('erp_sidebar_collapsed', this.sidebarCollapsed);
    }

    toggleMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('mobile-open');
    }

    closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('mobile-open');
    }

    handleNavigation(event) {
        event.preventDefault();
        
        const link = event.currentTarget;
        const page = link.getAttribute('data-page');
        
        if (page && page !== this.currentPage) {
            this.switchPage(page);
            this.updateActiveNavigation(link);
            
            // Close mobile sidebar after navigation
            if (this.isMobile) {
                this.closeMobileSidebar();
            }
        }
    }

    switchPage(page) {
        // Hide all page contents
        const pageContents = document.querySelectorAll('.page-content');
        pageContents.forEach(content => {
            content.classList.remove('active');
        });

        // Show selected page content
        const targetContent = document.getElementById(`${page}-content`);
        if (targetContent) {
            targetContent.classList.add('active');
            this.currentPage = page;
            
            // Update page title
            this.updatePageTitle(page);
            
            // Load page-specific data
            this.loadPageData(page);
        }
    }

    updateActiveNavigation(activeLink) {
        // Remove active class from all nav items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current nav item
        activeLink.parentElement.classList.add('active');
    }

    updatePageTitle(page) {
        const pageTitle = document.getElementById('pageTitle');
        const titles = {
            dashboard: 'Dashboard',
            sales: 'Sales Management',
            inventory: 'Inventory Management',
            customers: 'Customer Management',
            finance: 'Financial Management',
            reports: 'Reports & Analytics',
            settings: 'System Settings'
        };

        if (pageTitle && titles[page]) {
            pageTitle.textContent = titles[page];
        }
    }

    loadPageData(page) {
        // Simulate loading page-specific data
        switch (page) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'sales':
                this.loadSalesData();
                break;
            case 'inventory':
                this.loadInventoryData();
                break;
            case 'customers':
                this.loadCustomersData();
                break;
            case 'finance':
                this.loadFinanceData();
                break;
            case 'reports':
                this.loadReportsData();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
        }
    }

    loadDashboardData() {
        // Simulate real-time dashboard updates
        this.updateStatCards();
        this.updateRecentOrders();
    }

    updateStatCards() {
        // Simulate dynamic stat updates
        const stats = [
            { element: '.stat-card:nth-child(1) h3', value: '$' + (125430 + Math.floor(Math.random() * 1000)).toLocaleString() },
            { element: '.stat-card:nth-child(2) h3', value: (1429 + Math.floor(Math.random() * 50)).toLocaleString() },
            { element: '.stat-card:nth-child(3) h3', value: (2156 + Math.floor(Math.random() * 20)).toLocaleString() },
            { element: '.stat-card:nth-child(4) h3', value: (876 + Math.floor(Math.random() * 10)).toLocaleString() }
        ];

        stats.forEach(stat => {
            const element = document.querySelector(stat.element);
            if (element) {
                this.animateNumber(element, stat.value);
            }
        });
    }

    animateNumber(element, newValue) {
        const currentValue = element.textContent;
        element.style.color = 'var(--primary-color)';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.color = '';
        }, 300);
    }

    updateRecentOrders() {
        // Add some randomness to order statuses
        const orderItems = document.querySelectorAll('.order-item');
        orderItems.forEach((item, index) => {
            if (Math.random() > 0.8) { // 20% chance to update
                const statusElement = item.querySelector('.status');
                const statuses = ['pending', 'completed', 'shipped'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                
                statusElement.className = `status ${randomStatus}`;
                statusElement.textContent = randomStatus.charAt(0).toUpperCase() + randomStatus.slice(1);
            }
        });
    }

    loadSalesData() {
        this.showPagePlaceholder('sales', 'Sales analytics and management tools will be displayed here.');
    }

    loadInventoryData() {
        this.showPagePlaceholder('inventory', 'Inventory tracking and management features will be shown here.');
    }

    loadCustomersData() {
        this.showPagePlaceholder('customers', 'Customer database and relationship management tools will be available here.');
    }

    loadFinanceData() {
        this.showPagePlaceholder('finance', 'Financial reports, invoicing, and accounting features will be implemented here.');
    }

    loadReportsData() {
        this.showPagePlaceholder('reports', 'Comprehensive business reports and analytics dashboards will be displayed here.');
    }

    loadSettingsData() {
        this.showPagePlaceholder('settings', 'System configuration, user management, and application settings will be available here.');
    }

    showPagePlaceholder(page, message) {
        const pageContent = document.getElementById(`${page}-content`);
        if (pageContent && pageContent.children.length <= 2) {
            const placeholder = document.createElement('div');
            placeholder.className = 'page-placeholder';
            placeholder.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 60px 20px;
                    background: var(--white);
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    margin-top: 20px;
                ">
                    <i class="fas fa-cogs" style="
                        font-size: 48px;
                        color: var(--gray-400);
                        margin-bottom: 20px;
                    "></i>
                    <p style="
                        color: var(--gray-500);
                        font-size: 16px;
                        max-width: 500px;
                        margin: 0 auto;
                    ">${message}</p>
                    <button class="quick-action-btn" style="
                        margin-top: 20px;
                        padding: 12px 24px;
                    " onclick="alert('Feature coming soon!')">
                        <i class="fas fa-plus"></i>
                        <span>Coming Soon</span>
                    </button>
                </div>
            `;
            pageContent.appendChild(placeholder);
        }
    }

    handleQuickAction(event) {
        const button = event.currentTarget;
        const action = button.querySelector('span').textContent;
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);

        // Show action notification
        this.showNotification(`${action} feature will be available soon!`, 'info');
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear authentication data
            localStorage.removeItem('erp_auth');
            sessionStorage.removeItem('erp_session');
            
            // Show logout animation
            this.showNotification('Logging out...', 'info');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    toggleUserMenu() {
        // Simple user menu toggle (placeholder)
        this.showNotification('User menu functionality coming soon!', 'info');
    }

    handleSearch(event) {
        const query = event.target.value;
        
        if (query.length > 2) {
            // Simulate search functionality
            console.log('Searching for:', query);
            // In a real application, this would trigger a search API call
        }
    }

    showNotifications() {
        // Simulate notification panel
        this.showNotification('You have 3 new notifications', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            background: ${type === 'info' ? 'var(--primary-color)' : 'var(--success-color)'};
            color: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    initializeResponsiveHandlers() {
        // Load saved sidebar state
        const savedState = localStorage.getItem('erp_sidebar_collapsed');
        if (savedState === 'true' && !this.isMobile) {
            this.sidebarCollapsed = true;
            document.getElementById('sidebar').classList.add('collapsed');
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 1024;
        
        if (wasMobile !== this.isMobile) {
            const sidebar = document.getElementById('sidebar');
            
            if (this.isMobile) {
                // Switch to mobile mode
                sidebar.classList.remove('collapsed');
                sidebar.classList.remove('mobile-open');
            } else {
                // Switch to desktop mode
                sidebar.classList.remove('mobile-open');
                if (this.sidebarCollapsed) {
                    sidebar.classList.add('collapsed');
                }
            }
        }
    }

    startRealTimeUpdates() {
        // Update dashboard data every 30 seconds
        setInterval(() => {
            if (this.currentPage === 'dashboard') {
                this.updateStatCards();
            }
        }, 30000);

        // Update notifications count randomly
        setInterval(() => {
            const notificationCount = document.querySelector('.notification-count');
            if (notificationCount && Math.random() > 0.8) {
                const count = Math.floor(Math.random() * 9) + 1;
                notificationCount.textContent = count;
            }
        }, 60000);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Chart and Analytics Module (placeholder for future implementation)
class AnalyticsManager {
    constructor() {
        this.charts = {};
    }

    createChart(elementId, type, data) {
        // Placeholder for chart creation
        // In a real application, this would use a charting library like Chart.js or D3.js
        console.log(`Creating ${type} chart in ${elementId} with data:`, data);
    }

    updateChart(chartId, newData) {
        // Placeholder for chart updates
        console.log(`Updating chart ${chartId} with new data:`, newData);
    }
}

// Data Manager for API interactions (placeholder)
class DataManager {
    constructor() {
        this.baseURL = '/api'; // Configure your API base URL
    }

    async fetchData(endpoint) {
        try {
            // In a real application, this would make actual API calls
            console.log(`Fetching data from ${endpoint}`);
            
            // Simulate API response
            return this.getMockData(endpoint);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            throw error;
        }
    }

    getMockData(endpoint) {
        // Mock data for different endpoints
        const mockData = {
            '/dashboard/stats': {
                revenue: 125430,
                orders: 1429,
                customers: 2156,
                products: 876
            },
            '/dashboard/orders': [
                { id: 'ORD-001', customer: 'John Doe', status: 'pending', amount: 125.00 },
                { id: 'ORD-002', customer: 'Jane Smith', status: 'completed', amount: 89.50 },
                { id: 'ORD-003', customer: 'Mike Johnson', status: 'shipped', amount: 234.75 }
            ]
        };

        return Promise.resolve(mockData[endpoint] || {});
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard manager
    window.dashboardManager = new DashboardManager();
    window.analyticsManager = new AnalyticsManager();
    window.dataManager = new DataManager();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt + S for sidebar toggle
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            window.dashboardManager.toggleSidebar();
        }
        
        // Alt + L for logout
        if (e.altKey && e.key === 'l') {
            e.preventDefault();
            window.dashboardManager.handleLogout();
        }
        
        // Escape to close mobile sidebar
        if (e.key === 'Escape') {
            window.dashboardManager.closeMobileSidebar();
        }
    });

    console.log('ERP Dashboard initialized successfully!');
});