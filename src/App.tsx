import React, { useState } from "react";
import "./App.css";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineCheckSquare,
  AiOutlineBorder,
} from "react-icons/ai";

type Song = {
  id: number;
  title: string;
  artist: string;
  cover: string;
  price: string;
  marked: boolean;
  liked: boolean;
};

type TitleBoxProps = {
  title: string;
};

type ContentBoxProps = {
  children: React.ReactNode;
};

type ListBoxProps = {
  title: string;
  items: Song[];
  style?: React.CSSProperties;
  toggleMark: (index: number) => void;
  toggleLike: (index: number) => void;
};

type FetchButtonProps = {
  onClick: () => void;
};

const TitleBox: React.FC<TitleBoxProps> = ({ title }) => {
  return (
    <div className="title-container">
      <h2 style={{ textAlign: "center" }}>{title}</h2>
    </div>
  );
};

const ContentBox: React.FC<ContentBoxProps> = ({ children }) => {
  return <div className="content-container">{children}</div>;
};

const ListBox: React.FC<ListBoxProps> = ({
  title,
  items,
  style,
  toggleMark,
  toggleLike,
}) => {
  return (
    <div style={{ ...style, border: "1px solid gray", width: "30%" }}>
      <div style={{ border: "1px solid green", margin: "5px" }}>
        <TitleBox title={title} />
        <ContentBox>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {items.map((item, index) => (
              <li key={index} className="li-style">
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
                    <AiOutlineCheckSquare className="likeIconStyle" />
                  ) : (
                    <AiOutlineBorder className="likeIconStyle" />
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
};

const FetchButton: React.FC<FetchButtonProps> = ({ onClick }) => {
  return (
    <div>
      <button onClick={onClick} style={{ width: "100px", height: "30px" }}>
        Fetch Songs
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [plays, setPlays] = useState<Song[]>([]);

  const fetchSongs = async () => {
    const response = await fetch(
      "http://api.itlabpro.io/solo?mykey=ZE1A3QEoQE73C8SnnK4/WNmDD9usbySkoedCbG9N9H0cldhYbVegmFcdOj0Q7Zvd54bN927MiZQ3qqckP5G/5g=="
    );
    const data = await response.json();
    const allSongs = (data.data || []).map((song: Song) => ({
      ...song,
      marked: false, //add marked & liked attribute
      liked: false,
    }));
    setSongs(allSongs);
  };

  const toggleMark = (index: number) => {
    const updatedSongs = [...songs];
    const markedSong: Song = updatedSongs[index];
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

  const toggleLike = (index: number) => {
    const updatedSongs = [...songs];
    const likedSong: Song = updatedSongs[index];
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
    <>
      <div className="button-container">
        <FetchButton onClick={fetchSongs}></FetchButton>
      </div>
      <div className="container">
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
    </>
  );
};

export default App;
