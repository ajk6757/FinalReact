import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";


const MusicPlayerBar = () => {

    const dispatch = useDispatch();
    
    let playStatus = useSelector((state)=>state.musicStatus.playStatus);
    let volumeStatus = useSelector((state)=>state.musicStatus.volumeStatus);
    let repeatStatus = useSelector((state)=>state.musicStatus.repeatStatus);
    
    return (
        <div id="muzipbar-player">
            <div id="muzipbar-player-top">
                <div className="album-cover">
                    <img id="playerAlbumCover" className="toLyrics" src="" />
                </div>
                <div className="playerInfo">
                    <div className="playerTitleBar">
                        <div id="playerSongTitle" className="songTitle">
                            <p>라일락</p>
                        </div>
                        <div id="playerArtist" className="artist">
                            <p>IU</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="myPlayListBtnOuter">
                    <svg id="myPlayListBtn" className="toPlayList bi bi-music-note-list" xmlns="http://www.w3.org/2000/svg" width="1.3vw" height="1.3vw" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z"/>
                    <path fillRule="evenodd" d="M12 3v10h-1V3h1z"/>
                    <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z"/>
                    <path fillRule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    </div>
                </div>
            </div>
            <div id="muzipbar-player-bottom">
                <div className="playerButton">
                    {
                        repeatStatus === true?
                        <svg id="repeatPlayBtn" xmlns="http://www.w3.org/2000/svg" width="1vw" height="1vw" fill="currentColor" className="bi bi-repeat-1" viewBox="0 0 16 16">
                            <path d="M11 4v1.466a.25.25 0 0 0 .41.192l2.36-1.966a.25.25 0 0 0 0-.384l-2.36-1.966a.25.25 0 0 0-.41.192V3H5a5 5 0 0 0-4.48 7.223.5.5 0 0 0 .896-.446A4 4 0 0 1 5 4h6Zm4.48 1.777a.5.5 0 0 0-.896.446A4 4 0 0 1 11 12H5.001v-1.466a.25.25 0 0 0-.41-.192l-2.36 1.966a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192V13h6a5 5 0 0 0 4.48-7.223Z"/>
                            <path d="M9 5.5a.5.5 0 0 0-.854-.354l-1.75 1.75a.5.5 0 1 0 .708.708L8 6.707V10.5a.5.5 0 0 0 1 0v-5Z"/>
                        </svg>
                        :
                        <svg id="repeatPlayBtn" xmlns="http://www.w3.org/2000/svg" width="1vw" height="1vw" fill="currentColor" className="bi bi-repeat" viewBox="0 0 16 16">
                            <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/>
                        </svg>
                        
                    }
                    <svg id="prevMusicBtn" xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" fill="currentColor" className="bi bi-skip-start" viewBox="0 0 16 16">
                        <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.52-.302 1.233.043 1.233.696v7.384c0 .653-.713.998-1.233.696L5 8.752V12a.5.5 0 0 1-1 0V4zm7.5.633L5.696 8l5.804 3.367V4.633z"/>
                    </svg>
                    {
                        playStatus === false ? 
                        <svg id="playMusicBtn" xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                        </svg>
                        :
                        <svg id="playMusicBtn" xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
                            <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                        </svg>
                    }
                    <svg id="nextMusicBtn" xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" fill="currentColor" className="bi bi-skip-end" viewBox="0 0 16 16">
                        <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.713 3.31 4 3.655 4 4.308v7.384c0 .653.713.998 1.233.696L11.5 8.752V12a.5.5 0 0 0 1 0V4zM5 4.633 10.804 8 5 11.367V4.633z"/>
                    </svg>
                    {
                        volumeStatus === 0?
                        <svg id="musicSoundBtn" xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" fill="currentColor" className="bi bi-volume-mute" viewBox="0 0 16 16">
                            <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
                        </svg>
                        : volumeStatus === 1?
                        <svg id="musicSoundBtn" xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" fill="currentColor" className="bi bi-volume-down" viewBox="0 0 16 16">
                            <path d="M9 4a.5.5 0 0 0-.812-.39L5.825 5.5H3.5A.5.5 0 0 0 3 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 9 12V4zM6.312 6.39 8 5.04v5.92L6.312 9.61A.5.5 0 0 0 6 9.5H4v-3h2a.5.5 0 0 0 .312-.11zM12.025 8a4.486 4.486 0 0 1-1.318 3.182L10 10.475A3.489 3.489 0 0 0 11.025 8 3.49 3.49 0 0 0 10 5.525l.707-.707A4.486 4.486 0 0 1 12.025 8z"/>
                        </svg>
                        :
                        <svg id="musicSoundBtn" xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" fill="currentColor" className="bi bi-volume-up" viewBox="0 0 16 16">
                            <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                            <path d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z"/>
                        </svg>
                    }
                    <div id="volumeBar">
                        <div id="currentVolumeBar"></div>
                    </div>
                </div>
                <div className="timeLine">
                    <div id="playerTime">
                        <p id="currentMusicTime">0:00</p>
                        <div id="timeLineBar">
                            <div id="currentTimeLineBar"></div>
                            <audio id="musicPlayer-audio" src=""></audio>
                        </div>
                        <p id="musicDuration">0:00</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MusicPlayerBar;