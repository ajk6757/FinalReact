import React, { useEffect } from 'react';
import axios from 'axios';
import PlayListButtons from './PlayListButtons';
import { useDispatch, useSelector } from 'react-redux';
import { changeSelectedPlayList, changeMyMusicList } from '../redux/musicListSlice';
import {RiDeleteBinLine} from 'react-icons/ri';

export default function PlayListBar(props) {

    const dispatch = useDispatch();
    const myMusicList = useSelector((state) => state.musicList.myMusicList);
    let selectedPlayList = useSelector((state)=> state.musicList.selectedPlayList);
    const {getMyPlayList, getRecommendList} = props;
    
    // 플레이리스트 선택기능
    function selectPlayList(index){
        selectedPlayList = index;
        dispatch(changeSelectedPlayList({
            selectedPlayList : selectedPlayList
        }));
    }

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

    function deletePlaylist(playlistNo){
        axios.get("http://localhost:3000/Muzip/deletePlaylist", { // delete
            params : {
                playlistNo : playlistNo
            },
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if(response.data === 0) alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
            dispatch(changeMyMusicList({
                myMusicList : [...myMusicList]
            }))
        }).catch(console.log);
        getMyPlayList();
    }

    return (
        <div id="muzipbar-playList">
            <PlayListButtons onClick={getRecommendList}/>
            <div className="PlayListList">
                {
                    myMusicList.length == 0?
                   ""
                    :
                    myMusicList.map((item, index)=>
                        <div className="myPlayList" onClick={() => {selectPlayList(index)}} key={item.listName+index}>
                            {item.songList.length===0?
                            <svg className="bi bi-music-note-list toMyPlayListContent" xmlns="http://www.w3.org/2000/svg" width="3vw" height="3vw" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z"/>
                                <path fillRule="evenodd" d="M12 3v10h-1V3h1z"/>
                                <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z"/>
                                <path fillRule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                            :
                            <img className='toMyPlayListContent' src={"http://localhost:8082/Muzip"+item.songList[0].coverPath}/>}
                            <p className='toMyPlayListContent'>{namingRule(item.listName)}</p>
                            <RiDeleteBinLine className='playlistDelete' onClick={()=>deletePlaylist(item.playlistNo)}/>
                        </div>
                    )
                }
                <div className="myPlayList toAddNewPlayList">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3vw" height="3vw" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    <p>플레이리스트 추가</p>
                </div>
            </div>
        </div>
    )
}