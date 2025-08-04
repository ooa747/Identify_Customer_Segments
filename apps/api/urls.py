"""
URL configuration for API app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from . import views

# API Router
router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'customers', views.CustomerViewSet)
router.register(r'sales-orders', views.SalesOrderViewSet)
router.register(r'purchase-orders', views.PurchaseOrderViewSet)

app_name = 'api'

urlpatterns = [
    # API Documentation
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='api:schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='api:schema'), name='redoc'),
    
    # API v1
    path('v1/', include(router.urls)),
    path('v1/auth/', include('rest_framework.urls')),
]