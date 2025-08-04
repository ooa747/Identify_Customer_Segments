"""
URL configuration for ERP System project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/', include('apps.api.urls')),
    # path('auth/', include('apps.authentication.urls')),
    # path('inventory/', include('apps.inventory.urls')),
    # path('sales/', include('apps.sales.urls')),
    # path('purchasing/', include('apps.purchasing.urls')),
    # path('accounting/', include('apps.accounting.urls')),
    # path('hr/', include('apps.hr.urls')),
    # path('crm/', include('apps.crm.urls')),
    # path('reporting/', include('apps.reporting.urls')),
    path('', include('apps.core.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Add debug toolbar URLs
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
