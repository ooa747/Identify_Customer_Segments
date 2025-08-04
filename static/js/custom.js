// Custom JavaScript for ERP System

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize Bootstrap popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        var alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            var bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 5000);
});

// Utility functions
const ERPUtils = {
    // Format currency
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format date
    formatDate: function(date, locale = 'en-US') {
        return new Date(date).toLocaleDateString(locale);
    },

    // Show loading spinner
    showLoading: function(element) {
        element.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
        element.disabled = true;
    },

    // Hide loading spinner
    hideLoading: function(element, originalText) {
        element.innerHTML = originalText;
        element.disabled = false;
    },

    // Show confirmation dialog
    confirm: function(message, callback) {
        if (confirm(message)) {
            callback();
        }
    },

    // AJAX helper
    ajax: function(url, options = {}) {
        const defaults = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCsrfToken()
            }
        };

        const config = Object.assign(defaults, options);

        return fetch(url, config)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
    },

    // Get CSRF token
    getCsrfToken: function() {
        const token = document.querySelector('[name=csrfmiddlewaretoken]');
        return token ? token.value : '';
    },

    // Debounce function
    debounce: function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
};

// Form validation helpers
const FormValidator = {
    // Validate email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone number
    validatePhone: function(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone);
    },

    // Validate required fields
    validateRequired: function(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(function(field) {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        return isValid;
    }
};

// Data table helpers
const DataTable = {
    // Initialize sortable tables
    initSortable: function(tableSelector) {
        const table = document.querySelector(tableSelector);
        if (!table) return;

        const headers = table.querySelectorAll('th[data-sortable]');
        headers.forEach(function(header) {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                DataTable.sortTable(table, header.cellIndex);
            });
        });
    },

    // Sort table by column
    sortTable: function(table, columnIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        const isAscending = table.getAttribute('data-sort-direction') !== 'asc';
        table.setAttribute('data-sort-direction', isAscending ? 'asc' : 'desc');

        rows.sort(function(a, b) {
            const aText = a.cells[columnIndex].textContent.trim();
            const bText = b.cells[columnIndex].textContent.trim();

            if (isAscending) {
                return aText.localeCompare(bText, undefined, { numeric: true });
            } else {
                return bText.localeCompare(aText, undefined, { numeric: true });
            }
        });

        // Re-append sorted rows
        rows.forEach(function(row) {
            tbody.appendChild(row);
        });
    }
};

// Chart helpers (for future use with Chart.js)
const ChartHelper = {
    // Default chart options
    defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true
            }
        }
    },

    // Create a simple line chart
    createLineChart: function(canvasId, data, options = {}) {
        // This would require Chart.js to be loaded
        console.log('Chart.js required for chart functionality');
    }
};

// Export for use in other scripts
window.ERPUtils = ERPUtils;
window.FormValidator = FormValidator;
window.DataTable = DataTable;
window.ChartHelper = ChartHelper;