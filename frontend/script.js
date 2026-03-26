const API = "http://127.0.0.1:5000";

async function loadTrending() {
  let res = await fetch(`${API}/trending`);
  let data = await res.json();

  let html = "";
  data.forEach(a => {
    html += `<div class="card">
      <h3>${a.title}</h3>
      <p>Category: ${a.category}</p>
      <p>Fake: ${a.is_fake ? "⚠️ YES" : "✅ NO"}</p>
      <p>Score: ${a.score.toFixed(2)}</p>
    </div>`;
  });

  document.getElementById("trending").innerHTML = html;
}

async function loadArticles() {
  let res = await fetch(`${API}/articles`);
  let data = await res.json();

  let html = "";
  data.forEach(a => {
    html += `<div class="card">
      <h3>${a.title}</h3>
      <p>${a.content.substring(0, 120)}...</p>
      <p>Category: ${a.category}</p>
      <p>Fake: ${a.is_fake ? "⚠️ YES" : "✅ NO"}</p>
      <button onclick="viewArticle(${a.article_id})">Read</button>
      <button onclick="likeArticle(${a.article_id})">Like</button>
    </div>`;
  });

  document.getElementById("articles").innerHTML = html;
}

async function viewArticle(id) {
  let res = await fetch(`${API}/article/${id}?user_id=1`);
  let data = await res.json();
  alert("Title: " + data.title + "\n\n" + data.content);
  loadTrending();
}

async function likeArticle(id) {
  await fetch(`${API}/like/${id}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({user_id: 1})
  });
  alert("Liked!");
  loadTrending();
}

loadTrending();
loadArticles();