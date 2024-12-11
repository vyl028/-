from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

def api_root(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'API is running'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.apps.urls')),
    path('', api_root),  # 添加根路径处理
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)