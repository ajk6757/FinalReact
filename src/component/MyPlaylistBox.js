import React from "react";
import "../mypagePlaylist.css";
import { PiMusicNoteLight } from "react-icons/pi";
import { useAuth } from "../LoginContext.js";

function MyPlaylistBox({ playlist, index, onPlaylistBoxClick, pageUserData }) {
  const handleBoxClick = () => {
    console.log("index:" + index);
    onPlaylistBoxClick(index); // 인덱스를 플레이리스트 클릭 핸들러로 전달
  };
  const { user } = useAuth();
  return (
    <li>
      <div className="mypage-playlist-box" onClick={handleBoxClick}>
        <div className="mypage-playlist-box-info">
          <span className="mypage-playlist-box-title">{playlist.listName}</span>
          <div className="mypage-playlist-box-info-zone">
            <span className="mypage-playlist-box-userId">
              {pageUserData.userId}
            </span>
            <span className="mypage-playlist-box-song-total">
              총 {playlist.songList.length}곡
            </span>
          </div>
        </div>
        <div className="mypage-playlist-box-thumb-area">
          <div className="thumbnail-part">
            {playlist.songList[0] ? (
              playlist.songList[0].coverPath ? (
                <img
                  src={
                    "http://localhost:8082/Muzip" +
                    playlist.songList[0].coverPath
                  }
                  alt="Thumbnail 0"
                />
              ) : (
                <PiMusicNoteLight />
              )
            ) : (
              <PiMusicNoteLight />
            )}
          </div>
          <div className="thumbnail-part">
            {playlist.songList[2] ? (
              playlist.songList[2].coverPath ? (
                <img
                  src={
                    "http://localhost:8082/Muzip" +
                    playlist.songList[2].coverPath
                  }
                  alt="Thumbnail 2"
                />
              ) : (
                <PiMusicNoteLight />
              )
            ) : (
              <PiMusicNoteLight />
            )}
          </div>
          <div className="thumbnail-part">
            {playlist.songList[3] ? (
              playlist.songList[3].coverPath ? (
                <img
                  src={
                    "http://localhost:8082/Muzip" +
                    playlist.songList[3].coverPath
                  }
                  alt="Thumbnail 3"
                />
              ) : (
                <PiMusicNoteLight />
              )
            ) : (
              <PiMusicNoteLight />
            )}
          </div>
          <div className="thumbnail-part">
            {playlist.songList[1] ? (
              playlist.songList[1].coverPath ? (
                <img
                  src={
                    "http://localhost:8082/Muzip" +
                    playlist.songList[1].coverPath
                  }
                  alt="Thumbnail 1"
                />
              ) : (
                <PiMusicNoteLight />
              )
            ) : (
              <PiMusicNoteLight />
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default MyPlaylistBox;
