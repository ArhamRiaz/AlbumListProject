import React, { useState, useRef, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { API_TOKEN } from "../utils.js";
import { Search } from "./SearchAlbum.js";

export const AddAlbum = ({ fetchAlbums, fetchList, userId }) => {
  const [query, setQuery] = useState("");
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const queryAlbum = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setAlbums([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.discogs.com/database/search?q=${encodeURIComponent(searchTerm)}&type=master&token=${API_TOKEN}`,
      );
      const data = await response.json();
      setAlbums(data.results || []);
      setHasSearched(true);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search as user types
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (val.length >= 2) {
      debounceRef.current = setTimeout(() => queryAlbum(val), 500);
    } else {
      setAlbums([]);
      setHasSearched(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      clearTimeout(debounceRef.current);
      queryAlbum(query);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2.2rem",
          fontWeight: "700",
          color: "#f0ece2",
          marginBottom: "8px",
          letterSpacing: "-0.02em",
        }}
      >
        Search Albums
      </h1>
      <p
        style={{
          color: "#555",
          fontSize: "13px",
          marginBottom: "32px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Search the Discogs database to add albums to your library
      </p>

      {/* Search input */}
      <div style={{ position: "relative", marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "14px 18px",
            gap: "12px",
            transition: "border-color 0.2s ease",
          }}
          onFocus={() => {}}
        >
          <SearchIcon sx={{ color: "#555", fontSize: 20, flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search by album or artist name…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#f0ece2",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              letterSpacing: "0.01em",
            }}
            autoFocus
          />
          {isLoading && (
            <CircularProgress
              size={18}
              sx={{ color: "#c8a96e", flexShrink: 0 }}
            />
          )}
          {query && !isLoading && (
            <button
              onClick={() => {
                setQuery("");
                setAlbums([]);
                setHasSearched(false);
                inputRef.current?.focus();
              }}
              style={{
                background: "none",
                border: "none",
                color: "#555",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
                padding: "0",
                flexShrink: 0,
              }}
            >
              ×
            </button>
          )}
        </div>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            color: "#444",
            marginTop: "8px",
            paddingLeft: "4px",
          }}
        >
          Results update automatically as you type, or press Enter to search
        </p>
      </div>

      {/* Results */}
      {hasSearched && !isLoading && albums.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", color: "#444" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px" }}>
            No results found for "{query}"
          </p>
        </div>
      )}

      {albums.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "#555",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            {albums.length} results
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: "24px",
            }}
          >
            {albums.map((album) => (
              <Search
                album={album.title}
                image={album.cover_image}
                key={album.cover_image}
                fetchAlbums={fetchAlbums}
                fetchList={fetchList}
                userId={userId.userId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
