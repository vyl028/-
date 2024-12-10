from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'API is running'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.apps.urls')),
    path('', api_root),
] 