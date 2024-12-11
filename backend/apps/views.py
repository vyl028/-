from rest_framework import viewsets, filters
from backend.apps.models import User, Activity, Article, Post
from backend.apps.serializers import UserSerializer, ActivitySerializer, ArticleSerializer, PostSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import logging

logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    @action(detail=False, methods=['GET'])
    def me(self, request):
        """获取当前登录用户信息"""
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        return Response({'error': '未登录'}, status=401)

    @action(detail=False, methods=['POST'], url_path='update-avatar')
    def update_avatar(self, request):
        """更新用户头像"""
        try:
            if 'avatar' not in request.FILES:
                return Response({'error': '没有上传文件'}, status=400)
            
            file = request.FILES['avatar']
            # 检查文件类型
            if not file.content_type.startswith('image/'):
                return Response({'error': '请上传图片文件'}, status=400)
                
            user = request.user
            # 删除旧头像
            if user.avatar and user.avatar.name != 'avatars/default-avatar.jpg':
                user.avatar.delete(save=False)
                
            user.avatar = file
            user.save()
            
            logger.info(f'User {user.username} updated avatar successfully')
            return Response({
                'message': '头像更新成功',
                'avatar_url': request.build_absolute_uri(user.avatar.url)
            })
            
        except Exception as e:
            logger.error(f'Avatar update failed: {str(e)}')
            return Response({'error': f'头像更新失败: {str(e)}'}, status=500)

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'updated_at', 'start_date']
    ordering = ['-created_at']

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at'] 