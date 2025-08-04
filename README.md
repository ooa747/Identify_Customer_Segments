# ERP System - Enterprise Resource Planning Web Application

A comprehensive, modular ERP (Enterprise Resource Planning) system built with Django 4.2+ and modern web technologies. This system provides integrated business management tools for small to medium enterprises.

## 🚀 Features

### Core Modules
- **Dashboard** - Real-time overview of business metrics
- **Inventory Management** - Product catalog, stock tracking, warehouse management
- **Sales Management** - Customer management, orders, invoices, quotations
- **Purchasing** - Supplier management, purchase orders, vendor bills
- **Accounting** - Chart of accounts, journal entries, financial reports
- **Human Resources** - Employee management, payroll, attendance
- **CRM** - Lead tracking, opportunities, customer relationships
- **Reporting** - Comprehensive business analytics and reports

### Technical Features
- **Modern Architecture** - Django 4.2+ with environment-based configuration
- **REST API** - Complete API with Swagger/OpenAPI documentation
- **Real-time Processing** - Celery task queue for background jobs
- **Caching** - Redis integration for improved performance
- **Responsive Design** - Bootstrap-based UI that works on all devices
- **Multi-environment** - Separate configurations for development, testing, and production
- **Containerized** - Docker and Docker Compose ready
- **Secure** - Role-based permissions and security best practices

## 📋 Requirements

### System Requirements
- Python 3.12+
- PostgreSQL 13+ (production)
- Redis 6+ (for caching and task queue)
- Node.js 16+ (for frontend build tools, optional)

### Python Dependencies
- Django 4.2.16
- Django REST Framework 3.14.0
- PostgreSQL adapter (psycopg2)
- Redis adapter (django-redis)
- Celery 5.3.4 (task queue)
- And many more (see requirements.txt)

## 🛠️ Installation

### Method 1: Docker Installation (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Identify_Customer_Segments
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Create superuser**
   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

### Method 2: Local Development Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Identify_Customer_Segments
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Set up database**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Collect static files**
   ```bash
   python manage.py collectstatic
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure the following:

```bash
# Basic Django settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL for production)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=erp_system_db
DB_USER=erp_user
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Redis for caching and Celery
REDIS_URL=redis://127.0.0.1:6379/1
CELERY_BROKER_URL=redis://127.0.0.1:6379/0

# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-password
```

### Settings Files

The project uses environment-based settings:

- `config/settings/base.py` - Common settings
- `config/settings/development.py` - Development environment
- `config/settings/production.py` - Production environment
- `config/settings/testing.py` - Testing environment

## 🏗️ Project Structure

```
erp_system/
├── apps/                       # Django applications
│   ├── core/                   # Core functionality and base models
│   ├── authentication/         # User management and permissions
│   ├── inventory/              # Product and stock management
│   ├── sales/                  # Sales orders, customers, invoices
│   ├── purchasing/             # Purchase orders, suppliers, bills
│   ├── accounting/             # Financial management
│   ├── hr/                     # Human resources
│   ├── crm/                    # Customer relationship management
│   ├── reporting/              # Business analytics and reports
│   └── api/                    # REST API endpoints
├── config/                     # Django project configuration
│   ├── settings/               # Environment-specific settings
│   ├── urls.py                 # Main URL configuration
│   ├── wsgi.py                 # WSGI configuration
│   └── asgi.py                 # ASGI configuration
├── templates/                  # HTML templates
│   ├── base.html               # Base template
│   └── [app_name]/             # App-specific templates
├── static/                     # Static files (CSS, JS, images)
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript files
│   └── images/                 # Image assets
├── media/                      # User-uploaded files
├── docs/                       # Documentation
├── tests/                      # Test files
├── scripts/                    # Utility scripts
├── logs/                       # Application logs
├── requirements.txt            # Python dependencies
├── manage.py                   # Django management script
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose configuration
└── README.md                   # This file
```

## 🚀 Usage

### Accessing the Application

1. **Web Interface**: http://localhost:8000
2. **Admin Interface**: http://localhost:8000/admin
3. **API Documentation**: http://localhost:8000/api/docs/
4. **API Endpoints**: http://localhost:8000/api/v1/

### Default Login
- Username: admin (or email)
- Password: (as created during superuser creation)

### Key Features

#### Dashboard
- Real-time business metrics
- Quick action buttons
- Recent activity feed
- System status monitoring

#### Inventory Management
- Product catalog with categories
- Stock level tracking
- Warehouse management
- Automatic reorder points
- Stock movement history

#### Sales Management
- Customer database
- Sales order processing
- Invoice generation
- Payment tracking
- Sales analytics

#### Purchasing
- Supplier management
- Purchase order workflow
- Goods receipt processing
- Vendor bill management

## 🧪 Testing

### Run Tests
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.inventory

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

### Test Configuration
Tests use the `config.settings.testing` configuration with:
- In-memory SQLite database
- Disabled cache
- Fast password hashing
- Synchronous Celery tasks

## 📊 API Documentation

The system includes comprehensive API documentation using Django REST Framework and drf-spectacular:

- **Swagger UI**: `/api/docs/`
- **ReDoc**: `/api/redoc/`
- **OpenAPI Schema**: `/api/schema/`

### API Endpoints

Key API endpoints include:

- `/api/v1/products/` - Product management
- `/api/v1/customers/` - Customer management
- `/api/v1/sales-orders/` - Sales order processing
- `/api/v1/purchase-orders/` - Purchase order management

## 🔐 Security

### Authentication
- Custom User model with role-based permissions
- JWT token authentication for API
- Session-based authentication for web interface

### Permissions
- Role-based access control
- Module-specific permissions
- Object-level permissions

### Security Features
- CSRF protection
- SQL injection prevention
- XSS protection
- Secure password validation
- HTTPS enforcement in production

## 🚀 Deployment

### Production Deployment

1. **Set environment variables**
   ```bash
   export DJANGO_SETTINGS_MODULE=config.settings.production
   ```

2. **Use Docker Compose**
   ```bash
   docker-compose -f docker-compose.yml --profile production up -d
   ```

3. **Or deploy manually**
   ```bash
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py collectstatic --noinput
   gunicorn config.wsgi:application
   ```

### Environment Setup
- Use PostgreSQL for production database
- Configure Redis for caching and Celery
- Set up SSL certificates
- Configure email backend
- Set up backup procedures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines
- Follow PEP 8 style guidelines
- Write comprehensive tests
- Document new features
- Use meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the documentation in the `docs/` directory
2. Review the API documentation at `/api/docs/`
3. Create an issue on GitHub
4. Check existing issues for solutions

## 🔄 Changelog

### Version 1.0.0
- Initial release with core ERP modules
- Django 4.2+ support
- REST API with OpenAPI documentation
- Docker containerization
- Comprehensive test suite

## 🎯 Roadmap

### Upcoming Features
- Mobile application
- Advanced reporting dashboard
- Integration with external services
- Multi-company support
- Advanced workflow automation
- Real-time notifications

---

**Note**: This is a comprehensive ERP system designed for educational and business purposes. Always ensure proper security measures are in place before deploying to production.