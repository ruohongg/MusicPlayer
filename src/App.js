import React, { useState } from "react";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineCheckSquare,
  AiOutlineBorder,
} from "react-icons/ai";
import "./App.css";

function TitleBox({ title }) {
  return (
    <div
      style={{
        border: "1px solid red ",
        fontSize: "small",
        color: "teal",
      }}
    >
      <h2 style={{ textAlign: "center" }}>{title}</h2>
    </div>
  );
}

function ContentBox({ children }) {
  return (
    <div
      style={{
        padding: "2px",
        border: "1px solid red",
        margin: "2px",
        color: "gray",
        height: "75vh",
        overflowY: "auto",
      }}
    >
      {children}
    </div>
  );
}

function ListBox({ title, items, style, toggleMark, toggleLike }) {
  return (
    <div style={{ ...style, border: "1px solid gray", width: "30%" }}>
      <div style={{ border: "1px solid green", margin: "5px" }}>
        <TitleBox title={title} />
        <ContentBox>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {items.map((item, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px",
                }}
              >
                <span
                  style={{ flex: 0, textAlign: "center", fontSize: "small" }}
                >
                  {item.id}
                </span>
                <span
                  style={{ marginLeft: "auto", cursor: "pointer" }}
                  onClick={() => toggleMark(index)}
                >
                  {item.marked ? (
                    <AiOutlineCheckSquare
                      style={{ verticalAlign: "middle", flex: 1 }}
                    />
                  ) : (
                    <AiOutlineBorder
                      style={{ verticalAlign: "middle", flex: 1 }}
                    />
                  )}
                </span>
                <img
                  src={item.cover}
                  alt={item.title}
                  style={{ width: "50px", height: "50px", margin: "0 10px" }}
                />
                <div style={{ flex: 2 }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>{item.title}</span>
                    <span style={{ marginLeft: "auto" }}>{item.price} </span>
                    <span
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      onClick={() => toggleLike(index)}
                    >
                      {item.liked ? <AiFillHeart /> : <AiOutlineHeart />}
                    </span>
                  </div>
                  <div>{item.artist}</div>
                </div>
              </li>
            ))}
          </ul>
        </ContentBox>
      </div>
    </div>
  );
}

function FetchButton({ onClick }) {
  return (
    <div>
      <button onClick={onClick} style={{ width: "100px", height: "30px" }}>
        Fetch Songs
      </button>
    </div>
  );
}

function App() {
  const [songs, setSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [plays, setPlays] = useState([]);

  const fetchSongs = async () => {
    const response = await fetch(
      "http://api.itlabpro.io/solo?mykey=ZE1A3QEoQE73C8SnnK4/WNmDD9usbySkoedCbG9N9H0cldhYbVegmFcdOj0Q7Zvd54bN927MiZQ3qqckP5G/5g=="
    );
    const data = await response.json();
    const allSongs = (data.data || []).map((song) => ({
      ...song,
      marked: false, //add marked & liked attribute
      liked: false,
    }));
    setSongs(allSongs);
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
  };

  const toggleMark = (index) => {
    const updatedSongs = [...songs];
    const markedSong = updatedSongs[index];
    markedSong.marked = !markedSong.marked;

    if (markedSong.marked) {
      setPlays((prevPlays) => [...prevPlays, markedSong]);
    } else {
      setPlays((prevPlays) =>
        prevPlays.filter((song) => song.id !== markedSong.id)
      );
    }
    setSongs(updatedSongs);
  };

  const toggleLike = (index) => {
    const updatedSongs = [...songs];
    const likedSong = updatedSongs[index];
    likedSong.liked = !likedSong.liked;

    if (likedSong.liked) {
      setFavorites((prevFavorites) => [...prevFavorites, likedSong]);
    } else {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((song) => song.id !== likedSong.id)
      );
    }

    setSongs(updatedSongs);
  };

  return (
    <div
      style={{ backgroundColor: "black", width: "100%", minHeight: "100vh" }}
    >
      <div style={buttonContainerStyle}>
        <FetchButton onClick={fetchSongs}></FetchButton>
      </div>
      <div style={containerStyle}>
        <ListBox
          title="All List"
          items={songs}
          toggleMark={toggleMark}
          toggleLike={toggleLike}
        />
        <ListBox
          title="Fav List"
          items={favorites}
          toggleMark={toggleMark}
          toggleLike={toggleLike}
        />
        <ListBox
          title="Play List"
          items={plays}
          toggleMark={toggleMark}
          toggleLike={toggleLike}
        />
      </div>
    </div>
  );
}

export default App;
