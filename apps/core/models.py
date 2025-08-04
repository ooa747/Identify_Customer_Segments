"""
Core models for the ERP system.

This module contains base models and common utilities that can be inherited
by other apps throughout the ERP system.
"""

from django.db import models
from django.utils import timezone
import uuid


class TimeStampedModel(models.Model):
    """
    Abstract base model that provides self-updating 'created_at' and 'updated_at' fields.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class UUIDModel(models.Model):
    """
    Abstract base model that provides a UUID primary key.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    class Meta:
        abstract = True


class BaseModel(TimeStampedModel, UUIDModel):
    """
    Base model that combines timestamped and UUID functionality.
    Most models in the ERP system should inherit from this.
    """
    class Meta:
        abstract = True


class SoftDeleteManager(models.Manager):
    """
    Manager that excludes soft-deleted objects from queries.
    """
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class SoftDeleteModel(BaseModel):
    """
    Abstract model that provides soft delete functionality.
    """
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    objects = SoftDeleteManager()
    all_objects = models.Manager()  # Manager that includes deleted objects
    
    def soft_delete(self):
        """Soft delete the object."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()
    
    def restore(self):
        """Restore a soft-deleted object."""
        self.is_deleted = False
        self.deleted_at = None
        self.save()
    
    class Meta:
        abstract = True


class CompanyInfo(BaseModel):
    """
    Model to store company information.
    """
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='company/', blank=True, null=True)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True)
    tax_id = models.CharField(max_length=50, unique=True)
    registration_number = models.CharField(max_length=50, unique=True)
    
    class Meta:
        verbose_name = "Company Information"
        verbose_name_plural = "Company Information"
    
    def __str__(self):
        return self.name


class Currency(BaseModel):
    """
    Model to store currency information.
    """
    code = models.CharField(max_length=3, unique=True)  # USD, EUR, etc.
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=5)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = "Currencies"
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Address(BaseModel):
    """
    Reusable address model.
    """
    TYPE_CHOICES = [
        ('billing', 'Billing'),
        ('shipping', 'Shipping'),
        ('office', 'Office'),
        ('warehouse', 'Warehouse'),
    ]
    
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.street_address}, {self.city}, {self.state} {self.postal_code}"


class Note(BaseModel):
    """
    Generic note model that can be attached to any object.
    """
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='notes'
    )
    is_private = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
