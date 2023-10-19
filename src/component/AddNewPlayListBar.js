import React from 'react';
import PlayListButtons from './PlayListButtons';
import { useDispatch, useSelector } from 'react-redux';
import { changeMyMusicList } from '../redux/musicListSlice';
import axios from 'axios';
import $ from 'jquery';

const AddNewPlayListBar = (props) => {

    const dispatch = useDispatch();
    const myMusicList = useSelector((state)=>state.musicList.myMusicList);
    const {getMyPlayList} = props;
    const searchInput = $(".searchInput");

    function insertPlaylist(){
        const user = JSON.parse(sessionStorage.getItem("user"));
        const newPlayListName = document.getElementById("newPlayListName");
        if(newPlayListName.value !== null || newPlayListName.value !== ""){
            axios.get("http://localhost:3000/Muzip/insertPlaylist", {
                params : {
                    listName : newPlayListName.value,
                    userNo : user.userNo
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if(response.data === 0){
                    alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
                }else{
                    dispatch(changeMyMusicList({
                        myMusicList : [...myMusicList, {listName : newPlayListName.value, songList : []}]
                    }));
                }
            }).catch(console.log);
            newPlayListName.value = "";
        }else{
            alert("플레이리스트 이름을 입력해주세요.");
        }
        getMyPlayList();
    }

    function pressEnter(e){
        if (e.key == "Enter" || e.keyCode == "13"){
            insertPlaylist();
            fadeOutAll();
            $("#muzipbar").css({'height':'25vw'});
            setTimeout( () => {$("#muzipbar").css({'height':'23.5vw'})},200);
            setTimeout( () => {$("#muzipbar").css({'height':'24.5vw'})},400);
            setTimeout( () => {$("#muzipbar").css({'height':'24vw'})},600);
            searchInput.attr("placeholder", "나의 플레이리스트");
            $("#muzipbar-playList").delay(600).fadeIn(600);
            getMyPlayList();
        }
    }
    function fadeOutAll(){
        $("#muzipbar-normal").fadeOut(100);
        $("#muzipbar-player").fadeOut(30);
        $("#muzipbar-lyrics").fadeOut(100);
        $("#muzipbar-playList").fadeOut(100);
        $("#muzipbar-recommend").fadeOut(100);
        $("#muzipbar-addPlayListSong").fadeOut(100);
        $("#muzipbar-myPlayListContent").fadeOut(100);
        $("#muzipbar-addNewPlayList").fadeOut(100);
        $("#muzipbar-search").fadeOut(100);
    };

    return (
        <div id="muzipbar-addNewPlayList">
            <PlayListButtons/>
            <div className="addNewPlayListImg">
                <svg className="bi bi-patch-plus-fill"  xmlns="http://www.w3.org/2000/svg" width="6vw" height="6vw" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zM8.5 6v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 1 0z"/>
                </svg>
            </div>
            <div className="addNewPlayList">
                <input id="newPlayListName" type="text" placeholder="플레이리스트 이름(1~10자)" minLength="1" maxLength="10" onKeyUp={pressEnter}/>
                <svg className="completeAddPlayList bi bi-plus-lg" onClick={()=>insertPlaylist()} xmlns="http://www.w3.org/2000/svg" width="2vw" height="2vw" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
            </div>
        </div>
    )
}

export default AddNewPlayListBar;