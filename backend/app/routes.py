from flask import request, jsonify
from app.models import User, Note, Activity, Post
from app import db

def init_routes(app):
    # 用户注册接口
    @app.route('/api/user/register', methods=['POST'])
    def register():
        data = request.json
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        # 检查用户是否已存在
        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'Username already exists'}), 400

        # 创建新用户
        new_user = User(username=username, password=password, email=email)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'code': 201, 'message': 'User registered successfully', 'data': {'userId': new_user.id}}), 201

    # 用户登录接口
    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.json
        username = data.get('username')
        password = data.get('password')

        # 验证用户
        user = User.query.filter_by(username=username, password=password).first()
        if not user:
            return jsonify({'code': 401, 'message': 'Invalid username or password'}), 401

        return jsonify({'code': 200, 'message': 'Login successful', 'data': {'token': 'abcdef123456'}}), 200

    # 获取所有笔记
    @app.route('/api/notes', methods=['GET'])
    def get_notes():
        notes = Note.query.all()
        return jsonify([{
            'id': note.id,
            'user_id': note.user_id,
            'title': note.title,
            'content': note.content,
            'created_at': note.created_at
        } for note in notes])

    # 获取帖子列表
    @app.route('/api/posts', methods=['GET'])
    def get_posts():
        posts = Post.query.all()
        return jsonify([{
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'user_id': post.user_id,
            'created_at': post.created_at
        } for post in posts])

    # 获取单个帖子
    @app.route('/api/posts/<int:post_id>/', methods=['GET'])
    def get_post(post_id):
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"code": 404, "message": "Post not found"}), 404
        return jsonify({
            "code": 200,
            "message": "请求成功",
            "data": {
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'user_id': post.user_id,
                'created_at': post.created_at
            }
        })

    # 获取活动列表
    @app.route('/api/activity/list', methods=['GET'])
    def get_activity_list():
        activities = Activity.query.all()
        return jsonify([{
            'id': activity.id,
            'title': activity.title,
            'description': activity.description,
            'start_date': activity.start_date,
            'end_date': activity.end_date,
            'created_at': activity.created_at
        } for activity in activities])

    # 获取活动详情
    @app.route('/api/activity/detail/<int:activity_id>/', methods=['GET'])
    def get_activity_detail(activity_id):
        activity = Activity.query.get(activity_id)
        if not activity:
            return jsonify({"code": 404, "message": "Activity not found"}), 404
        return jsonify({
            "code": 200,
            "message": "请求成功",
            "data": {
                'id': activity.id,
                'title': activity.title,
                'description': activity.description,
                'start_date': activity.start_date,
                'end_date': activity.end_date,
                'created_at': activity.created_at
            }
        })

# ... existing code ...