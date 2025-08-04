"""
URL configuration for CRM app.
"""
from django.urls import path
from . import views

app_name = 'crm'

urlpatterns = [
    path('', views.CRMDashboardView.as_view(), name='dashboard'),
    path('leads/', views.LeadListView.as_view(), name='lead_list'),
    path('leads/create/', views.LeadCreateView.as_view(), name='lead_create'),
    path('leads/<uuid:pk>/', views.LeadDetailView.as_view(), name='lead_detail'),
    path('opportunities/', views.OpportunityListView.as_view(), name='opportunity_list'),
    path('contacts/', views.ContactListView.as_view(), name='contact_list'),
    path('activities/', views.ActivityListView.as_view(), name='activity_list'),
]