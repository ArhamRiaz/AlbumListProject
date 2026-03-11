import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import HeadsetOffIcon from "@mui/icons-material/HeadsetOff";
import { UpdateAlbum } from "./UpdateAlbum";
import axios from "axios";
import { API_URL } from "../utils";

export const Album = ({ album, fetchAlbums, fetchList, userId }) => {
  const { id, name, listened, image } = album;
  const [isListened, setIsListened] = useState(listened);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsListened(listened);
  }, [listened]);

  const handleUpdateAlbum = async () => {
    setIsUpdating(true);
    try {
      const new_listened = isListened === 0 ? 1 : 0;
      const uID = userId.userId;
      await axios.put(API_URL + "album", {
        id,
        name,
        listened: new_listened,
        uID,
      });
      setIsListened(new_listened);
      await fetchAlbums();
      await fetchList();
    } catch (err) {
      console.log(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAlbum = async () => {
    try {
      await axios.delete(`${API_URL + "album"}/${album.id}`);
      await fetchAlbums();
      await fetchList();
    } catch (err) {
      console.log(err);
    }
  };

  // Truncate long names
  const displayName = name.length > 60 ? name.slice(0, 57) + "…" : name;
  const artistName = name.includes(" - ") ? name.split(" - ")[0] : null;
  const albumTitle = name.includes(" - ")
    ? name.split(" - ").slice(1).join(" - ")
    : name;

  return (
    <>
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
        {/* Album Art */}
        <div
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            overflow: "hidden",
          }}
        >
          <img
            src={image}
            alt={name}
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
            <div style={{ display: "flex", gap: "8px" }}>
              {/* Toggle listened */}
              <button
                onClick={handleUpdateAlbum}
                disabled={isUpdating}
                title={isListened ? "Mark as unlistened" : "Mark as listened"}
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
                {isListened ? (
                  <HeadsetOffIcon sx={{ fontSize: 16 }} />
                ) : (
                  <HeadphonesIcon sx={{ fontSize: 16 }} />
                )}
                {isListened ? "Unmark" : "Listened"}
              </button>

              {/* Delete */}
              <button
                onClick={handleDeleteAlbum}
                title="Remove album"
                style={{
                  width: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px",
                  background: "rgba(220,50,50,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(220,50,50,1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(220,50,50,0.8)")
                }
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </button>
            </div>
          </div>

          {/* Listened badge */}
          {isListened === 1 && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "rgba(200,169,110,0.9)",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}
            >
              <HeadphonesIcon sx={{ fontSize: 14, color: "#0a0a0a" }} />
            </div>
          )}
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
                  letterSpacing: "0.02em",
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
              {name}
            </p>
          )}
        </div>
      </div>

      <UpdateAlbum
        fetchAlbums={fetchAlbums}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        album={album}
      />
    </>
  );
};
