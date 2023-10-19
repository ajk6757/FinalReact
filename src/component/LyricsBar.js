import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

const LyricsBar = () => {

    const dispatch = useDispatch();
    
    return (
        <div id="muzipbar-lyrics">
            <div className="lyrics-album-cover">
                <img id="lyricsAlbumCover" className="toPlayer" src="resources/icon/앨범커버샘플.png"/>
            </div>
            <div>
                <button className='toSongInfo'>앨범 정보</button>
            </div>
            <div id="lyricsContent">
                <p>
                    나리는 꽃가루에 눈이 따끔해 (아야)<br/>
                    
                </p>
            </div>
            <div id="songInfoContent">
                <p id="songInfoContentTitle">곡명 : 사랑하긴 했었나요 스쳐가는 인연이었나요 짧지않은 우리 함께했던 시간들이 자꾸 내 마음을 가둬두네</p>
                <p id="songInfoContentArtist">아티스트 : 아이유</p>
                <p id="songInfoContentDate">발매일 : 2023.08.28</p>
            </div>
        </div>
    )
}

export default LyricsBar;