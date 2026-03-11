import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

export const Search = ({ album, image, fetchAlbums, fetchList, userId }) => {
  const [addedState, setAddedState] = useState(null); // null | 'listened' | 'want'
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const artistName = album.includes(" - ") ? album.split(" - ")[0] : null;
  const albumTitle = album.includes(" - ")
    ? album.split(" - ").slice(1).join(" - ")
    : album;

  const addAlbum = async (listened) => {
    setIsLoading(true);
    try {
      await axios.post(process.env.REACT_APP_API_URL + "album", {
        name: album,
        listened,
        image,
        userId,
      });
      await fetchAlbums();
      await fetchList();
      setAddedState(listened === 1 ? "listened" : "want");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#1a1a1a",
        cursor: "pointer",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,169,110,0.3)"
          : "0 4px 12px rgba(0,0,0,0.3)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* Album art */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          overflow: "hidden",
        }}
      >
        <img
          src={image}
          alt={album}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.35s ease",
          }}
        />

        {/* Hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.25s ease",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "16px",
            gap: "8px",
          }}
        >
          {addedState ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                color: "#c8a96e",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: "600",
                padding: "8px",
                background: "rgba(200,169,110,0.15)",
                borderRadius: "8px",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              {addedState === "listened" ? "Added!" : "Added to list!"}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => addAlbum(1)}
                disabled={isLoading}
                title="Already listened"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "8px",
                  background: "rgba(200,169,110,0.85)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#0a0a0a",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(200,169,110,1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(200,169,110,0.85)")
                }
              >
                <HeadphonesIcon sx={{ fontSize: 14 }} />
                Listened
              </button>
              <button
                onClick={() => addAlbum(0)}
                disabled={isLoading}
                title="Add to listen list"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "8px",
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
                }
              >
                <AddIcon sx={{ fontSize: 14 }} />
                Want
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Text info */}
      <div style={{ padding: "12px 14px 14px" }}>
        {artistName ? (
          <>
            <p
              style={{
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#c8a96e",
                fontWeight: "500",
                marginBottom: "2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {artistName}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                fontSize: "14px",
                color: "#f0ece2",
                fontWeight: "700",
                lineHeight: "1.3",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {albumTitle}
            </p>
          </>
        ) : (
          <p
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', serif",
              fontSize: "14px",
              color: "#f0ece2",
              fontWeight: "700",
              lineHeight: "1.4",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {album}
          </p>
        )}
      </div>
    </div>
  );
};
