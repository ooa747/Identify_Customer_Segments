"""
Core views for the ERP system.

This module contains the main dashboard and common views.
"""

from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Count
from apps.inventory.models import Product
from apps.sales.models import SalesOrder
from apps.purchasing.models import PurchaseOrder


class DashboardView(LoginRequiredMixin, TemplateView):
    """
    Main dashboard view with key metrics and quick access to modules.
    """
    template_name = 'core/dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Get basic statistics for dashboard
        try:
            context.update({
                'total_products': Product.objects.count(),
                'pending_sales_orders': SalesOrder.objects.filter(status='pending').count(),
                'pending_purchase_orders': PurchaseOrder.objects.filter(status='pending').count(),
                'recent_orders': SalesOrder.objects.order_by('-created_at')[:5],
            })
        except:
            # Handle case where models don't exist yet
            context.update({
                'total_products': 0,
                'pending_sales_orders': 0,
                'pending_purchase_orders': 0,
                'recent_orders': [],
            })
        
        return context


class AboutView(TemplateView):
    """
    About page view.
    """
    template_name = 'core/about.html'
