import React, { useState } from "react";
import "../main.css";
import "../MyPlayList.css";
import MyPlayListMusicBar from "./MyPlayListMusicBar";
import MyPlayListHeader from "./MyPlayListHeader";
import { useAuth } from "../LoginContext.js";

function MyPlayList({
  onBackToMyPagePlayList,
  playlists,
  selectedPlaylistIndex,
  pageUserData,
}) {
  const selectedPlaylist = playlists[selectedPlaylistIndex];
  const { user } = useAuth();
  if (selectedPlaylist.songList.length === 0) {
    return <div>플레이리스트가 없습니다.</div>;
  }

  return (
    <div className="myplaylist-all">
      <MyPlayListHeader
        selectedPlaylist={selectedPlaylist}
        onBackToMyPagePlayList={onBackToMyPagePlayList}
        pageUserData={pageUserData}
      />
      <div className="myplaylist-body">
        <div className="myplaylist-body-list-area">
          <ul>
            {selectedPlaylist.songList.map((song, index) => (
              <li key={index}>
                <MyPlayListMusicBar
                  yourListIndex={selectedPlaylistIndex}
                  yourSongIndex={index}
                  title={song.musicTitle}
                  artist={song.musicArtist}
                  albumCover={"http://localhost:8082/Muzip" + song.coverPath}
                  index={index}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyPlayList;
