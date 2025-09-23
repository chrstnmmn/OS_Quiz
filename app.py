from flask import Flask, render_template, request, jsonify, g
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime, timezone, timedelta
import pandas as pd

app = Flask(__name__)
CORS(app)

# Database configuration
DATABASE = 'scores.db'

def export_to_csv():
    db = sqlite3.connect(DATABASE)

    read = pd.read_sql('SELECT * FROM scores', db)
    read.to_csv('scores.csv', index=False)

def get_db():
    """Get database connection"""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

def get_ph_time():
    """Get current Philippine time (UTC+8)"""
    return datetime.now(timezone(timedelta(hours=8))).strftime('%Y-%m-%d %H:%M:%S')

def init_db():
    """Initialize database with required tables"""
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        
        # Create scores table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                score INTEGER NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create index for faster leaderboard queries
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_score ON scores (score DESC)')
        
        db.commit()
        print("Database initialized successfully")

@app.teardown_appcontext
def close_connection(exception):
    """Close database connection at the end of request"""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit_score', methods=['POST'])
def submit_score():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        first_name = data.get('firstName', '').strip()
        last_name = data.get('lastName', '').strip()
        score = data.get('score')
        
        if not first_name or not last_name or score is None:
            return jsonify({'error': 'Missing or invalid data'}), 400
        
        # Validate score is a number between 0-15
        try:
            score = int(score)
            if score < 0 or score > 15:
                return jsonify({'error': 'Invalid score'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid score format'}), 400
        
        # Insert score into database with Philippine time
        db = get_db()
        cursor = db.cursor()
        
        cursor.execute(
            'INSERT INTO scores (first_name, last_name, score, timestamp) VALUES (?, ?, ?, ?)',
            (first_name, last_name, score, get_ph_time())
        )
        
        db.commit()
        
        return jsonify({
            'success': True,
            'message': 'Score submitted successfully',
            'id': cursor.lastrowid
        })
            
    except Exception as e:
        print(f"Error in submit_score: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/get_leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        db = get_db()
        cursor = db.cursor()
        
        # Get top 3 scores with names
        cursor.execute('''
            SELECT first_name, last_name, score, timestamp 
            FROM scores 
            ORDER BY score DESC, timestamp DESC 
            LIMIT 3
        ''')
        
        top_scores = []
        for row in cursor.fetchall():
            top_scores.append({
                'name': f"{row['first_name']} {row['last_name']}",
                'score': row['score'],
                'timestamp': row['timestamp']
            })
        
        return jsonify(top_scores)
    except Exception as e:
        print(f"Error in get_leaderboard: {e}")
        return jsonify([])

@app.route('/get_all_scores', methods=['GET'])
def get_all_scores():
    try:
        db = get_db()
        cursor = db.cursor()
        
        cursor.execute('SELECT first_name, last_name, score, timestamp FROM scores ORDER BY score DESC')
        
        all_scores = []
        for row in cursor.fetchall():
            all_scores.append({
                'name': f"{row['first_name']} {row['last_name']}",
                'score': row['score'],
                'timestamp': row['timestamp']
            })
        
        return jsonify(all_scores)
    except Exception as e:
        print(f"Error in get_all_scores: {e}")
        return jsonify([])

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the server and database are working"""
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT COUNT(*) as count FROM scores')
        count = cursor.fetchone()['count']
        
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'scores_count': count,
            'timestamp': get_ph_time()
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Initialize database when server starts
with app.app_context():
    init_db()
    print("Database setup completed")

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/styles', exist_ok=True)
    os.makedirs('static/script', exist_ok=True)
    
    print("Starting server...")
    app.run(debug=True, host='0.0.0.0', port=5000)
    export_to_csv()