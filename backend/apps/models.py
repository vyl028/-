from django.db import models

# 用户表
class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    profile_picture = models.URLField(max_length=500, blank=True, null=True) #头像
    bio = models.TextField(blank=True, null=True)   #简介
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username

    class Meta:
        db_table = 'user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
# 动态表
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')  # 外键，指向User表
    topic = models.ForeignKey('Topic', null=True, blank=True, on_delete=models.SET_NULL, related_name='posts')  # 外键，指向Topic表
    title = models.CharField(max_length=255)  # 动态标题
    image = models.URLField(null=True, blank=True)  # 图片链接
    content = models.TextField()  # 动态内容
    created_at = models.DateTimeField(auto_now_add=True)  # 创建时间
    likes_count = models.PositiveIntegerField(default=0)  # 点赞数
    comments_count = models.PositiveIntegerField(default=0)  # 评论数

    def __str__(self):
        return self.title


# 文章表
class Article(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')  # 外键，指向User表
    event = models.ForeignKey('Event', null=True, blank=True, on_delete=models.SET_NULL, related_name='articles')  # 外键，指向Event表
    title = models.CharField(max_length=255)  # 文章标题
    content = models.TextField()  # 文章内容
    image = models.URLField(null=True, blank=True)  # 图片链接
    created_at = models.DateTimeField(auto_now_add=True)  # 创建时间
    likes_count = models.PositiveIntegerField(default=0)  # 点赞数
    comments_count = models.PositiveIntegerField(default=0)  # 评论数

    def __str__(self):
        return self.title


# 评论表
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')  # 外键，指向User表
    content = models.TextField()  # 评论内容
    content_type = models.CharField(max_length=50, choices=[('post', 'Post'), ('article', 'Article')])  # 评论对象类型
    content_id = models.PositiveIntegerField()  # 评论对象ID
    created_at = models.DateTimeField(auto_now_add=True)  # 评论时间
    likes_count = models.PositiveIntegerField(default=0)  # 点赞数

    def __str__(self):
        return f"Comment by {self.user.username} on {self.content_type}"


# 点赞表
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')  # 外键，指向User表
    content_type = models.CharField(max_length=50, choices=[('post', 'Post'), ('article', 'Article'), ('comment', 'Comment')])  # 点赞对象类型
    content_id = models.PositiveIntegerField()  # 点赞对象ID
    created_at = models.DateTimeField(auto_now_add=True)  # 点赞时间

    def __str__(self):
        return f"Like by {self.user.username} on {self.content_type}"


# 关注表
class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')  # 外键，指向User表（关注者）
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')  # 外键，指向User表（被关注者）
    created_at = models.DateTimeField(auto_now_add=True)  # 关注时间

    def __str__(self):
        return f"{self.follower.username} follows {self.followed.username}"


# 私信表
class PrivateMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')  # 外键，指向User表（发送者）
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')  # 外键，指向User表（接收者）
    message_content = models.TextField()  # 私信内容
    created_at = models.DateTimeField(auto_now_add=True)  # 发送时间

    def __str__(self):
        return f"Message from {self.sender.username} to {self.receiver.username}"


# 活动表
class Event(models.Model):
    title = models.CharField(max_length=255)  # 活动标题
    description = models.TextField()  # 活动描述
    start_time = models.DateTimeField()  # 活动开始时间
    end_time = models.DateTimeField()  # 活动结束时间
    location = models.CharField(max_length=255)  # 活动地点
    created_at = models.DateTimeField(auto_now_add=True)  # 创建时间

    def __str__(self):
        return self.title


# 活动参与表
class EventParticipant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_participants')  # 外键，指向User表
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='participants')  # 外键，指向Event表
    joined_at = models.DateTimeField(auto_now_add=True)  # 参与时间

    def __str__(self):
        return f"{self.user.username} participated in {self.event.title}"


# 话题表
class Topic(models.Model):
    title = models.CharField(max_length=255)  # 话题标题
    description = models.TextField()  # 话题描述
    start_time = models.DateTimeField()  # 话题开始时间
    end_time = models.DateTimeField()  # 话题结束时间
    created_at = models.DateTimeField(auto_now_add=True)  # 创建时间

    def __str__(self):
        return self.title


# 话题参与表
class TopicParticipation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='topic_participations')  # 外键，指向User表
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='participants')  # 外键，指向Topic表
    joined_at = models.DateTimeField(auto_now_add=True)  # 参与时间

    def __str__(self):
        return f"{self.user.username} participated in topic {self.topic.title}"