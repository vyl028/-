from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Profile, 
    Content, 
    Comment, 
    Follow, 
    Message, 
    Activity, 
    Favorite,
    Topic
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('id', 'name', 'description', 'heat', 'created_at')

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = ('id', 'user', 'nickname', 'avatar', 'description')

class ContentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Content
        fields = ('id', 'title', 'content', 'type', 'author', 'created_at', 'updated_at')

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ('id', 'content', 'author', 'text', 'created_at')

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = ('id', 'sender', 'receiver', 'type', 'title', 'content', 'target_id', 'is_read', 'created_at')

class ActivitySerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    
    class Meta:
        model = Activity
        fields = ('id', 'title', 'description', 'cover', 'start_time', 'end_time', 'status', 'creator', 'created_at')

class FavoriteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    content = ContentSerializer(read_only=True)
    
    class Meta:
        model = Favorite
        fields = ('id', 'user', 'content', 'created_at')

class FollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ('id', 'follower', 'following', 'created_at')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    device_id = serializers.CharField()

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    nickname = serializers.CharField()
    email = serializers.EmailField()
    verify_code = serializers.CharField()

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("用户名已存在")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("邮箱已被注册")
        return value

class ContentListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    stats = serializers.SerializerMethodField()

    class Meta:
        model = Content
        fields = ('id', 'title', 'content', 'author', 'created_at', 'stats')

    def get_stats(self, obj):
        return {
            'like_count': 0,  # 需要实现点赞统计
            'comment_count': Comment.objects.filter(content=obj).count(),
            'share_count': 0  # 需要实现分享统计
        }

class ActivityDetailSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ('id', 'title', 'description', 'cover', 'time', 'status', 'is_favorited')

    def get_time(self, obj):
        return {
            'start': obj.start_time,
            'end': obj.end_time
        }

    def get_is_favorited(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            # 需要实现收藏关系模型
            return False
        return False

class ProfileDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    stats = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ('id', 'user', 'nickname', 'avatar', 'description', 'stats')

    def get_stats(self, obj):
        return {
            'favorite_count': 0,  # 需要实现收藏统计
            'follower_count': Follow.objects.filter(following=obj.user).count(),
            'following_count': Follow.objects.filter(follower=obj.user).count()
        }
