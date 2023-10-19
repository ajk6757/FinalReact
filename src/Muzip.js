import $ from 'jquery';
import './muzipFnc/animation.js';
import NormalBar from "./component/NormalBar";
import MusicPlayerBar from "./component/MusicPlayerBar";
import PlayListBar from "./component/PlayListBar";
import {useDispatch, useSelector} from 'react-redux';
import LyricsBar from "./component/LyricsBar";
import RecommendBar from "./component/RecommendBar";
import MyPlayListContentBar from "./component/myPlayListContentBar";
import AddPlayListSongBar from "./component/AddPlayListSongBar";
import AddNewPlayListBar from "./component/AddNewPlayListBar";
import {incrementMusicListIndex, decrementMusicListIndex,
    incrementShuffleIndex, decrementShuffleIndex,
    zeroMusicListIndex, zeroShuffleIndex,
    lastRecommendMusicListIndex, lastMyMusicListIndex,
    lastSearchMusicList, lastShuffleIndex, lastYourMusicList,
    changeMusicListIndex, changeShuffleIndex,
    changeMusicList, changeRandomArr, deleteMusicList, 
    changeListKind, changeListIndex, changeMyMusicList, 
    changeRecommendMusicList,
    changeYourMusicList,
    changeYourMusicListSelected,
    lastMyPageBgm,
    lastFeedMusicList,
    changeFeedMusicListSelected} from "./redux/musicListSlice";
import { useEffect, useState, useCallback, useRef } from 'react';
import { iconStatus, changeInitialPlayStatus, changeCurrentPlayTimeStatus,
    changeCurrentMusicListKind, changeCurrentMusicListIndex, 
    changeCurrentMusicIndex, changeCurrentMusicVolume } from './redux/musicStatusSlice.js';
import SearchMusicBar from './component/SearchMusicBar.js';
import axios from "axios";
import { useAuth } from './LoginContext';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Muzip = () => {
    
    const dispatch = useDispatch();
    const hostUrl = "http://localhost:8082/Muzip";
    const recommendMusicList = useSelector((state)=>state.musicList.recommendMusicList);
    const myMusicList = useSelector((state)=>state.musicList.myMusicList);
    const searchMusicList = useSelector((state)=>state.musicList.searchMusicList);
    const yourMusicList = useSelector((state)=>state.musicList.yourMusicList);
    const feedMusicList = useSelector((state)=>state.musicList.feedMusicList);
    let randomArr = useSelector((state)=>state.musicList.randomArr);
    let listKind = useSelector((state)=> state.musicList.listKind);
    let listIndex = useSelector((state)=> state.musicList.listIndex);
    let musicListIndex = useSelector((state)=>state.musicList.musicListIndex);
    let shuffleIndex = useSelector((state)=>state.musicList.shuffleIndex);
    let playStatus = useSelector((state)=>state.musicStatus.playStatus);
    let volumeStatus = useSelector((state)=>state.musicStatus.volumeStatus);
    let repeatStatus = useSelector((state)=>state.musicStatus.repeatStatus);
    const initialPlayStatus = useSelector((state)=>state.musicStatus.initialPlayStatus);
    const currentPlayTimeStatus = useSelector((state)=>state.musicStatus.currentPlayTimeStatus);
    const currentMusicListKind = useSelector((state)=>state.musicStatus.currentMusicListKind);
    const currentMusicListIndex = useSelector((state)=>state.musicStatus.currentMusicListIndex);
    const currentMusicIndex = useSelector((state)=>state.musicStatus.currentMusicIndex);
    const currentMusicVolume = useSelector((state)=>state.musicStatus.currentMusicVolume);
    const bgmNo = useSelector((state)=>state.musicList.bgmNo);
    const myPageBgm = useSelector((state)=>state.musicList.myPageBgm);
    const yourMusicListSelected = useSelector((state)=>state.musicList.yourMusicListSelected);
    const selectedYourListIndex = useSelector((state)=>state.musicList.selectedYourListIndex);
    const selectedYourSongIndex = useSelector((state)=>state.musicList.selectedYourSongIndex);
    const feedMusicListSelected = useSelector((state)=>state.musicList.feedMusicListSelected);
    const selectedFeedListIndex = useSelector((state)=>state.musicList.selectedFeedListIndex);
    const selectedFeedSongIndex = useSelector((state)=>state.musicList.selectedFeedSongIndex);
    let user = JSON.parse(sessionStorage.getItem("user"));

    const init = async () => {
        await getMyPlayList();
        await getRecommendList();
        setSessionItems();
        onloadSetting();
        setIsLoaded(true);
    }

    const setSessionItems = () => {
        sessionStorage.setItem("playStatus", playStatus);
        sessionStorage.setItem("currentPlayTimeStatus", currentPlayTimeStatus);
        sessionStorage.setItem("currentMusicListKind", currentMusicListKind);
        sessionStorage.setItem("currentMusicListIndex", currentMusicListIndex);
        sessionStorage.setItem("currentMusicIndex", currentMusicIndex);
        sessionStorage.setItem("currentMusicVolume", currentMusicVolume);
        sessionStorage.setItem("recommendMusicList", JSON.stringify(recommendMusicList));
        sessionStorage.setItem("myMusicList", JSON.stringify(myMusicList));
        sessionStorage.setItem("searchMusicList", JSON.stringify(searchMusicList));
        sessionStorage.setItem("yourMusicList", JSON.stringify(yourMusicList));
        sessionStorage.setItem("myPageBgm", JSON.stringify(myPageBgm));
        sessionStorage.setItem("feedMusicList", JSON.stringify(feedMusicList));
    }
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if (!isLoaded){ // 최초 한번만 실행
            init();
            // getRecommendList();
            // getMyPlayList();
            // sessionStorage.setItem("playStatus", playStatus);
            // sessionStorage.setItem("currentPlayTimeStatus", currentPlayTimeStatus);
            // sessionStorage.setItem("currentMusicListKind", currentMusicListKind);
            // sessionStorage.setItem("currentMusicListIndex", currentMusicListIndex);
            // sessionStorage.setItem("currentMusicIndex", currentMusicIndex);
            // sessionStorage.setItem("currentMusicVolume", currentMusicVolume);
            // sessionStorage.setItem("recommendMusicList", JSON.stringify(recommendMusicList));
            // sessionStorage.setItem("myMusicList", JSON.stringify(myMusicList));
            // sessionStorage.setItem("searchMusicList", JSON.stringify(searchMusicList));
            // sessionStorage.setItem("yourMusicList", JSON.stringify(yourMusicList));
            // sessionStorage.setItem("myPageBgm", JSON.stringify(myPageBgm));
            // sessionStorage.setItem("feedMusicList", JSON.stringify(feedMusicList));
            // setIsLoaded(true);
            // onloadSetting();
        }
    },[isLoaded]);

    // 현재 재생중인 음악의 정보 세션에 저장
    useEffect(()=>{        
        sessionStorage.setItem("currentMusicListKind", currentMusicListKind);
        sessionStorage.setItem("currentMusicListIndex", currentMusicListIndex);
        sessionStorage.setItem("currentMusicIndex", currentMusicIndex);        
    },[currentMusicListKind, currentMusicListIndex, currentMusicIndex]);
    useEffect(()=>{
        sessionStorage.setItem("playStatus", playStatus);
        sessionStorage.setItem("initialPlayStatus", initialPlayStatus);
    },[playStatus, initialPlayStatus])
    useEffect(()=>{
        sessionStorage.setItem("currentMusicVolume", currentMusicVolume);
    },[currentMusicVolume])
    useEffect(()=>{
        sessionStorage.setItem("searchMusicList", JSON.stringify(searchMusicList));
    },[searchMusicList])
    useEffect(()=>{
        sessionStorage.setItem("yourMusicList", JSON.stringify(yourMusicList));
    },[yourMusicList])
    
    // 브라우저 실행시 음악 가져오기
    function onloadSetting(){
        let ips = sessionStorage.getItem("initialPlayStatus");
        let cpt = sessionStorage.getItem("currentPlayTimeStatus");
        let cmlk = sessionStorage.getItem("currentMusicListKind");
        let cmli = sessionStorage.getItem("currentMusicListIndex");
        let cmi = sessionStorage.getItem("currentMusicIndex");
        let cmv = sessionStorage.getItem("currentMusicVolume");

        $("#musicPlayer-audio").prop("volume", `${cmv}`);
        dispatch(changeCurrentMusicVolume(cmv));
        volumeIconSet();

        if(ips == 1){
            pickMusic(cmlk, cmli, cmi);
            $("#musicPlayer-audio").prop("currentTime", `${cpt}`);
            playMusic();
        }else{
            pickMusic(cmlk, cmli, cmi);
            $("#musicPlayer-audio").prop("currentTime", `${cpt}`);
        }
    };
    
    // 긴 이름 줄이기
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
    // 음악 선택 기능
    function pickMusic(lKind, lIndex, mIndex){

        if(lKind === ""){
            dispatch(changeCurrentMusicListKind("myMusicList"));
        }else{
            dispatch(changeCurrentMusicListKind(lKind));
        }
        dispatch(changeCurrentMusicListIndex(lIndex));
        dispatch(changeCurrentMusicIndex(mIndex));

        
        if (lKind === "recommendMusicList") {
            const song = recommendMusicList.length !== 0 && recommendMusicList[lIndex].songList.length !== 0
                ? recommendMusicList[lIndex].songList[mIndex]
                : undefined;
            yesPickMusic(song);
        } else if (lKind === "myMusicList" || lKind === "") {
            const song = myMusicList.length !== 0 && myMusicList[lIndex].songList.length !== 0
                ? myMusicList[lIndex].songList[mIndex]
                : undefined;
            yesPickMusic(song);
        } else if (lKind === "searchMusicList") {
            const song = searchMusicList.length !== 0 && searchMusicList[lIndex].songList.length !== 0
                ? searchMusicList[lIndex].songList[mIndex]
                : undefined;
            yesPickMusic(song);
        } else if (lKind === "yourMusicList") {
            const song = yourMusicList.length !== 0 && yourMusicList[lIndex].songList.length !== 0
                ? yourMusicList[lIndex].songList[mIndex]
                : undefined;
            yesPickMusic(song);
        } else if (lKind === "myPageBgm") {
            const song = myPageBgm.length !== 0 && myPageBgm[lIndex].songList.length !== 0
                ? myPageBgm[lIndex].songList[mIndex]
                : undefined;
            yesPickMusic(song);
        } else if (lKind === "feedMusicList") {
            const song = feedMusicList.length !== 0 && feedMusicList[lIndex].songList.length !== 0
                ? feedMusicList[lIndex].songList[mIndex]
                : undefined;
            yesPickMusic(song);
        }
    };
    function yesPickMusic(song) {
        if (song !== undefined) {
            $("#playerSongTitle").html(`<p>${namingRule(song.musicTitle)}</p>`);
            $("#playerArtist").html(`<p>${song.musicArtist}</p>`);
            $("#musicPlayer-audio").attr("src", `${hostUrl}${song.musicPath}`);
            $("#playerAlbumCover").attr("src", `${hostUrl}${song.coverPath}`);
            $("#lyricsAlbumCover").attr("src", `${hostUrl}${song.coverPath}`);
            $("#lyricsContent>p").html(`${song.musicLyrics}`);
            $("#songInfoContentTitle").html(`곡명 : ${song.musicTitle}`);
            $("#songInfoContentArtist").html(`아티스트 : ${song.musicArtist}`);
            $("#songInfoContentDate").html(`발매일 : ${song.enrollDate}`);
            const musicNo = song.musicNo;
            countUp(musicNo);
        } else {
            nonePickMusic();
        }
    }
    function nonePickMusic(){
        $("#playerSongTitle").html(`<p>선택한 곡이 없습니다</p>`);
        $("#playerArtist").html(`<p></p>`);
        $("#musicPlayer-audio").attr("src", ""); 
        $("#normal-soundbar-image").attr("src", `${hostUrl}/resources/image/stopsound.png`);
        $("#playerAlbumCover").attr("src", `${hostUrl}/resources/image/앨범커버샘플.png`);
        $("#lyricsAlbumCover").attr("src", `${hostUrl}/resources/image/앨범커버샘플.png`);
        $("#lyricsContent>p").html(`선택한 곡이 없습니다`);
        $("#songInfoContentTitle").html(`곡명 : 선택한 곡이 없습니다`);
        $("#songInfoContentArtist").html(`아티스트 : 선택한 곡이 없습니다`);
        $("#songInfoContentDate").html(`발매일 : 선택한 곡이 없습니다`);
        $("#musicPlayer-audio").prop("currentTime", 0);
        $("#currentMusicTime").text("0:00");
        pauseMusic();
    };

    const [cookies, setCookie, removeCookie] = useCookies();
    // 음악 조회수 증가 기능
    const countUp = (musicNo) => {
        const cloneCookie = cookies;
        const keys = "playedMusicNo_"+musicNo
        const isTrue = cloneCookie[keys];
        if(isTrue != "true" && isTrue != true){
            increaseCount(musicNo);
        }
    }
    function increaseCount(musicNo){
        axios.get("http://localhost:3000/Muzip/increaseCount", {
            params : {
                musicNo : musicNo
            },
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if(response == null || response == undefined) alert("잠시 후 다시 시도해주세요.");
            handleCookies(musicNo);
        })
        .catch(console.log);
    }
    function handleCookies(musicNo){
        const expireDate = new Date();
        expireDate.setMinutes(expireDate.getMinutes() + 55); // 55분
        setCookie(
            'playedMusicNo_'+musicNo,
            true,
            {
                path: '/',
                expires: expireDate,
            }
        )
    }
    
    // 음악 재생/일시정지 설정
    function playMusic(){
        const music = document.getElementById("musicPlayer-audio");
        var playPromise = music.play();
        if (playPromise !== undefined) { playPromise.then((_) => {}).catch((error) => {}); }
        $("#muzipbar-player").removeClass("played");
        $("#normal-soundbar-image").attr("src", `${hostUrl}/resources/image/wavesound.gif`);
        dispatch(iconStatus({
            type : "changePlayStatus",
            playStatus : true
        }));
        dispatch(changeInitialPlayStatus(1));
    };
    function pauseMusic(){
        const music = document.getElementById("musicPlayer-audio");
        music.pause();
        $("#muzipbar-player").addClass("played");
        $("#normal-soundbar-image").attr("src", `${hostUrl}/resources/image/stopsound.png`);
        dispatch(iconStatus({
            type : "changePlayStatus",
            playStatus : false
        }));
        dispatch(changeInitialPlayStatus(0));
    };
    // 음악재생 버튼 이벤트부여
    function playMusicBtnFnc(){
        const isPlayed = $("#muzipbar-player").hasClass("played");
        isPlayed ? playMusic() : pauseMusic();
    };
    useEffect(()=>{
        $("#playMusicBtn").on("click", playMusicBtnFnc);
        return () => {$("#playMusicBtn").off("click", playMusicBtnFnc);}
    });

    let tempIndex = Number(musicListIndex);
    let tempShuffleIndex = Number(shuffleIndex);
    let tempListKind = listKind;
    let tempListIndex = Number(listIndex);
    // 다음곡, 이전곡
    function nextMusic(){
        if(!$("#muzipbar-player").hasClass("shuffle")){
            // 순차재생
            dispatch(incrementMusicListIndex());
            tempIndex++;
        }else{
            // 셔플재생
            dispatch(incrementShuffleIndex());
            tempShuffleIndex++;
        }
        nextMusic2();
        nextMusic3();
    };
    const nextMusic2 = useCallback(() => {
        if(tempListKind == "recommendMusicList"){
            if(!$("#muzipbar-player").hasClass("shuffle")){
                // 순차재생
                if(musicListIndex > recommendMusicList[tempListIndex].songList.length-1) dispatch(zeroMusicListIndex());
                if(tempIndex > recommendMusicList[tempListIndex].songList.length-1) tempIndex = 0;
                if(musicListIndex < 0) dispatch(lastRecommendMusicListIndex(listIndex));
                if(tempIndex < 0) tempIndex = recommendMusicList[tempListIndex].songList.length -1;
                if(listKind === ""){
                    dispatch(changeCurrentMusicListKind("myMusicList"));
                }else{
                    dispatch(changeCurrentMusicListKind(listKind));
                }
                dispatch(changeCurrentMusicListIndex(listIndex));
                dispatch(changeCurrentMusicIndex(parseInt(tempIndex)));
            }
        }else if(tempListKind == "myMusicList"){
            if(!$("#muzipbar-player").hasClass("shuffle")){
                // 순차재생
                if(musicListIndex > myMusicList[tempListIndex].songList.length-1) dispatch(zeroMusicListIndex());
                if(tempIndex > myMusicList[tempListIndex].songList.length-1) tempIndex = 0;
                if(musicListIndex < 0) dispatch(lastMyMusicListIndex(listIndex));
                if(tempIndex < 0) tempIndex = myMusicList[tempListIndex].songList.length -1;
                if(listKind === ""){
                    dispatch(changeCurrentMusicListKind("myMusicList"));
                }else{
                    dispatch(changeCurrentMusicListKind(listKind));
                }
                dispatch(changeCurrentMusicListIndex(listIndex));
                dispatch(changeCurrentMusicIndex(parseInt(tempIndex)));
            }else{
                // 셔플재생
                if(shuffleIndex > myMusicList[tempListIndex].songList.length-1) dispatch(zeroShuffleIndex());
                if(tempShuffleIndex > myMusicList[tempListIndex].songList.length-1) tempShuffleIndex = 0;
                if(shuffleIndex < 0) dispatch(lastShuffleIndex(listIndex));
                if(tempShuffleIndex < 0) tempShuffleIndex = myMusicList[tempListIndex].songList.length -1;
                if(listKind === ""){
                    dispatch(changeCurrentMusicListKind("myMusicList"));
                }else{
                    dispatch(changeCurrentMusicListKind(listKind));
                }
                dispatch(changeCurrentMusicListIndex(listIndex));
                dispatch(changeCurrentMusicIndex(parseInt(tempIndex)));
            }
        }else if(tempListKind == "searchMusicList"){
            if(!$("#muzipbar-player").hasClass("shuffle")){
                // 순차재생
                if(musicListIndex > searchMusicList[tempListIndex].songList.length-1) dispatch(zeroMusicListIndex());
                if(tempIndex > searchMusicList[tempListIndex].songList.length-1) tempIndex = 0;
                if(musicListIndex < 0) dispatch(lastSearchMusicList(listIndex));
                if(tempIndex < 0) tempIndex = searchMusicList[tempListIndex].songList.length -1;
                if(listKind === ""){
                    dispatch(changeCurrentMusicListKind("searchMusicList"));
                }else{
                    dispatch(changeCurrentMusicListKind(listKind));
                }
                dispatch(changeCurrentMusicListIndex(listIndex));
                dispatch(changeCurrentMusicIndex(parseInt(tempIndex)));
            }
        }else if(tempListKind == "yourMusicList"){
            if(!$("#muzipbar-player").hasClass("shuffle")){
                // 순차재생
                if(musicListIndex > yourMusicList[tempListIndex].songList.length-1) dispatch(zeroMusicListIndex());
                if(tempIndex > yourMusicList[tempListIndex].songList.length-1) tempIndex = 0;
                if(musicListIndex < 0) dispatch(lastYourMusicList(listIndex));
                if(tempIndex < 0) tempIndex = yourMusicList[tempListIndex].songList.length -1;
                if(listKind === ""){
                    dispatch(changeCurrentMusicListKind("yourMusicList"));
                }else{
                    dispatch(changeCurrentMusicListKind(listKind));
                }
                dispatch(changeCurrentMusicListIndex(listIndex));
                dispatch(changeCurrentMusicIndex(parseInt(tempIndex)));
            }
        }else if(tempListKind == "myPageBgm"){
            if(!$("#muzipbar-player").hasClass("shuffle")){
                // 순차재생
                if(musicListIndex > myPageBgm[tempListIndex].songList.length-1) dispatch(zeroMusicListIndex());
                if(tempIndex > myPageBgm[tempListIndex].songList.length-1) tempIndex = 0;
                if(musicListIndex < 0) dispatch(lastMyPageBgm(listIndex));
                if(tempIndex < 0) tempIndex = myPageBgm[tempListIndex].songList.length -1;
                if(listKind === ""){
                    dispatch(changeCurrentMusicListKind("myPageBgm"));
                }else{
                    dispatch(changeCurrentMusicListKind(listKind));
                }
                dispatch(changeCurrentMusicListIndex(listIndex));
                dispatch(changeCurrentMusicIndex(parseInt(tempIndex)));
            }
        }else if(tempListKind == "feedMusicList"){
            if(!$("#muzipbar-player").hasClass("shuffle")){
                // 순차재생
                if(musicListIndex > feedMusicList[tempListIndex].songList.length-1) dispatch(zeroMusicListIndex());
                if(tempIndex > feedMusicList[tempListIndex].songList.length-1) tempIndex = 0;
                if(musicListIndex < 0) dispatch(lastFeedMusicList(listIndex));
                if(tempIndex < 0) tempIndex = feedMusicList[tempListIndex].songList.length -1;
                if(listKind === ""){
                    dispatch(changeCurrentMusicListKind("feedMusicList"));
                }else{
                    dispatch(changeCurrentMusicListKind(listKind));
                }
                dispatch(changeCurrentMusicListIndex(listIndex));
                dispatch(changeCurrentMusicIndex(parseInt(tempIndex)));
            }
        }
    });
    const nextMusic3 = useCallback(() => {
        if(!$("#muzipbar-player").hasClass("shuffle")){
            // 순차재생
            pickMusic(listKind, listIndex, parseInt(tempIndex));
            if(initialPlayStatus == 1){
                playMusic();
            }else{
                pauseMusic();
            }
        }else{
            // 셔플재생
            if(listKind === ""){
                dispatch(changeCurrentMusicListKind("myMusicList"));
            }else{
                dispatch(changeCurrentMusicListKind(listKind));
            }
            dispatch(changeCurrentMusicListIndex(listIndex));
            dispatch(changeCurrentMusicIndex(parseInt(randomArr[tempShuffleIndex])));
            pickMusic(listKind, listIndex, parseInt(randomArr[tempShuffleIndex]));
            if(initialPlayStatus == 1){
                playMusic();
            }else{
                pauseMusic();
            }
        }
    });
    
    function prevMusic(){
        if(!$("#muzipbar-player").hasClass("shuffle")){
            // 순차재생
            dispatch(decrementMusicListIndex());
            tempIndex--;
        }else{
            // 셔플재생
            dispatch(decrementShuffleIndex());
            tempShuffleIndex--;
        }
        nextMusic2();
        nextMusic3();
    };
    // 다음곡 이전곡 이벤트 부여
    useEffect(() => {
        $("#nextMusicBtn").on("click", nextMusic);
        $("#prevMusicBtn").on("click", prevMusic);
        return ()=>{
            $("#nextMusicBtn").off("click", nextMusic);
            $("#prevMusicBtn").off("click", prevMusic);
        }
    },[listKind, listIndex, musicListIndex,shuffleIndex]);

    // 음악 타임라인
    function timeLineUpdate(e){
        // 타임라인바 진행상황
        let currentTime = e.target.currentTime;
        if(currentTime > 60){
            user = JSON.parse(sessionStorage.getItem("user"));
            if(user.membershipNo == 1){
                $("#musicPlayer-audio").prop("currentTime", 0);
                alert("일반회원은 1분 미리듣기만 가능합니다.");
            }
        }
        dispatch(changeCurrentPlayTimeStatus(currentTime));
        sessionStorage.setItem("currentPlayTimeStatus", currentPlayTimeStatus);
        const duration = e.target.duration;
        let timeLinePercent = (currentTime/duration);
        $("#currentTimeLineBar").css("width", `${timeLinePercent * 10.7}vw`);
        // 현재음악의 현재 음악길이
        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);
        if(currentSec < 10) currentSec = `0${currentSec}`;
        $("#currentMusicTime").text(`${currentMin}:${currentSec}`);
    };
    // timeupdate 최적화를 위해 throttle 사용 (너무 빈번하게 실행되지 않게 해줌)
    let lastCall = 0;
    function throttle(callback, delay) { // lastCall을 현재 시간과 비교하여 지정간격보다 클때만 실행
        return function () {
            const now = Date.now();
            if (now - lastCall >= delay) {
                callback.apply(this, arguments);
                lastCall = now;
            }
        };
    }
    const throttledTimeUpdate = throttle(function (e) {
        timeLineUpdate(e);
    }, 900); // 0.9초마다 한 번씩만 호출
    
    useEffect(()=>{
        $("#musicPlayer-audio").on("timeupdate", (e) => {throttledTimeUpdate(e)});
        return () => {
            $("#musicPlayer-audio").off("timeupdate", (e) => {throttledTimeUpdate(e)});
        }
    },[]);

    // 타임라인바 클릭시 시간 이동
    function timeLineControll(e){
        if($("#playerAlbumCover").attr("src") != `${hostUrl}/resources/image/앨범커버샘플.png`){
            const currentWidth = e.offsetX;
            const totalWidth = $("#timeLineBar").prop("offsetWidth");
            const timeLinePercent = (currentWidth / totalWidth);
            let curTime = Math.floor($("#musicPlayer-audio").prop("duration")) * timeLinePercent;
            $("#musicPlayer-audio").prop("currentTime", `${curTime}`);
            $("#currentTimeLineBar").css("width", `${timeLinePercent*10.7}vw`);
            dispatch(changeCurrentPlayTimeStatus(curTime));
        }
    };
    useEffect(()=>{
        $("#timeLineBar").on("click", (e) => {timeLineControll(e)});
        return () => {
            $("#timeLineBar").off("click", (e) => {timeLineControll(e)});
        }
    },[]);

    // 현재음악의 전체 음악길이
    function musicTimeCalc(){
        let audioDuration = $("#musicPlayer-audio").prop("duration");
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10) totalSec = `0${totalSec}`; // 9초 -> 09초
        $("#musicDuration").text(`${totalMin}:${totalSec}`);
    };
    useEffect(() => {
        $("#musicPlayer-audio").on("loadeddata", musicTimeCalc);
        return ()=>{
            $("#musicPlayer-audio").off("loadeddata", musicTimeCalc);
        }
    },[]);

    // 소리조절 기능
    function volumeIconSet(){
        if($("#musicPlayer-audio").prop("volume") < 0.1){
            $("#musicPlayer-audio").prop("volume", 0);
            $("#currentVolumeBar").css("width", "0vw");
            volumeStatus = 0;
            dispatch(iconStatus({
                type : "changeVolumeStatus",
                volumeStatus : volumeStatus
            }));
        } else if($("#musicPlayer-audio").prop("volume") <= 0.5){
            volumeStatus = 1;
            dispatch(iconStatus({
                type : "changeVolumeStatus",
                volumeStatus : volumeStatus
            }));
        } else{
            volumeStatus = 2;
            dispatch(iconStatus({
                type : "changeVolumeStatus",
                volumeStatus : volumeStatus
            }));
        }
    }
    function volumeControll(e){
        const currentWidth = e.offsetX;
        const totalWidth = $("#volumeBar").prop("offsetWidth");
        const volumePercent = (currentWidth / totalWidth);
        $("#musicPlayer-audio").prop("volume", `${volumePercent}`);
        $("#currentVolumeBar").css("width", `${volumePercent*3.1}vw`);
        dispatch(changeCurrentMusicVolume(volumePercent));
        volumeIconSet();
    };
    useEffect(() => {
        $("#volumeBar").on("click", (e) => {volumeControll(e)});
        return ()=>{
            $("#volumeBar").off("click", (e) => {volumeControll(e)});
        }
    },[]);

    // 볼륨바 출현 ON OFF
    function volumeBarControll(){
        $("#currentVolumeBar").css("width", `${$("#musicPlayer-audio").prop("volume")*3.1}vw`);
        $("#volumeBar").fadeToggle(200);
    };
    useEffect(() => {
        $("#musicSoundBtn").on("click", volumeBarControll);
        return ()=>{
            $("#musicSoundBtn").off("click", volumeBarControll);
        }
    },[]);


    // 반복 재생 설정 버튼
    function repeatPlayBtnFnc(){
        if($("#muzipbar-player").hasClass("repeat")){
            $("#muzipbar-player").removeClass("repeat");
            repeatStatus = false;
            dispatch(iconStatus({
                type : "changeRepeatStatus",
                repeatStatus : repeatStatus
            }));
        }else{
            $("#muzipbar-player").addClass("repeat");
            repeatStatus = true;
            dispatch(iconStatus({
                type : "changeRepeatStatus",
                repeatStatus : repeatStatus
            }));
        }
    };
    useEffect(() => {
        $("#repeatPlayBtn").on("click", repeatPlayBtnFnc);
        return ()=>{
            $("#repeatPlayBtn").off("click", repeatPlayBtnFnc);
        }
    },[]);
    

    // 음악 끝나고 반복or다음곡 재생
    function musicEnded(){
        if($("#muzipbar-player").hasClass("repeat") && $("#muzipbar-player").hasClass("shuffle")){
            pickMusic(listKind, listIndex, randomArr[shuffleIndex]);
            playMusic();
        }else if($("#muzipbar-player").hasClass("repeat")){
            pickMusic(listKind, listIndex, musicListIndex);
            playMusic();
        }else if($("#muzipbar-player").hasClass("shuffle")){
            dispatch(incrementShuffleIndex());
            if(shuffleIndex === (listKind==="recommendMusicList"? recommendMusicList[listIndex].songList.length : (listKind==="myMusicList"? myMusicList[listIndex].songList.length : myMusicList[listIndex].songList.length))) dispatch(zeroShuffleIndex());
            pickMusic(listKind, listIndex, randomArr[shuffleIndex]);
            playMusic();
        }else{
            nextMusic();
        }
    };
    useEffect(() => {
        $("#musicPlayer-audio").on("ended", musicEnded);
        return ()=>{
            $("#musicPlayer-audio").off("ended", musicEnded);
        }
    });

    // 내플리 OR 추천플리 재생
    function playPlayListSong(lKind, lIndex, mIndex){
        $("#muzipbar-player").removeClass("shuffle");
        musicListIndex = mIndex;
        listKind = lKind;
        listIndex = lIndex;
        dispatch(changeMusicListIndex({musicListIndex : musicListIndex}));
        dispatch(changeListKind({listKind : listKind}));
        dispatch(changeListIndex({listIndex : listIndex}));
        pickMusic(lKind, lIndex, mIndex);
        playMusic();
        $("#muzipbar-player").removeClass("repeat");
        repeatStatus = false;
        dispatch(iconStatus({
            type : "changeRepeatStatus",
            repeatStatus : repeatStatus
        }));
    };
    // 마이페이지 플리 재생
    useEffect(()=>{
        if(yourMusicListSelected == true || yourMusicListSelected == "true"){
            playPlayListSong("yourMusicList", selectedYourListIndex, selectedYourSongIndex);
            dispatch(changeYourMusicListSelected({yourMusicListSelected : false}));
        }
    },[yourMusicListSelected]);

    // 피드 플리 재생
    useEffect(()=>{
        sessionStorage.setItem("feedMusicList", JSON.stringify(feedMusicList));
        if(feedMusicListSelected == true || feedMusicListSelected == "true"){
            playPlayListSong("feedMusicList", selectedFeedListIndex, selectedFeedSongIndex);
            dispatch(changeFeedMusicListSelected({feedMusicListSelected : false}));
        }
    },[feedMusicList]);

    // BGM 자동 재생
    useEffect(()=>{
        sessionStorage.setItem("myPageBgm", JSON.stringify(myPageBgm));
        // if문으로 설정 on off
        const autoPlay = sessionStorage.getItem("autoPlay");
        if(autoPlay == 'Y' && myPageBgm[0].songList.length != 0){
            playPlayListSong("myPageBgm", 0, 0);
        }
    },[myPageBgm]);

    // 플레이 리스트 재생(순차재생) 클릭
    function playInOrder(lKind, lIndex){
        $("#muzipbar-player").removeClass("shuffle");
        dispatch(zeroMusicListIndex());
        tempIndex = 0;
        listKind = lKind;
        listIndex = lIndex;
        dispatch(changeMusicListIndex({musicListIndex : 0}));
        dispatch(changeListKind({listKind : listKind}));
        dispatch(changeListIndex({listIndex : listIndex}));
        pickMusic(lKind, lIndex, 0);
        playMusic();
        $("#muzipbar-player").removeClass("repeat");
        repeatStatus = false;
        dispatch(iconStatus({
            type : "changeRepeatStatus",
            repeatStatus : repeatStatus
        }));
    };

    // 플레이 리스트 셔플재생 클릭
    let tempRandomArr = [];
    function getRandomArr(lKind, lIndex){
        tempRandomArr = [];
        for(let i = 0; i < (lKind==="recommendMusicList"?recommendMusicList[lIndex].songList.length:(lKind==="myMusicList"?myMusicList[lIndex].songList.length:myMusicList[lIndex].songList.length)); i++){
            let random = Math.floor(Math.random()*(lKind==="recommendMusicList"?recommendMusicList[lIndex].songList.length:(lKind==="myMusicList"?myMusicList[lIndex].songList.length:myMusicList[lIndex].songList.length)));
            tempRandomArr[i] = random;
            for(let j = 0; j< i; j++ ){
                if(tempRandomArr[i] === tempRandomArr[j]){
                    i--;
                }
            }
        }
        dispatch(changeRandomArr({randomArr : tempRandomArr}));
    };
    function playShuffle(lKind, lIndex){
        $("#muzipbar-player").addClass("shuffle");
        tempShuffleIndex = 0;
        listKind = lKind;
        listIndex = lIndex;
        dispatch(zeroShuffleIndex());
        dispatch(changeListKind({listKind : listKind}));
        dispatch(changeListIndex({listIndex : listIndex}));
        getRandomArr(lKind, lIndex);
        pickMusic(lKind, lIndex, tempRandomArr[0]);
        playMusic();
        $("#muzipbar-player").removeClass("repeat");
        repeatStatus = false;
        dispatch(iconStatus({
            type : "changeRepeatStatus",
            repeatStatus : repeatStatus
        }));
    };

    // 플레이리스트에 곡 추가
    const [tempMusicNo, setTempMusicNo] = useState();
    function addPlayListSetting(musicNo){
        setTempMusicNo(musicNo);
    }
    function addPlayListSong(playlistNo){
        axios.get("http://localhost:3000/Muzip/addPlaylistSong", {
            params : {
                playlistNo : playlistNo,
                musicNo : tempMusicNo
            },
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if(response.data === 0) alert("이미 있는 곡입니다.");
        }).catch(console.log);
        getMyPlayList();
    }
    
    // 플레이리스트에 곡 제거
    function removePlayListSong(playlistNo, musicNo){
        axios.get("http://localhost:3000/Muzip/removePlaylistSong", { // delete
            params : {
                playlistNo : playlistNo,
                musicNo : musicNo
            },
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if(response.data === 0) alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }).catch(console.log);
        getMyPlayList();
    }

    // 로그인안했으면 홈으로 보내고 뮤집바 원상태로 돌리기
    const navigate = useNavigate();
    const goLoginPage = () => {
        if(user === null){
            setTimeout(()=> {
                alert("로그인 후 이용해주세요");
            },400);
            navigate('/');
            function toHome1(){$("#muzipbar").css({'width':'16vw','height' : '2.8vw', 'background-color' : '#000000', 'border-radius': '1.5vw'});};
            function toHome2(){$("#muzipbar").css({'width':'13vw','height' : '2.8vw'});};
            function toHome3(){$("#muzipbar").css({'width':'14vw','height' : '2.8vw'});};
            function fadeOutAll(){
                $("#muzipbar-normal").fadeOut(100);
                $("#muzipbar-player").fadeOut(30);
                $("#muzipbar-lyrics").fadeOut(100);
                $("#muzipbar-playList").fadeOut(100);
                $("#muzipbar-recommend").fadeOut(100);
                $("#muzipbar-addPlayListSong").fadeOut(100);
                $("#muzipbar-myPlayListContent").fadeOut(100);
                $("#muzipbar-addNewPlayList").fadeOut(100);
            };
            fadeOutAll();
            setTimeout(() => fadeOutAll(), 450);
            setTimeout(() => toHome1(),450 );
            setTimeout(() => toHome2(),650 );
            setTimeout(() => toHome3(),850 );
            setTimeout(() => {
                $("#muzipbar-normal").fadeIn();
            },850);
        }
    }

    // 나의 플레이리스트 불러오기
    const getMyPlayList = async () => {
        if(user !== null){
            await axios.get("http://localhost:3000/Muzip/myPlaylist", {
                params : {
                    userNo : user.userNo
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            }) // 주소 얻고
            .then(response => {    // 응답성공하면 데이터 세팅
                let tempArr = [];
                if(response.data===null || response.data.length===0){
                    dispatch(changeMyMusicList({
                        myMusicList : [...tempArr]
                    }));
                }else{
                    for(let i = 0; i < response.data.length; i++){
                        tempArr[i] = {
                            listName : response.data[i].playlistName,
                            playlistNo : response.data[i].playlistNo,
                            songList : response.data[i].playlistSongs
                        };
                    };
                    dispatch(changeMyMusicList({
                        myMusicList : [...tempArr]
                    }));
                }
            }).catch(console.log); // 아니면 오류 로그찍기
        }
    }
    
    // 로그인했을 때 음악 셋팅
    useEffect(()=>{
        sessionStorage.setItem("playStatus", playStatus);
        sessionStorage.setItem("initialPlayStatus", initialPlayStatus);
        sessionStorage.setItem("currentPlayTimeStatus", currentPlayTimeStatus);
        sessionStorage.setItem("currentMusicListKind", currentMusicListKind);
        sessionStorage.setItem("currentMusicListIndex", currentMusicListIndex);
        sessionStorage.setItem("currentMusicIndex", currentMusicIndex);
    },[user]);
    // 플레이리스트 텅 비었을때
    useEffect(()=>{
        sessionStorage.setItem("myMusicList", JSON.stringify(myMusicList));
        if(myMusicList.length === 0 && currentMusicListKind === "myMusicList"){
            pickMusic("myMusicList",0,0);
            if(initialPlayStatus == 1){
                playMusic();
            }else{
                pauseMusic();
            }
        }
    },[myMusicList]);
    
    // 추천목록 받아오기
    const [genreArr, setGenreArr] = useState([]);
    const getRecommendList = async () => {
        await getGenre();
        if(user !== null){
            await axios.post("http://localhost:3000/Muzip/recommendList", {
                genre : [...genreArr]
            },{
                headers: {
                    'Content-Type': 'application/json',
                }
            }) // 주소 얻고
            .then(response => {    // 응답성공하면 데이터 세팅
                let tempArr = [];
                for(let i = 0; i < response.data.length; i++){
                    tempArr[i] = {
                        listName : i==0?"추천":i==1?"인기":"최신",
                        songList : response.data[i]
                    };
                };
                dispatch(changeRecommendMusicList({
                    recommendMusicList : [...tempArr]
                }));
            }).catch(console.log); // 아니면 오류 로그찍기
        }
    }
    useEffect(()=>{
        $("#muzipbar-normal").on("click", getRecommendList);
        return () => {$("#muzipbar-normal").off("click", getRecommendList);}
    });

    useEffect(()=>{
        sessionStorage.setItem("recommendMusicList", JSON.stringify(recommendMusicList));
    },[recommendMusicList]);

    const getGenre = async () => {
        if(user !== null){
            await axios.get("http://localhost:3000/Muzip/getGenre", {
                params : {
                    userNo : user.userNo
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                setGenreArr([...response.data]);
            })
            .catch(console.log);
        }
    }

    return(
        <>
            <div id="muzipbar-outer" onClick={goLoginPage}>
                <div id="muzipbar" onClick={getMyPlayList}>
                    <NormalBar/>
                    <MusicPlayerBar/>
                    <LyricsBar/>
                    <PlayListBar getMyPlayList={getMyPlayList} getRecommendList={getRecommendList}/>
                    <RecommendBar addPlayListSetting={addPlayListSetting} playPlayListSong={playPlayListSong}/>
                    <MyPlayListContentBar removePlayListSong={removePlayListSong} 
                    playPlayListSong={playPlayListSong} playInOrder={playInOrder} playShuffle={playShuffle}/>
                    <AddPlayListSongBar addPlayListSong={addPlayListSong}/>
                    <AddNewPlayListBar getMyPlayList={getMyPlayList}/>
                    <SearchMusicBar addPlayListSetting={addPlayListSetting} playPlayListSong={playPlayListSong}/>
                </div>
            </div>
        
        </>
    )
}

export default Muzip;