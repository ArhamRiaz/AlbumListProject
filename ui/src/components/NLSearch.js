import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Album } from "./Album";
import { api } from "../utils";

export const NLSearch = ({ fetchAlbums, fetchList }) => {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post("query", { question: question.trim() });
      setResults(res.data);
    } catch (err) {
      setError("Couldn't run that search — try rephrasing.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "8px", marginBottom: "20px" }}
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. albums I added last month that I haven't listened to yet"
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #444",
            background: "#1a1a1a",
            color: "#fff",
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#c8a96e",
            cursor: "pointer",
          }}
        >
          <SearchIcon sx={{ fontSize: 18 }} />
        </button>
      </form>

      {error && <p style={{ color: "#e57373" }}>{error}</p>}

      {results &&
        (results.length === 0 ? (
          <p>No albums matched that.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "16px",
            }}
          >
            {results.map((album) => (
              <Album
                key={album.id}
                album={album}
                fetchAlbums={fetchAlbums}
                fetchList={fetchList}
              />
            ))}
          </div>
        ))}
    </div>
  );
};
