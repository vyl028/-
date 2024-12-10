from django.db import models

class User(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=128)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

class Activity(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='activities/')
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField()

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Post(models.Model):
    title = models.CharField(max_length=200)
    summary = models.TextField()
    cover_image = models.ImageField(upload_to='posts/')
    created_at = models.DateTimeField(auto_now_add=True) 