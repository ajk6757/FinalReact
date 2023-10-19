import React from 'react';
import $ from 'jquery';
import axios from 'axios';
import { changeSearchMusicList } from '../redux/musicListSlice';
import { useDispatch } from 'react-redux';

const PlayListButtons = (props) => {

    const dispatch = useDispatch();
    const keyword = document.getElementsByClassName("searchInput");

    function changeMenu1(){$("#muzipbar").css({'width':'17vw','height':'23vw'});};
    function changeMenu2(){$("#muzipbar").css({'width':'18.5vw','height':'24.5vw'});};
    function changeMenu3(){$("#muzipbar").css({'width':'17.5vw','height':'23.5vw'});};
    function changeMenu4(){$("#muzipbar").css({'width':'18vw','height':'24vw'});};
    function changeMenuAuto(){
        changeMenu1();
        setTimeout( () => changeMenu2(),200 );
        setTimeout( () => changeMenu3(),400 );
        setTimeout( () => changeMenu4(),600 );
    };
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

    function searchMusic(){
        changeMenuAuto();
        fadeOutAll();
        for(let i = 0; i < keyword.length; i++){
            if(keyword[i].value !== null && keyword[i].value !== "" && keyword[i].value !== undefined){
                axios.get("http://localhost:3000/Muzip/searchMusic", {
                    params : {
                        keyword : keyword[i].value
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }) // 주소 얻고
                .then(response => {    // 응답성공하면 데이터 세팅
                    let tempArr = [];
                    tempArr[0] = {
                        listName : "검색",
                        songList : response.data
                    };
                    dispatch(changeSearchMusicList({
                        searchMusicList : [...tempArr]
                    }));
                }).catch(console.log); // 아니면 오류 로그찍기
            }
        }

        for(let i = 0; i < keyword.length; i++){
            keyword[i].value = "";
        }
        $("#muzipbar-search").delay(300).fadeIn(600);
    }

    function pressEnter(e){
        if (e.key == "Enter" || e.keyCode == "13"){
            searchMusic();
        }
    }
    
    return (
        <div className="playListButton">
            <svg className="fromListToPlayList bi bi-music-note-list" xmlns="http://www.w3.org/2000/svg" width="1.3vw" height="1.3vw" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z"/>
                <path fillRule="evenodd" d="M12 3v10h-1V3h1z"/>
                <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z"/>
                <path fillRule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"/>
            </svg>
            <svg className="toRecommend bi bi-stars" xmlns="http://www.w3.org/2000/svg" width="1.3vw" height="1.3vw" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
            </svg>
            <input className="searchInput" type="text" onKeyUp={pressEnter}/>
            <svg onClick={searchMusic} className="toListSearch bi bi-search" xmlns="http://www.w3.org/2000/svg" width="1.3vw" height="1.3vw" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <svg className="toPlayer bi bi-play-btn" xmlns="http://www.w3.org/2000/svg" width="1.3vw" height="1.3vw" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
            </svg>
        </div>
    )
}

export default PlayListButtons;