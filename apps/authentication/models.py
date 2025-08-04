"""
Authentication models for the ERP system.

This module contains user models and role-based access control.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.core.models import BaseModel, Address


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    """
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
        ('accountant', 'Accountant'),
        ('sales_rep', 'Sales Representative'),
        ('purchasing_agent', 'Purchasing Agent'),
        ('warehouse_staff', 'Warehouse Staff'),
        ('hr_staff', 'HR Staff'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    phone = models.CharField(max_length=20, blank=True)
    employee_id = models.CharField(max_length=20, unique=True, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    def get_full_name(self):
        """Return the first_name plus the last_name, with a space in between."""
        full_name = f"{self.first_name} {self.last_name}"
        return full_name.strip()
    
    @property
    def is_admin(self):
        return self.role == 'admin' or self.is_superuser
    
    @property
    def is_manager(self):
        return self.role in ['admin', 'manager'] or self.is_superuser


class UserProfile(BaseModel):
    """
    Extended user profile information.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    hire_date = models.DateField(blank=True, null=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    manager = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        blank=True, 
        null=True, 
        related_name='subordinates'
    )
    
    def __str__(self):
        return f"Profile for {self.user.get_full_name()}"


class Permission(BaseModel):
    """
    Custom permissions for ERP modules.
    """
    name = models.CharField(max_length=100, unique=True)
    codename = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    module = models.CharField(max_length=50)  # inventory, sales, etc.
    
    def __str__(self):
        return self.name


class Role(BaseModel):
    """
    Custom roles with specific permissions.
    """
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    permissions = models.ManyToManyField(Permission, blank=True)
    users = models.ManyToManyField(User, blank=True, related_name='custom_roles')
    
    def __str__(self):
        return self.name


class UserSession(BaseModel):
    """
    Track user sessions for security and auditing.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Session for {self.user.email} at {self.login_time}"
