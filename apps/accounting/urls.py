"""
URL configuration for accounting app.
"""
from django.urls import path
from . import views

app_name = 'accounting'

urlpatterns = [
    path('', views.AccountingDashboardView.as_view(), name='dashboard'),
    path('accounts/', views.AccountListView.as_view(), name='account_list'),
    path('journals/', views.JournalEntryListView.as_view(), name='journal_list'),
    path('reports/', views.FinancialReportListView.as_view(), name='report_list'),
    path('reports/balance-sheet/', views.BalanceSheetView.as_view(), name='balance_sheet'),
    path('reports/income-statement/', views.IncomeStatementView.as_view(), name='income_statement'),
]