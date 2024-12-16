from django.urls import path
from . import views

urlpatterns = [
    # 搜索相关
    path('search/', views.search_view, name='search'),
    
    # 发现页面
    path('discover/list/', views.discover_list_view, name='discover-list'),
    path('content/<int:id>/', views.content_detail_view, name='content-detail'),
    
    # 话题相关
    path('topics/hot/', views.hot_topics_view, name='hot-topics'),
    path('topics/all/', views.all_topics_view, name='all-topics'),
    path('topics/list/', views.topics_list_view, name='topics-list'),
    
    # 活动相关
    path('activities/hot/', views.hot_activities_view, name='hot-activities'),
    path('activities/all/', views.all_activities_view, name='all-activities'),
    path('activities/list/', views.activities_list_view, name='activities-list'),
    path('activity/detail/<int:id>/', views.activity_detail_view, name='activity-detail'),
    path('activity/related-articles/', views.activity_related_articles_view, name='activity-related-articles'),
    
    # 内容相关
    path('content/list/', views.content_list_view, name='content-list'),
    path('content/publish/', views.content_publish_view, name='content-publish'),
    
    # 消息相关
    path('message/list/', views.message_list_view, name='message-list'),
    path('message/read/', views.message_read_view, name='message-read'),
    path('message/read-all/', views.message_read_all_view, name='message-read-all'),
    path('message/<int:id>/', views.message_detail_view, name='message-detail'),
    path('message/unread-count/', views.message_unread_count_view, name='message-unread-count'),
    
    # 关注相关
    path('follow/list/', views.follow_list_view, name='follow-list'),
    path('follow/action/', views.follow_action_view, name='follow-action'),
    path('follow/content/list/', views.follow_content_list_view, name='follow-content-list'),
    
    # 个人中心
    path('profile/profile/', views.profile_view, name='profile'),
    path('profile/activities/preview/', views.profile_activities_preview_view, name='profile-activities-preview'),
    path('profile/articles/preview/', views.profile_articles_preview_view, name='profile-articles-preview'),
    
    # 收藏相关
    path('collection/preview/', views.collection_preview_view, name='collection-preview'),
    
    # 粉丝相关
    path('fans/followers/', views.fans_followers_view, name='fans-followers'),
    path('fans/action/', views.fans_action_view, name='fans-action'),
    
    # 文章相关
    path('article/publish/', views.article_publish_view, name='article-publish'),
    path('article/my/preview/', views.article_my_preview_view, name='article-my-preview'),
    path('article/detail/<int:id>/', views.article_detail_view, name='article-detail'),
    path('article/action/', views.article_action_view, name='article-action'),
    
    # 评论相关
    path('comment/add/', views.comment_add_view, name='comment-add'),
    path('comment/list/', views.comment_list_view, name='comment-list'),
    
    # 文件上传
    path('upload/image/', views.upload_image_view, name='upload-image'),
    
    # 认证相关
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/refresh/', views.refresh_token_view, name='refresh-token'),
    path('auth/logout/', views.logout_view, name='logout'),
]
