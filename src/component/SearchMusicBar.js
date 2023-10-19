import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import PlayListButtons from './PlayListButtons';
import {TbPlaylistAdd} from 'react-icons/tb';
import { changeYourMusicListSelected } from '../redux/musicListSlice';

const SearchMusicBar = (props) => {

    const dispatch = useDispatch();
    const { playPlayListSong, addPlayListSetting} = props;
    
    const searchMusicList = useSelector((state) => state.musicList.searchMusicList);
    
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

    // 검색곡 재생 / 추가 
    return (
        <div id="muzipbar-search">
            <PlayListButtons/>
            {
                searchMusicList.map((item, index) =>
                    <div id={"searchList"+index} key={"searchList"+item.listName}>
                        {
                            item.songList.map((item2, index2)=>
                                
                                <div className="searchSongOne" key={"searchList"+item.listName+"_"+index2}>
                                    <div className="playMyPlayListSong" onClick={() => playSong("searchMusicList", index, index2)}>
                                        <img src={"http://localhost:8082/Muzip" + item2.coverPath}/>
                                        <p>{namingRule(item2.musicTitle)}<br/>{namingRule(item2.musicArtist)}</p>
                                    </div>
                                    <TbPlaylistAdd onClick={() => addPlayListSetting(item2.musicNo)} className="toAddPlayListSong" size="2vw"/>
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default SearchMusicBar;






