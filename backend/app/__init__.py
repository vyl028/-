from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import Config  # 导入配置类

# 创建Flask应用
app = Flask(__name__)
app.config.from_object(Config)  # 从配置类加载配置

# 数据库实例
db = SQLAlchemy(app)

from app.models import User, Note, Activity, Post  # 导入模型
from app.routes import init_routes

# 初始化路由
init_routes(app)
