#!/bin/bash

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 执行数据库迁移
python manage.py makemigrations
python manage.py migrate

# 创建超级用户(如果需要)
# python manage.py createsuperuser

# 收集静态文件
python manage.py collectstatic --noinput

# 启动开发服务器
python manage.py runserver 0.0.0.0:8000 