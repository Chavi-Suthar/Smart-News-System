// const API = "http://127.0.0.1:5000";
// const USER_ID = 1;

// let allArticles = [];

// async function loadTrending() {
//   let trendingDiv = document.getElementById("trending");
//   if (!trendingDiv) return;

//   trendingDiv.innerHTML = `<div class="loading">Loading trending news...</div>`;

//   let res = await fetch(`${API}/trending`);
//   let data = await res.json();

//   let html = "";

//   if (data.length === 0) {
//     html = "<p>No trending articles yet.</p>";
//   } else {
//     data.forEach(a => {
//       html += `
//         <div class="card">
//           <h3>${a.title}</h3>
//           <span class="badge category">${a.category}</span>
//           <span class="badge trending">🔥 Trending Score: ${a.score.toFixed(2)}</span>
//           <br><br>
//           <span class="badge ${a.is_fake ? "fake" : "real"}">
//             ${a.is_fake ? "⚠️ Fake News" : "✅ Real News"}
//           </span>

//           <div class="btn-row">
//             <button class="btn-read" onclick="openArticle(${a.article_id})">Read</button>
//           </div>
//         </div>
//       `;
//     });
//   }

//   trendingDiv.innerHTML = html;
// }

// async function loadArticles() {
//   let articlesDiv = document.getElementById("articles");
//   if (!articlesDiv) return;

//   articlesDiv.innerHTML = `<div class="loading">Loading all articles...</div>`;

//   let res = await fetch(`${API}/articles`);
//   allArticles = await res.json();

//   renderArticles(allArticles);
//   fillCategories(allArticles);
// }

// function renderArticles(data) {
//   let articlesDiv = document.getElementById("articles");

//   let html = "";
//   if (data.length === 0) {
//     html = "<p>No articles found.</p>";
//   } else {
//     data.forEach(a => {
//       html += `
//         <div class="card">
//           <h3>${a.title}</h3>
//           <p>${a.content.substring(0, 130)}...</p>

//           <span class="badge category">${a.category}</span>
//           <span class="badge ${a.is_fake ? "fake" : "real"}">
//             ${a.is_fake ? "⚠️ Fake News" : "✅ Real News"}
//           </span>

//           <div class="btn-row">
//             <button class="btn-read" onclick="openArticle(${a.article_id})">Read</button>
//             <button class="btn-like" onclick="likeArticle(${a.article_id})">👍 Like</button>
//           </div>
//         </div>
//       `;
//     });
//   }

//   articlesDiv.innerHTML = html;
// }

// function fillCategories(data) {
//   let categorySelect = document.getElementById("categoryFilter");
//   if (!categorySelect) return;

//   let categories = new Set();
//   data.forEach(a => categories.add(a.category));

//   categorySelect.innerHTML = `<option value="All">All Categories</option>`;

//   categories.forEach(cat => {
//     categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
//   });
// }

// function filterArticles() {
//   let searchText = document.getElementById("searchInput").value.toLowerCase();
//   let selectedCategory = document.getElementById("categoryFilter").value;

//   let filtered = allArticles.filter(a => {
//     let matchesSearch =
//       a.title.toLowerCase().includes(searchText) ||
//       a.content.toLowerCase().includes(searchText);

//     let matchesCategory =
//       selectedCategory === "All" || a.category === selectedCategory;

//     return matchesSearch && matchesCategory;
//   });

//   renderArticles(filtered);
// }

// function openArticle(articleId) {
//   window.location.href = `article.html?id=${articleId}`;
// }

// async function likeArticle(articleId) {
//   await fetch(`${API}/like/${articleId}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ user_id: USER_ID })
//   });

//   alert("✅ Article Liked!");
//   loadTrending();
// }

// async function loadDashboard() {
//   let trendingBox = document.getElementById("dashboardTrending");
//   let recommendBox = document.getElementById("dashboardRecommend");

//   if (!trendingBox || !recommendBox) return;

//   trendingBox.innerHTML = `<div class="loading">Loading trending...</div>`;
//   recommendBox.innerHTML = `<div class="loading">Loading recommendations...</div>`;

//   let tRes = await fetch(`${API}/trending`);
//   let trendingData = await tRes.json();

//   let rRes = await fetch(`${API}/recommend/${USER_ID}`);
//   let recommendData = await rRes.json();

//   let trendingHTML = "";
//   trendingData.forEach(a => {
//     trendingHTML += `
//       <div class="card">
//         <h3>${a.title}</h3>
//         <span class="badge category">${a.category}</span>
//         <span class="badge trending">🔥 ${a.score.toFixed(2)}</span>
//         <br><br>
//         <button class="btn-read" onclick="openArticle(${a.article_id})">Read</button>
//       </div>
//     `;
//   });

//   let recommendHTML = "";
//   if (recommendData.length === 0) {
//     recommendHTML = `<p>No recommendations yet. Read some articles first.</p>`;
//   } else {
//     recommendData.forEach(a => {
//       recommendHTML += `
//         <div class="card">
//           <h3>${a.title}</h3>
//           <span class="badge category">${a.category}</span>
//           <span class="badge ${a.is_fake ? "fake" : "real"}">
//             ${a.is_fake ? "⚠️ Fake News" : "✅ Real News"}
//           </span>
//           <br><br>
//           <button class="btn-read" onclick="openArticle(${a.article_id})">Read</button>
//         </div>
//       `;
//     });
//   }

//   trendingBox.innerHTML = trendingHTML;
//   recommendBox.innerHTML = recommendHTML;
// }


const API = "http://127.0.0.1:5000";
const USER_ID = 1;

let allArticles = [];

/* =========================
   DARK MODE FUNCTIONS
========================= */
function applyTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

function toggleDarkMode() {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
}

/* =========================
   FAKE NEWS MODAL POPUP
========================= */
function showFakeNewsPopup(title) {
  const modal = document.getElementById("fakeNewsModal");
  const modalTitle = document.getElementById("fakeNewsTitle");

  modalTitle.innerText = title;
  modal.classList.add("show");
}

function closeFakeNewsPopup() {
  document.getElementById("fakeNewsModal").classList.remove("show");
}

/* =========================
   TRENDING
========================= */
async function loadTrending() {
  let trendingDiv = document.getElementById("trending");
  if (!trendingDiv) return;

  trendingDiv.innerHTML = `<div class="loading">Loading trending news...</div>`;

  let res = await fetch(`${API}/trending`);
  let data = await res.json();

  let html = "";

  if (data.length === 0) {
    html = "<p>No trending articles yet.</p>";
  } else {
    data.forEach(a => {
      html += `
        <div class="card">
          <h3>${a.title}</h3>
          <span class="badge category">${a.category}</span>
          <span class="badge trending">🔥 Score: ${a.score.toFixed(2)}</span>
          <br><br>
          <span class="badge ${a.is_fake ? "fake" : "real"}">
            ${a.is_fake ? "⚠️ Fake News" : "✅ Real News"}
          </span>

          <div class="btn-row">
            <button class="btn-read" onclick="openArticle(${a.article_id}, ${a.is_fake}, '${a.title.replace(/'/g, "")}')">
              Read
            </button>
          </div>
        </div>
      `;
    });
  }

  trendingDiv.innerHTML = html;
}

/* =========================
   LOAD ARTICLES
========================= */
async function loadArticles() {
  let articlesDiv = document.getElementById("articles");
  if (!articlesDiv) return;

  articlesDiv.innerHTML = `<div class="loading">Loading all articles...</div>`;

  let res = await fetch(`${API}/articles`);
  allArticles = await res.json();

  renderArticles(allArticles);
  fillCategories(allArticles);
}

/* =========================
   RENDER ARTICLES
========================= */
function renderArticles(data) {
  let articlesDiv = document.getElementById("articles");

  let html = "";
  if (data.length === 0) {
    html = "<p>No articles found.</p>";
  } else {
    data.forEach(a => {
      html += `
        <div class="card">
          <h3>${a.title}</h3>
          <p>${a.content.substring(0, 130)}...</p>

          <span class="badge category">${a.category}</span>
          <span class="badge ${a.is_fake ? "fake" : "real"}">
            ${a.is_fake ? "⚠️ Fake News" : "✅ Real News"}
          </span>

          <div class="btn-row">
            <button class="btn-read" onclick="openArticle(${a.article_id}, ${a.is_fake}, '${a.title.replace(/'/g, "")}')">
              Read
            </button>

            <button class="btn-like" onclick="likeArticle(${a.article_id})">
              👍 Like
            </button>
          </div>
        </div>
      `;
    });
  }

  articlesDiv.innerHTML = html;
}

/* =========================
   CATEGORY FILTER
========================= */
function fillCategories(data) {
  let categorySelect = document.getElementById("categoryFilter");
  if (!categorySelect) return;

  let categories = new Set();
  data.forEach(a => categories.add(a.category));

  categorySelect.innerHTML = `<option value="All">All Categories</option>`;

  categories.forEach(cat => {
    categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function filterArticles() {
  let searchText = document.getElementById("searchInput").value.toLowerCase();
  let selectedCategory = document.getElementById("categoryFilter").value;

  let filtered = allArticles.filter(a => {
    let matchesSearch =
      a.title.toLowerCase().includes(searchText) ||
      a.content.toLowerCase().includes(searchText);

    let matchesCategory =
      selectedCategory === "All" || a.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  renderArticles(filtered);
}

/* =========================
   OPEN ARTICLE + FAKE POPUP
========================= */
function openArticle(articleId, isFake, title) {
  if (isFake === 1) {
    showFakeNewsPopup(title);
    setTimeout(() => {
      window.location.href = `article.html?id=${articleId}`;
    }, 1500);
  } else {
    window.location.href = `article.html?id=${articleId}`;
  }
}

/* =========================
   LIKE ARTICLE
========================= */
async function likeArticle(articleId) {
  await fetch(`${API}/like/${articleId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: USER_ID })
  });

  alert("✅ Article Liked!");
  loadTrending();
}

/* =========================
   DASHBOARD
========================= */
async function loadDashboard() {
  let trendingBox = document.getElementById("dashboardTrending");
  let recommendBox = document.getElementById("dashboardRecommend");

  if (!trendingBox || !recommendBox) return;

  trendingBox.innerHTML = `<div class="loading">Loading trending...</div>`;
  recommendBox.innerHTML = `<div class="loading">Loading recommendations...</div>`;

  let tRes = await fetch(`${API}/trending`);
  let trendingData = await tRes.json();

  let rRes = await fetch(`${API}/recommend/${USER_ID}`);
  let recommendData = await rRes.json();

  let trendingHTML = "";
  trendingData.forEach(a => {
    trendingHTML += `
      <div class="card">
        <h3>${a.title}</h3>
        <span class="badge category">${a.category}</span>
        <span class="badge trending">🔥 ${a.score.toFixed(2)}</span>
        <br><br>
        <button class="btn-read" onclick="openArticle(${a.article_id}, ${a.is_fake}, '${a.title.replace(/'/g, "")}')">
          Read
        </button>
      </div>
    `;
  });

  let recommendHTML = "";
  if (recommendData.length === 0) {
    recommendHTML = `<p>No recommendations yet. Read some articles first.</p>`;
  } else {
    recommendData.forEach(a => {
      recommendHTML += `
        <div class="card">
          <h3>${a.title}</h3>
          <span class="badge category">${a.category}</span>
          <span class="badge ${a.is_fake ? "fake" : "real"}">
            ${a.is_fake ? "⚠️ Fake News" : "✅ Real News"}
          </span>
          <br><br>
          <button class="btn-read" onclick="openArticle(${a.article_id}, ${a.is_fake}, '${a.title.replace(/'/g, "")}')">
            Read
          </button>
        </div>
      `;
    });
  }

  trendingBox.innerHTML = trendingHTML;
  recommendBox.innerHTML = recommendHTML;
}