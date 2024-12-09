from flask import Flask

def create_app():
    app = Flask(__name__)
    
    # 在这里导入路由，避免循环导入
    from app.routes import init_routes
    init_routes(app)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)  # 开发时启用调试模式
