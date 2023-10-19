import { useDispatch } from "react-redux";
import "../MyPlayList.css";
import { AiFillPlayCircle } from "react-icons/ai";
import {
  changeSelectedYourListIndex,
  changeSelectedYourSongIndex,
  changeYourMusicListSelected,
} from "../redux/musicListSlice";

function MyPlayListMusicBar({
  yourListIndex,
  yourSongIndex,
  title,
  artist,
  albumCover,
  index,
}) {
  const dispatch = useDispatch();

  const handleAddButtonClick = () => {
    console.log("노래 정보:", {
      title: title,
      artist: artist,
    });
  };
  const playMyPageSong = () => {
    //
    dispatch(
      changeSelectedYourListIndex({ selectedYourListIndex: yourListIndex })
    );
    dispatch(
      changeSelectedYourSongIndex({ selectedYourSongIndex: yourSongIndex })
    );
    dispatch(changeYourMusicListSelected({ yourMusicListSelected: true }));
  };
  return (
    <div className="myplaylist-musicbar">
      <div className="myplaylist-musicbar-count">
        <span>{index + 1}.</span>
      </div>
      <div className="musicbar-img-area" onClick={playMyPageSong}>
        <img src={albumCover} alt={title} />
      </div>
      <div className="musicbar-info" onClick={playMyPageSong}>
        <span className="musicbar-title">{title}</span>
        <span className="musicbar-artist">{artist}</span>
      </div>
      <div className="musicbar-add-btn-area">
        <button className="musicbar-add-btn" onClick={playMyPageSong}>
          <AiFillPlayCircle />
        </button>
      </div>
    </div>
  );
}
export default MyPlayListMusicBar;
