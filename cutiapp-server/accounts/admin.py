from django.contrib import admin
import django.contrib.auth.models
from django.contrib import auth
from accounts.models import CustomUser

admin.site.unregister(auth.models.Group)
admin.site.register(CustomUser)
# Register your models here.
