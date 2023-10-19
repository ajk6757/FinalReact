import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import PlayListButtons from './PlayListButtons';
import {TbPlaylistX} from 'react-icons/tb';
import { changeYourMusicListSelected } from '../redux/musicListSlice';

const MyPlayListContentBar = (props) => {

    const dispatch = useDispatch();
    
    // let myPlayListSongs = useSelector((state) => state.musicElement.myPlayListSongs);
    const {removePlayListSong, playPlayListSong, playInOrder, playShuffle} = props;
    
    // useEffect(()=>{
    //     myPlayListSongs = document.getElementById("myPlayListSongs");
    //     dispatch(elementSetting({
    //         type : "changemyPlayListSongsElement", 
    //         myPlayListSongs : myPlayListSongs
    //     }));
    // },[myPlayListSongs]);
    const myMusicList = useSelector((state)=> state.musicList.myMusicList);
    const yourMusicList = useSelector((state)=> state.musicList.yourMusicList);
    let selectedPlayList = useSelector((state)=> state.musicList.selectedPlayList);

    function namingRule(name){
        let character;
        let charBytes = 0;
        let tempName = "";
        if(name !== null && name !== "" && name !== undefined){
            for(let i = 0; i < name.length; i++){
                character = name.charAt(i);
                if(escape(character).length > 4) charBytes += 2;
                else charBytes += 1.4;
                if(charBytes >= 21) break;
                else tempName += character;
            }
            
            if(charBytes >= 21){
                return tempName + "...";
            }else{
                return tempName;
            }
        }else{
            return "";
        }
    }

    function playSong(kind, selectedPlayList, index){
        dispatch(changeYourMusicListSelected({yourMusicListSelected : false}));
        playPlayListSong(kind, selectedPlayList, index);
    }
    
    return (
        <div id="muzipbar-myPlayListContent">
            <PlayListButtons/>
            <div className="myPlayListBtns">
                <button id="playInOrder" onClick={()=>playInOrder("myMusicList", selectedPlayList)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" fill="black" className="bi bi-play-fill" viewBox="0 0 16 16">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                    </svg> 재생
                </button>
                <button id="playShuffle" onClick={()=>playShuffle("myMusicList", selectedPlayList)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" fill="black" className="bi bi-shuffle" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"/>
                        <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"/>
                    </svg> 셔플재생
                </button>
            </div>
            <div id="myPlayListSongs">
                {
                    myMusicList.length == 0?
                    <div className="myPlayListSong">
                        <div className="playMyPlayListSong">
                            <img/>
                            <p><br/></p>
                        </div>
                    </div>
                    :
                    myMusicList[selectedPlayList] == null || myMusicList[selectedPlayList] == undefined?
                    ""
                    :
                    myMusicList[selectedPlayList].songList.map((item, index) =>
                    <div className="myPlayListSong" key={"myPlayListSongs"+index}>
                        <div className="playMyPlayListSong" onClick={() => {playSong("myMusicList", selectedPlayList, index)}}>
                            <img src={"http://localhost:8082/Muzip" + item.coverPath}/>
                            <p>{namingRule(item.musicTitle)}<br/>{namingRule(item.musicArtist)}</p>
                        </div>
                        <TbPlaylistX size="2vw" onClick={() => removePlayListSong(myMusicList[selectedPlayList].playlistNo, item.musicNo)} className="playListCancel"/>
                    </div>
                    )
                }
            </div>
        </div>
    )
}

export default MyPlayListContentBar;