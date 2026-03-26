from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection
from models import create_tables
from ml_model import train_model, predict_fake
from recommender import recommend_articles
from trending import update_trending_scores, get_trending

app = Flask(__name__)
CORS(app)

create_tables()

# Train model automatically if needed
try:
    predict_fake("test")
except:
    train_model()


@app.route("/")
def home():
    return jsonify({"message": "Smart News System API Running"})


@app.route("/add_user", methods=["POST"])
def add_user():
    data = request.json
    name = data.get("name")
    email = data.get("email")

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("INSERT INTO users(name, email) VALUES(?, ?)", (name, email))
    conn.commit()
    user_id = cur.lastrowid
    conn.close()

    return jsonify({"message": "User created", "user_id": user_id})


@app.route("/add_article", methods=["POST"])
def add_article():
    data = request.json
    title = data.get("title")
    content = data.get("content")
    category = data.get("category", "General")

    is_fake = predict_fake(content)

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO articles(title, content, category, is_fake)
    VALUES(?, ?, ?, ?)
    """, (title, content, category, is_fake))

    conn.commit()
    article_id = cur.lastrowid
    conn.close()

    return jsonify({"message": "Article added", "article_id": article_id, "is_fake": is_fake})


@app.route("/articles", methods=["GET"])
def get_articles():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM articles ORDER BY created_at DESC")
    rows = cur.fetchall()
    conn.close()

    return jsonify([dict(row) for row in rows])


@app.route("/article/<int:article_id>", methods=["GET"])
def read_article(article_id):
    user_id = request.args.get("user_id", 1)

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM articles WHERE article_id=?", (article_id,))
    article = cur.fetchone()

    if not article:
        return jsonify({"error": "Article not found"}), 404

    cur.execute("""
    INSERT INTO user_activity(user_id, article_id, action_type)
    VALUES(?, ?, 'view')
    """, (user_id, article_id))

    conn.commit()
    conn.close()

    update_trending_scores()

    return jsonify(dict(article))


@app.route("/like/<int:article_id>", methods=["POST"])
def like_article(article_id):
    data = request.json
    user_id = data.get("user_id", 1)

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO user_activity(user_id, article_id, action_type)
    VALUES(?, ?, 'like')
    """, (user_id, article_id))

    conn.commit()
    conn.close()

    update_trending_scores()

    return jsonify({"message": "Article liked"})


@app.route("/recommend/<int:user_id>", methods=["GET"])
def recommend(user_id):
    recommendations = recommend_articles(user_id)
    return jsonify(recommendations)


@app.route("/trending", methods=["GET"])
def trending():
    update_trending_scores()
    trending_articles = get_trending()
    return jsonify(trending_articles)


if __name__ == "__main__":
    app.run(debug=True)