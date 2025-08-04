"""
URL configuration for reporting app.
"""
from django.urls import path
from . import views

app_name = 'reporting'

urlpatterns = [
    path('', views.ReportingDashboardView.as_view(), name='dashboard'),
    path('sales/', views.SalesReportView.as_view(), name='sales_report'),
    path('inventory/', views.InventoryReportView.as_view(), name='inventory_report'),
    path('financial/', views.FinancialReportView.as_view(), name='financial_report'),
    path('custom/', views.CustomReportView.as_view(), name='custom_report'),
]