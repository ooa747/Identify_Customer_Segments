"""
URL configuration for sales app.
"""
from django.urls import path
from . import views

app_name = 'sales'

urlpatterns = [
    path('', views.SalesDashboardView.as_view(), name='dashboard'),
    path('customers/', views.CustomerListView.as_view(), name='customer_list'),
    path('customers/create/', views.CustomerCreateView.as_view(), name='customer_create'),
    path('customers/<uuid:pk>/', views.CustomerDetailView.as_view(), name='customer_detail'),
    path('orders/', views.SalesOrderListView.as_view(), name='order_list'),
    path('orders/create/', views.SalesOrderCreateView.as_view(), name='order_create'),
    path('orders/<uuid:pk>/', views.SalesOrderDetailView.as_view(), name='order_detail'),
    path('invoices/', views.InvoiceListView.as_view(), name='invoice_list'),
    path('invoices/create/', views.InvoiceCreateView.as_view(), name='invoice_create'),
    path('invoices/<uuid:pk>/', views.InvoiceDetailView.as_view(), name='invoice_detail'),
    path('quotations/', views.QuotationListView.as_view(), name='quotation_list'),
    path('payments/', views.PaymentListView.as_view(), name='payment_list'),
]