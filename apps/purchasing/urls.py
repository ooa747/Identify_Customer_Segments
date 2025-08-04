"""
URL configuration for purchasing app.
"""
from django.urls import path
from . import views

app_name = 'purchasing'

urlpatterns = [
    path('', views.PurchasingDashboardView.as_view(), name='dashboard'),
    path('orders/', views.PurchaseOrderListView.as_view(), name='order_list'),
    path('orders/create/', views.PurchaseOrderCreateView.as_view(), name='order_create'),
    path('orders/<uuid:pk>/', views.PurchaseOrderDetailView.as_view(), name='order_detail'),
    path('bills/', views.VendorBillListView.as_view(), name='bill_list'),
    path('bills/create/', views.VendorBillCreateView.as_view(), name='bill_create'),
    path('requisitions/', views.PurchaseRequisitionListView.as_view(), name='requisition_list'),
    path('receipts/', views.PurchaseReceiptListView.as_view(), name='receipt_list'),
]