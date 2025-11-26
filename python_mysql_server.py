# python_mysql_server.py
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
from mysql_config import MySQLDatabase
import os

class MySQLRequestHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.db = MySQLDatabase()
        super().__init__(*args, **kwargs)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        
    def do_GET(self):
        if self.path == '/':
            self.serve_file('index.html')
        elif self.path.endswith('.html') or self.path.endswith('.css') or self.path.endswith('.js'):
            self.serve_file(self.path[1:])  # Remove leading slash
        elif self.path == '/test-db':
            self.test_database_connection()
        else:
            self.send_error(404, "File not found")
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            print(f"📨 Received data: {data}")
        except:
            # Fallback for form data
            data = urllib.parse.parse_qs(post_data.decode('utf-8'))
            data = {k: v[0] for k, v in data.items()}
            print(f"📨 Received form data: {data}")
        
        if self.path == '/register':
            self.handle_register(data)
        elif self.path == '/login':
            self.handle_login(data)
        else:
            self.send_error(404, "Endpoint not found")
    
    def test_database_connection(self):
        success = self.db.test_connection()
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps({
            'success': success,
            'message': 'Database test completed'
        }).encode())
    
    def handle_register(self, data):
        try:
            # Validation
            required_fields = ['username', 'password', 'email', 'phone']
            for field in required_fields:
                if field not in data or not data[field]:
                    self.send_response(400)
                    self.send_cors_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'success': False,
                        'message': f'Field {field} harus diisi!'
                    }).encode())
                    return
            
            if len(data['username']) < 3:
                self.send_response(400)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'message': 'Username minimal 3 karakter!'
                }).encode())
                return
                
            if len(data['password']) < 6:
                self.send_response(400)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'message': 'Password minimal 6 karakter!'
                }).encode())
                return
            
            # Email validation
            import re
            email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
            if not re.match(email_regex, data['email']):
                self.send_response(400)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'message': 'Format email tidak valid!'
                }).encode())
                return
            
            # Check if user exists
            exists = self.db.check_user_exists(data['username'], data['email'])
            if exists == "username":
                self.send_response(400)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'message': 'Username sudah digunakan!'
                }).encode())
                return
            elif exists == "email":
                self.send_response(400)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'message': 'Email sudah terdaftar!'
                }).encode())
                return
            elif exists == "error":
                self.send_response(500)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'message': 'Error checking user existence!'
                }).encode())
                return
            
            # Register user
            if self.db.register_user(data):
                self.send_response(200)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'message': 'Registrasi berhasil! Silakan login.'
                }).encode())
            else:
                self.send_response(500)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'message': 'Gagal melakukan registrasi. Coba lagi.'
                }).encode())
                
        except Exception as e:
            print(f"❌ Register error: {e}")
            self.send_response(500)
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'message': f'Terjadi kesalahan server: {str(e)}'
            }).encode())
    
    def handle_login(self, data):
        try:
            # Validation
            if 'username' not in data or 'password' not in data or not data['username'] or not data['password']:
                self.send_response(400)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'message': 'Username dan password harus diisi!'
                }).encode())
                return
            
            # Login user
            user = self.db.login_user(data['username'], data['password'])
            if user:
                self.send_response(200)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'message': f'Login berhasil! Selamat datang, {user["username"]}!',
                    'user': {
                        'id': user['id'],
                        'username': user['username'],
                        'email': user['email'],
                        'phone': user['phone']
                    }
                }).encode())
            else:
                self.send_response(401)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'message': 'Username atau password salah!'
                }).encode())
                
        except Exception as e:
            print(f"❌ Login error: {e}")
            self.send_response(500)
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'message': f'Terjadi kesalahan server: {str(e)}'
            }).encode())
    
    def serve_file(self, filename):
        try:
            with open(filename, 'rb') as file:
                content = file.read()
            
            self.send_response(200)
            
            if filename.endswith('.css'):
                self.send_header('Content-type', 'text/css')
            elif filename.endswith('.js'):
                self.send_header('Content-type', 'application/javascript')
            else:
                self.send_header('Content-type', 'text/html')
                
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(content)
            
        except FileNotFoundError:
            self.send_error(404, "File not found")
    
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

def run_server():
    PORT = 8000
    server = HTTPServer(('localhost', PORT), MySQLRequestHandler)
    
    print("=" * 60)
    print(f"🚀 Python MySQL Server berjalan di http://localhost:{PORT}")
    print("📊 Testing database connection...")
    
    # Test database connection
    db = MySQLDatabase()
    db.test_connection()
    
    print("🔧 Fitur: Register & Login dengan MySQL Database")
    print("⏹️  Tekan Ctrl+C untuk menghentikan server")
    print("=" * 60)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server dihentikan. Sampai jumpa!")
        server.shutdown()

if __name__ == '__main__':
    run_server()