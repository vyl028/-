from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)  # 开发时启用调试模式 