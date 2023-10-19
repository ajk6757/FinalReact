import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import PlayListButtons from './PlayListButtons';
import {TbPlaylistAdd} from 'react-icons/tb';
import { changeYourMusicListSelected } from '../redux/musicListSlice';

const RecommendBar = (props) => {

    const dispatch = useDispatch();
    
    const recommendMusicList = useSelector((state) => state.musicList.recommendMusicList);
    const {addPlayListSetting, playPlayListSong} = props;
    
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
        <div id="muzipbar-recommend">
            <PlayListButtons/>
            <div className="recommendOptionDiv">
                <table className="recommendOption">
                    <tbody>
                        <tr>
                            <td><label htmlFor="recommendOption1">추천</label><input type="radio" id="recommendOption1" name="recommendOption" value="recommend"/></td>
                            <td><label htmlFor="recommendOption2">인기</label><input type="radio" id="recommendOption2" name="recommendOption" value="popular"/></td>
                            <td><label htmlFor="recommendOption3">최신</label><input type="radio" id="recommendOption3" name="recommendOption" value="live"/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {
                recommendMusicList.length == 0?
                    <div id="recommendList">
                        <div className="searchSongOne">
                            <div className="playMyPlayListSong">
                                <img src=""/>
                                <p><br/></p>
                            </div>
                        </div>
                    </div>
                :
                recommendMusicList.map((item, index) =>
                    <div id={"recommendList"+index} key={"recommendList"+item.listName}>
                        {
                            item.songList.map((item2, index2)=>
                                <div className="searchSongOne" key={"recommendList"+item.listName+"_"+index2}>
                                    <div className="playMyPlayListSong" onClick={() => playSong("recommendMusicList", index, index2)}>
                                        <img src={"http://localhost:8082/Muzip"+item2.coverPath}/>
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

export default RecommendBar;






