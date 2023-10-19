import React from "react";
import "../mypagePlaylist.css";
import MyPlaylistBox from "./MyPlaylistBox";
import { useAuth } from "../LoginContext.js";

function MypageMyPlaylist({ playlists, onPlaylistBoxClick, pageUserData }) {
  const { user } = useAuth();

  return (
    <div className="mypage-playlist-body">
      <div className="mypage-playlist-content">
        <ul>
          {playlists && playlists.length > 0 ? (
            playlists.map((playlist, index) => (
              <MyPlaylistBox
                key={index}
                playlist={playlist} // playlist 정보를 props로 전달
                onPlaylistBoxClick={() => onPlaylistBoxClick(index)}
                pageUserData={pageUserData}
              />
            ))
          ) : (
            <li id="noPlayList">플레이리스트가 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default MypageMyPlaylist;
