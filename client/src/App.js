import React, { useState, useEffect } from "react";
import { ArticleHeadline } from "./components/ArticleHeadline/ArticleHeadline";
import { debounce } from "./utils/debounce";
import "./App.css";

function App() {
  const [articles, setArticles] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // Fetch drone articles
  useEffect(() => {
    // Enable aborting the request
    const abortController = new AbortController();
    const abortSignal = abortController.signal;

    // Fetch the news articles from server side
    async function fetchDroneArticles() {
      let apiUrl = "/api/news";

      // If we want to search some keywords!
      // const params = new URLSearchParams({ keywords: <search-term> });
      // apiUrl = `${apiUrl}?${params}`;

      try {
        const resData = await fetch(apiUrl, { signal: abortSignal });
        const jsonData = await resData.json();
        setArticles(jsonData);
      } catch (e) {
        console.error(e);
      }
    }

    fetchDroneArticles();

    // Abort request
    return () => {
      abortController.abort();
    };
  }, []);

  // Filters articles by search input
  function getFilteredArticles() {
    if (!searchInput) return [...articles];

    const searchFields = ["title", "author"];

    // Search both 'title' and 'author' (case insensitive)
    return articles.filter((article) => {
      return searchFields.some(
        (field) =>
          article[field] &&
          article[field].toLowerCase().includes(searchInput.toLowerCase())
      );
    });
  }

  // Debounce search input change to avoid lagging
  const debouncedSearch = debounce((e) => {
    setSearchInput(e.target.value);
  }, 300);

  // Filtered articles to display
  const filteredArticles = getFilteredArticles();

  return (
    <div className="app">
      <header className="app-header">VOOM News</header>
      <main className="app-main">
        <div className="app-search">
          <input
            type="text"
            placeholder="Search Headlines..."
            onChange={debouncedSearch}
          />
          <p>{filteredArticles.length} Results Found</p>
        </div>
        {/* In our case, we know we will render at most 100 results.
            In real life scenario, this would be implemented with
            infinite scrolling / virtualization.
        */}
        <div className="app-articles">
          {filteredArticles.map((article) => (
            <ArticleHeadline key={article.url} {...article} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
