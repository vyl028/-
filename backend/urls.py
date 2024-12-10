from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('backend.apps.urls')),  # 修改这里，使用完整路径
] 