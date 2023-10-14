const API_KEY = "ac3d31469ad744ed8749e08dee1114b0";
const url = "https://newsapi.org/v2/everything?";
const pageSize = 80;

let allArticles = [];

window.addEventListener("load", () => {
    fetchNews("global");
});

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}q=${query}&pageSize=${pageSize}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`);
    const data = await res.json();
    const newArticles = removeDuplicates(data.articles, "title");
    allArticles = [...allArticles, ...newArticles];
    bindData(allArticles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    const uniqueArticles = removeDuplicates(articles, "title");

    const displayedArticles = uniqueArticles.slice(0, pageSize);

    displayedArticles.forEach((article) => {
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

function removeDuplicates(array, key) {
    const seen = new Set();
    return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}

let curSelectedNav = null;

function onNavItemClick(id) {
    fetchNews(id);
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
        item.classList.remove("active");
    });
    curSelectedNav = document.getElementById(id);
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
        item.classList.remove("active");
    });
    curSelectedNav = null;
});

function handleSearch(e) {
    e.preventDefault();
    const query = searchText.value.trim();
    if (query) {
        fetchNews(query);
        const navItems = document.querySelectorAll(".nav-item");
        navItems.forEach((item) => {
            item.classList.remove("active");
        });
        curSelectedNav = null;
    }
}

const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", handleSearch);
