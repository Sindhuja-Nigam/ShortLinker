import { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl: url }),
      });

      const data = await res.json();

      if (data.shortUrl) {
        setShortUrl(data.shortUrl);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Server not responding");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>🔗 URL Shortener</h1>
        <form onSubmit={handleSubmit}>
          <label>Enter Long URL</label>
          <input
            type="text"
            placeholder="https://example.com/long-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit">Shorten URL</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {shortUrl && (
          <div className="result">
            <p>✅ Shortened URL:</p>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
