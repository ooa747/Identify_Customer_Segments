"""
URL configuration for HR app.
"""
from django.urls import path
from . import views

app_name = 'hr'

urlpatterns = [
    path('', views.HRDashboardView.as_view(), name='dashboard'),
    path('employees/', views.EmployeeListView.as_view(), name='employee_list'),
    path('employees/create/', views.EmployeeCreateView.as_view(), name='employee_create'),
    path('employees/<uuid:pk>/', views.EmployeeDetailView.as_view(), name='employee_detail'),
    path('departments/', views.DepartmentListView.as_view(), name='department_list'),
    path('payroll/', views.PayrollListView.as_view(), name='payroll_list'),
    path('attendance/', views.AttendanceListView.as_view(), name='attendance_list'),
]