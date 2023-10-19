import React from "react";
import { GrUndo } from "react-icons/gr";
import { PiMusicNoteLight } from "react-icons/pi";

function MyPlayListHeader({
  selectedPlaylist,
  onBackToMyPagePlayList,
  pageUserData,
}) {
  return (
    <div className="myplaylist-header">
      <div className="myplaylist-thumb-area">
        <div className="thumbnail-part">
          {selectedPlaylist.songList[0] ? (
            selectedPlaylist.songList[0].coverPath ? (
              <img
                src={
                  "http://localhost:8082/Muzip" +
                  selectedPlaylist.songList[0].coverPath
                }
                alt="플레이리스트 썸네일 1"
              />
            ) : (
              <PiMusicNoteLight />
            )
          ) : (
            <PiMusicNoteLight />
          )}
        </div>
        <div className="thumbnail-part">
          {selectedPlaylist.songList[2] ? (
            selectedPlaylist.songList[2].coverPath ? (
              <img
                src={
                  "http://localhost:8082/Muzip" +
                  selectedPlaylist.songList[2].coverPath
                }
                alt="플레이리스트 썸네일 2"
              />
            ) : (
              <PiMusicNoteLight />
            )
          ) : (
            <PiMusicNoteLight />
          )}
        </div>
        <div className="thumbnail-part">
          {selectedPlaylist.songList[3] ? (
            selectedPlaylist.songList[3].coverPath ? (
              <img
                src={
                  "http://localhost:8082/Muzip" +
                  selectedPlaylist.songList[3].coverPath
                }
                alt="플레이리스트 썸네일 3"
              />
            ) : (
              <PiMusicNoteLight />
            )
          ) : (
            <PiMusicNoteLight />
          )}
        </div>
        <div className="thumbnail-part">
          {selectedPlaylist.songList[1] ? (
            selectedPlaylist.songList[1].coverPath ? (
              <img
                src={
                  "http://localhost:8082/Muzip" +
                  selectedPlaylist.songList[1].coverPath
                }
                alt="플레이리스트 썸네일 4"
              />
            ) : (
              <PiMusicNoteLight />
            )
          ) : (
            <PiMusicNoteLight />
          )}
        </div>
      </div>
      <div className="myplaylist-info">
        <span className="mymyplaylist-title">{selectedPlaylist.listName}</span>
        <span className="mypage-playlist-box-userId">
          {pageUserData.userId}
        </span>
        <span className="mypage-playlist-box-song-total">
          총 {selectedPlaylist.songList.length}곡
        </span>
      </div>
      <button
        className="myplaylist-goback-btn"
        onClick={onBackToMyPagePlayList}
      >
        <GrUndo />
      </button>
    </div>
  );
}

export default MyPlayListHeader;
