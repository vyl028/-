from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from django.utils import timezone
from .models import *
from .serializers import *

# 搜索相关视图
@api_view(['GET'])
def search_view(request):
    keyword = request.GET.get('keyword', '')
    page = int(request.GET.get('page', 1))
    size = int(request.GET.get('size', 10))
    
    contents = Content.objects.filter(
        Q(title__icontains=keyword) | 
        Q(content__icontains=keyword)
    )
    
    paginator = PageNumberPagination()
    paginator.page_size = size
    result_page = paginator.paginate_queryset(contents, request)
    serializer = ContentListSerializer(result_page, many=True)
    
    return paginator.get_paginated_response(serializer.data)

# 发现页面视图
@api_view(['GET'])
def discover_list_view(request):
    page = int(request.GET.get('page', 1))
    size = int(request.GET.get('size', 10))
    
    contents = Content.objects.all().order_by('-created_at')
    paginator = PageNumberPagination()
    paginator.page_size = size
    result_page = paginator.paginate_queryset(contents, request)
    serializer = ContentListSerializer(result_page, many=True)
    
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def content_detail_view(request, id):
    content = get_object_or_404(Content, id=id)
    serializer = ContentSerializer(content)
    return Response(serializer.data)

# 话题相关视图
@api_view(['GET'])
def hot_topics_view(request):
    topics = Topic.objects.all().order_by('-heat')[:10]
    serializer = TopicSerializer(topics, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def all_topics_view(request):
    topics = Topic.objects.all().order_by('-heat')
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(topics, request)
    serializer = TopicSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def topics_list_view(request):
    keyword = request.GET.get('keyword', '')
    topics = Topic.objects.filter(name__icontains=keyword)
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(topics, request)
    serializer = TopicSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

# 活动相关视图
@api_view(['GET'])
def hot_activities_view(request):
    activities = Activity.objects.filter(
        status='ongoing'
    ).order_by('-start_time')
    serializer = ActivitySerializer(activities, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def all_activities_view(request):
    activities = Activity.objects.all().order_by('-start_time')
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(activities, request)
    serializer = ActivitySerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def activities_list_view(request):
    status_filter = request.GET.get('status', 'all')
    if status_filter != 'all':
        activities = Activity.objects.filter(status=status_filter)
    else:
        activities = Activity.objects.all()
    
    activities = activities.order_by('-start_time')
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(activities, request)
    serializer = ActivitySerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def activity_detail_view(request, id):
    activity = get_object_or_404(Activity, id=id)
    serializer = ActivityDetailSerializer(activity, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def activity_related_articles_view(request):
    """获取活动相关文章"""
    activity_id = request.GET.get('activityId')
    
    try:
        activity = Activity.objects.get(id=activity_id)
        # 假设Content模型有activity字段关联到Activity
        articles = Content.objects.filter(
            activity=activity,
            type='article'
        ).order_by('-created_at')
        
        paginator = PageNumberPagination()
        result_page = paginator.paginate_queryset(articles, request)
        serializer = ContentSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    except Activity.DoesNotExist:
        return Response(
            {'error': 'Activity not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

# 消息相关视图
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def message_list_view(request):
    """获取消息列表"""
    if not request.user.is_authenticated:
        return Response([], status=status.HTTP_200_OK)
        
    message_type = request.GET.get('type', 'all')
    
    messages = Message.objects.filter(receiver=request.user)
    if message_type != 'all':
        messages = messages.filter(type=message_type)
        
    messages = messages.order_by('-created_at')
    
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(messages, request)
    serializer = MessageSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def message_read_view(request):
    """标记消息为已读"""
    message_id = request.data.get('messageId')
    
    try:
        message = Message.objects.get(
            id=message_id,
            receiver=request.user
        )
        message.is_read = True
        message.save()
        return Response({'success': True})
    except Message.DoesNotExist:
        return Response(
            {'error': 'Message not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def message_read_all_view(request):
    """标记所有消息为已读"""
    Message.objects.filter(
        receiver=request.user,
        is_read=False
    ).update(is_read=True)
    
    return Response({'success': True})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def message_unread_count_view(request):
    """获取未读消息数量"""
    counts = {
        'total': Message.objects.filter(receiver=request.user, is_read=False).count(),
        'reply': Message.objects.filter(receiver=request.user, is_read=False, type='reply').count(),
        'like': Message.objects.filter(receiver=request.user, is_read=False, type='like').count(),
        'mention': Message.objects.filter(receiver=request.user, is_read=False, type='mention').count(),
        'favorite': Message.objects.filter(receiver=request.user, is_read=False, type='favorite').count(),
        'system': Message.objects.filter(receiver=request.user, is_read=False, type='system').count()
    }
    
    return Response(counts)

# 关注相关视图
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def follow_list_view(request):
    follow_type = request.GET.get('type', 'all')
    following_users = User.objects.filter(
        followers__follower=request.user
    )
    
    # 这里需要根据follow_type进行筛选的逻辑
    
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(following_users, request)
    serializer = UserSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_action_view(request):
    target_id = request.data.get('targetId')
    action = request.data.get('action')
    
    target_user = get_object_or_404(User, id=target_id)
    
    if action == 'follow':
        Follow.objects.get_or_create(
            follower=request.user,
            following=target_user
        )
    elif action == 'unfollow':
        Follow.objects.filter(
            follower=request.user,
            following=target_user
        ).delete()
    
    return Response({'success': True})

# 个人中心相关视图
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """获取用户资料"""
    user_id = request.GET.get('userId')
    
    try:
        profile = Profile.objects.get(user_id=user_id)
        serializer = ProfileDetailSerializer(profile, context={'request': request})
        return Response(serializer.data)
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Profile not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def profile_activities_preview_view(request):
    """获取用户活动预览"""
    user_id = request.GET.get('userId')
    limit = int(request.GET.get('limit', 5))
    
    activities = Activity.objects.filter(
        # 假设Activity模型有creator字段
        creator_id=user_id
    ).order_by('-start_time')[:limit]
    
    serializer = ActivitySerializer(activities, many=True)
    return Response(serializer.data)

# 文章相关视图
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def article_publish_view(request):
    data = request.data.copy()
    data['author'] = request.user.id
    data['type'] = 'article'
    
    serializer = ContentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def article_detail_view(request, id):
    article = get_object_or_404(Content, id=id, type='article')
    serializer = ContentSerializer(article)
    return Response(serializer.data)

# 评论相关视图
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def comment_add_view(request):
    data = request.data.copy()
    data['author'] = request.user.id
    
    serializer = CommentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def comment_list_view(request):
    content_id = request.GET.get('contentId')
    comments = Comment.objects.filter(
        content_id=content_id,
        reply_to=None
    ).order_by('-created_at')
    
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(comments, request)
    serializer = CommentSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

# 文件上传视图
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image_view(request):
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    image = request.FILES['file']
    # 这里需要实现具体的图片保存逻辑
    
    return Response({
        'url': f'/media/images/{image.name}',
        'width': 800,  # 示例值
        'height': 600  # 示例值
    })

# 认证相关视图
@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        # 这里需要实现具体的登录逻辑
        
        return Response({
            'token': 'jwt_token',
            'refreshToken': 'refresh_token',
            'expiresIn': 7200,
            'userInfo': {
                'id': 1,
                'nickname': 'test_user',
                'avatar': 'avatar_url'
            }
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        # 这里需要实现具体的注册逻辑
        return Response({
            'success': True,
            'message': '注册成功'
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    # 这里需要实现具体的登出逻辑
    return Response({'message': '退出成功'})

@api_view(['GET'])
def content_list_view(request):
    """获取内容列表"""
    content_type = request.GET.get('type', None)
    page = int(request.GET.get('page', 1))
    size = int(request.GET.get('size', 10))
    
    contents = Content.objects.all()
    if content_type:
        contents = contents.filter(type=content_type)
    
    contents = contents.order_by('-created_at')
    
    paginator = PageNumberPagination()
    paginator.page_size = size
    result_page = paginator.paginate_queryset(contents, request)
    serializer = ContentListSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def content_publish_view(request):
    """发布内容"""
    data = request.data.copy()
    data['author'] = request.user.id
    
    serializer = ContentSerializer(data=data)
    if serializer.is_valid():
        content = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def refresh_token_view(request):
    refresh_token = request.data.get('refresh_token')
    if not refresh_token:
        return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # 实现刷新token的逻辑
        return Response({
            'access_token': 'new_access_token',
            'refresh_token': 'new_refresh_token'
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def follow_content_list_view(request):
    """获取关注用户的内容列表"""
    following_users = request.user.following.all().values_list('following', flat=True)
    contents = Content.objects.filter(author_id__in=following_users)
    
    content_type = request.GET.get('type', None)
    if content_type:
        contents = contents.filter(type=content_type)
    
    contents = contents.order_by('-created_at')
    
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(contents, request)
    serializer = ContentSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def profile_articles_preview_view(request):
    """获取用户文章预览"""
    user_id = request.GET.get('userId')
    limit = int(request.GET.get('limit', 5))
    
    articles = Content.objects.filter(
        author_id=user_id,
        type='article'
    ).order_by('-created_at')[:limit]
    
    serializer = ContentSerializer(articles, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def collection_preview_view(request):
    """获取收藏预览"""
    limit = int(request.GET.get('limit', 5))
    collections = Content.objects.filter(
        favorites__user=request.user
    ).order_by('-favorites__created_at')[:limit]
    
    serializer = ContentSerializer(collections, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def fans_followers_view(request):
    """获取粉丝/关注列表"""
    user_id = request.GET.get('userId')
    type = request.GET.get('type', 'followers')  # followers或following
    
    if type == 'followers':
        users = User.objects.filter(following__following_id=user_id)
    else:
        users = User.objects.filter(followers__follower_id=user_id)
    
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(users, request)
    serializer = UserSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def fans_action_view(request):
    """粉丝操作（关注/取消关注）"""
    target_id = request.data.get('targetId')
    action = request.data.get('action')  # follow或unfollow
    
    try:
        target_user = User.objects.get(id=target_id)
        
        if action == 'follow':
            Follow.objects.get_or_create(
                follower=request.user,
                following=target_user
            )
        elif action == 'unfollow':
            Follow.objects.filter(
                follower=request.user,
                following=target_user
            ).delete()
            
        return Response({'success': True})
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def article_action_view(request):
    """文章操作（点赞、收藏等）"""
    article_id = request.data.get('articleId')
    action_type = request.data.get('type')  # like, favorite, share
    
    try:
        article = Content.objects.get(id=article_id)
        
        if action_type == 'like':
            # 实现点赞逻辑
            pass
        elif action_type == 'favorite':
            # 实现收藏逻辑
            pass
        elif action_type == 'share':
            # 实现分享逻辑
            pass
            
        return Response({'success': True})
    except Content.DoesNotExist:
        return Response(
            {'error': 'Article not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def article_my_preview_view(request):
    """获取我的文章预览"""
    limit = int(request.GET.get('limit', 5))
    
    articles = Content.objects.filter(
        author=request.user,
        type='article'
    ).order_by('-created_at')[:limit]
    
    serializer = ContentSerializer(articles, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def message_detail_view(request, id):
    """获取消息详情"""
    try:
        message = Message.objects.get(id=id, receiver=request.user)
        serializer = MessageSerializer(message)
        
        # 标记为已读
        if not message.is_read:
            message.is_read = True
            message.save()
            
        return Response(serializer.data)
    except Message.DoesNotExist:
        return Response(
            {'error': 'Message not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
