from django.apps import AppConfig

class AppsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.apps'

    def ready(self):
        # 在应用加载时执行的逻辑
        print("AppsConfig is ready!")
