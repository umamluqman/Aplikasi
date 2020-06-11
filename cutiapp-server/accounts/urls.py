from django.urls import path, include
from rest_framework import routers
from accounts.api import userListApi, loginApi, userApi, userDetailApi, userBulkDelete, streaming_users_csv_view, updatePassword
from knox import views as knox_views

app_name = 'users'

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path(
        'api/users/',
        userListApi,
        name='users-list'
    ),
    path(
        'api/auth/login',
        loginApi,
        name='login'
    ),
    path(
        'api/users/<str:pk>',
        userDetailApi,
        name='users-detail'
    ),
    path(
        'api/auth/user',
        userApi,
        name='get-user'
    ),
    path(
        'api/bulk-delete-user',
        userBulkDelete,
        name='bulk-delete-user'
    ),
    path(
        'api/auth/logout',
        knox_views.LogoutView.as_view(),
        name='knox_logout'
    ),
    path(
        'api/users-csv',
        streaming_users_csv_view,
        name='get-users-csv'
    ),
    path(
        'api/update-password',
        updatePassword,
        name='update-password'
    )
]
