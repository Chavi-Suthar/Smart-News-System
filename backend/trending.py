from db import get_connection

def update_trending_scores():
    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT 
        a.article_id,
        a.created_at,
        SUM(CASE WHEN ua.action_type='view' THEN 1 ELSE 0 END) as views,
        SUM(CASE WHEN ua.action_type='like' THEN 1 ELSE 0 END) as likes
    FROM articles a
    LEFT JOIN user_activity ua ON a.article_id = ua.article_id
    GROUP BY a.article_id
    """

    cur.execute(query)
    rows = cur.fetchall()

    for row in rows:
        article_id = row["article_id"]
        views = row["views"] or 0
        likes = row["likes"] or 0

        score_query = """
        SELECT 
        ((? + 2*?) * 1.0) /
        ((julianday('now') - julianday(created_at)) * 24 + 1)
        FROM articles WHERE article_id=?
        """

        cur.execute(score_query, (views, likes, article_id))
        score = cur.fetchone()[0]

        cur.execute("""
        INSERT INTO trending_scores(article_id, score)
        VALUES(?, ?)
        ON CONFLICT(article_id) DO UPDATE SET
        score=excluded.score,
        last_updated=CURRENT_TIMESTAMP
        """, (article_id, score))

    conn.commit()
    conn.close()


def get_trending(top_n=5):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    SELECT a.article_id, a.title, a.category, a.is_fake, t.score
    FROM trending_scores t
    JOIN articles a ON t.article_id = a.article_id
    ORDER BY t.score DESC
    LIMIT ?
    """, (top_n,))

    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]