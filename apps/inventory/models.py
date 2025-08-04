"""
Inventory management models for the ERP system.

This module contains models for products, categories, stock management,
and inventory transactions.
"""

from django.db import models
from django.contrib.auth import get_user_model
from apps.core.models import BaseModel, SoftDeleteModel

User = get_user_model()


class Category(BaseModel):
    """
    Product category model.
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name


class Unit(BaseModel):
    """
    Unit of measurement for products.
    """
    name = models.CharField(max_length=50, unique=True)
    symbol = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.symbol})"


class Supplier(BaseModel):
    """
    Supplier/Vendor model.
    """
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    contact_person = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    tax_number = models.CharField(max_length=50, blank=True)
    payment_terms = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class Product(SoftDeleteModel):
    """
    Product model for inventory items.
    """
    PRODUCT_TYPE_CHOICES = [
        ('product', 'Product'),
        ('service', 'Service'),
        ('consumable', 'Consumable'),
    ]
    
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)
    barcode = models.CharField(max_length=100, blank=True, unique=True)
    description = models.TextField(blank=True)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES, default='product')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    minimum_stock = models.PositiveIntegerField(default=0)
    maximum_stock = models.PositiveIntegerField(default=0)
    current_stock = models.PositiveIntegerField(default=0)
    reorder_point = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    @property
    def is_low_stock(self):
        return self.current_stock <= self.reorder_point
    
    @property
    def stock_value(self):
        return self.current_stock * self.cost_price


class Warehouse(BaseModel):
    """
    Warehouse/Location model.
    """
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    address = models.TextField()
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class StockMovement(BaseModel):
    """
    Track all stock movements/transactions.
    """
    MOVEMENT_TYPE_CHOICES = [
        ('in', 'Stock In'),
        ('out', 'Stock Out'),
        ('transfer', 'Transfer'),
        ('adjustment', 'Adjustment'),
    ]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPE_CHOICES)
    quantity = models.IntegerField()
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    reference_type = models.CharField(max_length=50, blank=True)  # sales_order, purchase_order, etc.
    reference_id = models.UUIDField(blank=True, null=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.product.name} - {self.movement_type} - {self.quantity}"


class StockAdjustment(BaseModel):
    """
    Stock adjustment records for inventory corrections.
    """
    REASON_CHOICES = [
        ('damage', 'Damaged'),
        ('loss', 'Lost'),
        ('found', 'Found'),
        ('correction', 'Correction'),
        ('return', 'Return'),
    ]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    old_quantity = models.IntegerField()
    new_quantity = models.IntegerField()
    adjustment_quantity = models.IntegerField()
    reason = models.CharField(max_length=20, choices=REASON_CHOICES)
    notes = models.TextField(blank=True)
    approved_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='approved_adjustments')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_adjustments')
    
    def __str__(self):
        return f"{self.product.name} - Adjustment: {self.adjustment_quantity}"
