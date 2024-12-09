from flask import request, jsonify
from app.models import User, Note
from app import db

def init_routes(app):
    # 用户注册接口
    @app.route('/api/register', methods=['POST'])
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

        return jsonify({'message': 'User registered successfully'}), 201

    # 用户登录接口
    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.json
        username = data.get('username')
        password = data.get('password')

        # 验证用户
        user = User.query.filter_by(username=username, password=password).first()
        if not user:
            return jsonify({'message': 'Invalid username or password'}), 401

        return jsonify({'message': 'Login successful', 'user_id': user.id}), 200

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






# from flask import Flask, request, jsonify

# app = Flask(__name__)

# # 用户管理
# @app.route('/api/auth/login', methods=['POST'])
# def login():
#     data = request.json
#     username = data.get('username')
#     password = data.get('password')
#     # 这里添加用户验证逻辑
#     return jsonify({"code": 200, "message": "登录成功", "data": {"token": "abcdef123456"}})

# @app.route('/api/auth/register', methods=['POST'])
# def register():
#     data = request.json
#     username = data.get('username')
#     password = data.get('password')
#     email = data.get('email')
#     # 这里添加用户注册逻辑
#     return jsonify({"code": 201, "message": "注册成功", "data": {"userId": 12345}})

# # 视频/图片模块
# @app.route('/api/videos', methods=['GET'])
# def get_videos():
#     category = request.args.get('category')
#     sort_by = request.args.get('sort_by')
#     # 这里添加获取视频列表逻辑
#     return jsonify({"code": 200, "message": "请求成功", "data": []})

# @app.route('/api/images', methods=['GET'])
# def get_images():
#     category = request.args.get('category')
#     sort_by = request.args.get('sort_by')
#     # 这里添加获取图片列表逻辑
#     return jsonify({"code": 200, "message": "请求成功", "data": []})

# @app.route('/api/videos/<int:video_id>', methods=['GET'])
# def get_video_details(video_id):
#     # 这里添加获取视频详情逻辑
#     return jsonify({"code": 200, "message": "请求成功", "data": {"videoId": video_id, "title": "手办展示视频", "description": "这是一段关于手办的展示视频。", "comments": []}})

# @app.route('/api/images/<int:image_id>', methods=['GET'])
# def get_image_details(image_id):
#     # 这里添加获取图片详情逻辑
#     return jsonify({"code": 200, "message": "请求成功", "data": {}})

# # 动态模块
# @app.route('/api/community/posts', methods=['POST'])
# def create_post():
#     data = request.json
#     content = data.get('content')
#     images = data.get('images', [])
#     topicId = data.get('topicId')
#     # 这里添加发布动态逻辑
#     return jsonify({"code": 201, "message": "动态发布成功"})

# @app.route('/api/community/posts', methods=['GET'])
# def get_posts():
#     category = request.args.get('category')
#     sort_by = request.args.get('sort_by')
#     # 这里添加获取动态列表逻辑
#     return jsonify({"code": 200, "message": "请求成功", "data": []})

# @app.route('/api/community/posts/<int:post_id>', methods=['GET'])
# def get_post_details(post_id):
#     # 这里添加获取特定动态详情逻辑
#     return jsonify({"code": 200, "message": "请求成功", "data": {}})

# # 评论模块
# @app.route('/api/comments/create', methods=['POST'])
# def create_comment():
#     data = request.json
#     targetId = data.get('targetId')
#     type = data.get('type')
#     content = data.get('content')
#     # 这里添加发布评论逻辑
#     return jsonify({"code": 201, "message": "评论发布成功"})

# # 活动模块
# @app.route('/api/activity/list', methods=['GET'])
# def get_activity_list():
#     page = request.args.get('page', default=1, type=int)
#     pageSize = request.args.get('pageSize', default=10, type=int)
#     # 这里添加获取活动列表逻辑
#     return jsonify({"code": 200, "message": "请求成功", "data": []})

# # 社交模块
# @app.route('/api/users/<int:userId>/follow', methods=['POST'])
# def follow_user(userId):
#     data = request.json
#     # 这里添加关注用户逻辑
#     return jsonify({"code": 200, "message": "关注成功"})

# if __name__ == '__main__':
#     app.run(debug=True)