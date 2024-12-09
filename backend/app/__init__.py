from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# 创建Flask应用
app = Flask(__name__)

# 配置数据库路径
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///handbanxingqiu.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 数据库实例
db = SQLAlchemy(app)

from app.routes import init_routes

# 初始化路由
init_routes(app)
