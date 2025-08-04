"""
Purchasing management models for the ERP system.

This module contains models for suppliers, purchase orders, vendor bills,
and purchasing-related transactions.
"""

from django.db import models
from django.contrib.auth import get_user_model
from apps.core.models import BaseModel, SoftDeleteModel
from apps.inventory.models import Product, Supplier

User = get_user_model()


class PurchaseOrder(BaseModel):
    """
    Purchase order model.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
        ('pending', 'Pending'),
        ('received', 'Received'),
        ('cancelled', 'Cancelled'),
    ]
    
    order_number = models.CharField(max_length=50, unique=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    order_date = models.DateField()
    expected_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    purchasing_agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"PO-{self.order_number} - {self.supplier.name}"


class PurchaseOrderItem(BaseModel):
    """
    Purchase order line items.
    """
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=10, decimal_places=2)
    received_quantity = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"{self.purchase_order.order_number} - {self.product.name}"


class VendorBill(BaseModel):
    """
    Vendor bill/invoice model.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('posted', 'Posted'),
        ('paid', 'Paid'),
        ('partial', 'Partially Paid'),
        ('cancelled', 'Cancelled'),
    ]
    
    bill_number = models.CharField(max_length=50, unique=True)
    vendor_reference = models.CharField(max_length=50, blank=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, blank=True, null=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    bill_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_due = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"BILL-{self.bill_number} - {self.supplier.name}"


class PurchaseReceipt(BaseModel):
    """
    Purchase receipt/goods received note model.
    """
    receipt_number = models.CharField(max_length=50, unique=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    receipt_date = models.DateField()
    received_by = models.ForeignKey(User, on_delete=models.CASCADE)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"GRN-{self.receipt_number} - {self.purchase_order.order_number}"


class PurchaseReceiptItem(BaseModel):
    """
    Purchase receipt line items.
    """
    purchase_receipt = models.ForeignKey(PurchaseReceipt, on_delete=models.CASCADE, related_name='items')
    purchase_order_item = models.ForeignKey(PurchaseOrderItem, on_delete=models.CASCADE)
    received_quantity = models.PositiveIntegerField()
    rejected_quantity = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.purchase_receipt.receipt_number} - {self.purchase_order_item.product.name}"


class VendorPayment(BaseModel):
    """
    Payment model for vendor bills.
    """
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
        ('credit_card', 'Credit Card'),
        ('check', 'Check'),
    ]
    
    payment_number = models.CharField(max_length=50, unique=True)
    vendor_bill = models.ForeignKey(VendorBill, on_delete=models.CASCADE, related_name='payments')
    payment_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    reference_number = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Payment {self.payment_number} - {self.amount}"


class PurchaseRequisition(BaseModel):
    """
    Purchase requisition model for internal requests.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('ordered', 'Ordered'),
    ]
    
    requisition_number = models.CharField(max_length=50, unique=True)
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requisitions')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_requisitions')
    request_date = models.DateField()
    required_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    justification = models.TextField()
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"REQ-{self.requisition_number} - {self.requested_by.get_full_name()}"
