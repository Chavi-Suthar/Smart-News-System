import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from db import get_connection

def recommend_articles(user_id, top_n=5):
    conn = get_connection()

    articles = pd.read_sql_query("SELECT * FROM articles", conn)
    activity = pd.read_sql_query(
        "SELECT article_id FROM user_activity WHERE user_id=?",
        conn,
        params=(user_id,)
    )

    if articles.empty or activity.empty:
        return []

    read_articles = activity["article_id"].tolist()
    read_content = articles[articles["article_id"].isin(read_articles)]

    if read_content.empty:
        return []

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(articles["content"])

    user_vector = vectorizer.transform([" ".join(read_content["content"].tolist())])
    similarity_scores = cosine_similarity(user_vector, tfidf_matrix).flatten()

    articles["score"] = similarity_scores
    recommended = articles[~articles["article_id"].isin(read_articles)]
    recommended = recommended.sort_values(by="score", ascending=False).head(top_n)

    conn.close()
    return recommended[["article_id", "title", "category", "is_fake"]].to_dict(orient="records")