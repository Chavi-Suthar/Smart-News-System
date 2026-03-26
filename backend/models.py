from db import get_connection

def create_tables():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS articles (
        article_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        category TEXT,
        is_fake INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS user_activity (
        activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        article_id INTEGER,
        action_type TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(user_id),
        FOREIGN KEY(article_id) REFERENCES articles(article_id)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS trending_scores (
        article_id INTEGER PRIMARY KEY,
        score REAL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(article_id) REFERENCES articles(article_id)
    )
    """)

    conn.commit()
    conn.close()