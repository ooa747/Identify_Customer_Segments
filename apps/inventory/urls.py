"""
URL configuration for inventory app.
"""
from django.urls import path
from . import views

app_name = 'inventory'

urlpatterns = [
    path('', views.InventoryDashboardView.as_view(), name='dashboard'),
    path('products/', views.ProductListView.as_view(), name='product_list'),
    path('products/create/', views.ProductCreateView.as_view(), name='product_create'),
    path('products/<uuid:pk>/', views.ProductDetailView.as_view(), name='product_detail'),
    path('products/<uuid:pk>/edit/', views.ProductUpdateView.as_view(), name='product_update'),
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('suppliers/', views.SupplierListView.as_view(), name='supplier_list'),
    path('warehouses/', views.WarehouseListView.as_view(), name='warehouse_list'),
    path('movements/', views.StockMovementListView.as_view(), name='movement_list'),
    path('adjustments/', views.StockAdjustmentListView.as_view(), name='adjustment_list'),
]