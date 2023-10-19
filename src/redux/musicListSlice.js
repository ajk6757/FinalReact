import {createSlice} from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

export const musicListSlice = createSlice({
    name : 'musicList',
    initialState : {
        allMusicList : [
            {
                listName : "전체",
                songList : [
                    {
                        musicArtist : "",
                        musicTitle : "선택한 곡이 없습니다",
                        musicPath : "",
                        coverPath : "/resources/image/앨범커버샘플.png",
                        musicLyrics : ""
                    }
                ]
            }
        ],
        searchMusicList : [
            {
                listName : "검색",
                songList : [
                    {
                        musicArtist : "",
                        musicTitle : "선택한 곡이 없습니다",
                        musicPath : "",
                        coverPath : "/resources/image/앨범커버샘플.png",
                        musicLyrics : ""
                    }
                ]
            }
        ],
        recommendMusicList : 
        JSON.parse(sessionStorage.getItem("recommendMusicList")) ==null ||
        JSON.parse(sessionStorage.getItem("recommendMusicList")) ==undefined?
        [
            {
                listName : "추천",
                songList : [
                    {
                        musicArtist : "",
                        musicTitle : "선택한 곡이 없습니다",
                        musicPath : "",
                        coverPath : "/resources/image/앨범커버샘플.png",
                        musicLyrics : ""
                    }
                ]
            },
            {
                listName : "인기",
                songList : [
                    {
                        musicArtist : "",
                        musicTitle : "선택한 곡이 없습니다",
                        musicPath : "",
                        coverPath : "/resources/image/앨범커버샘플.png",
                        musicLyrics : ""
                    }
                ]
            },
            {
                listName : "최신",
                songList : [
                    {
                        musicArtist : "",
                        musicTitle : "선택한 곡이 없습니다",
                        musicPath : "",
                        coverPath : "/resources/image/앨범커버샘플.png",
                        musicLyrics : ""
                    }
                ]
            }
        ]
        :
        JSON.parse(sessionStorage.getItem("recommendMusicList"))
        ,
        myMusicList : 
        JSON.parse(sessionStorage.getItem("myMusicList")) == null ||
        JSON.parse(sessionStorage.getItem("myMusicList")) == undefined?
        [
            {
                listName : "플레이리스트",
                songList : [
                    {
                        musicArtist : "",
                        musicTitle : "선택한 곡이 없습니다",
                        musicPath : "",
                        coverPath : "/resources/image/앨범커버샘플.png",
                        musicLyrics : ""
                    } 
                ]
            }
        ]
        :
        JSON.parse(sessionStorage.getItem("myMusicList"))
        ,
        yourMusicList : 
        JSON.parse(sessionStorage.getItem("yourMusicList")) == null ||
        JSON.parse(sessionStorage.getItem("yourMusicList")) == "null" ||
        JSON.parse(sessionStorage.getItem("yourMusicList")) == undefined ||
        JSON.parse(sessionStorage.getItem("yourMusicList")) == "undefined" ?
        [
            {
                listName : "상대 플레이리스트",
                songList : [
                    {
                        musicArtist : "",
                        musicTitle : "선택한 곡이 없습니다",
                        musicPath : "",
                        coverPath : "/resources/image/앨범커버샘플.png",
                        musicLyrics : ""
                    }
                ]
            }
        ]
        :
        JSON.parse(sessionStorage.getItem("yourMusicList"))
        ,
        myPageBgm :
        JSON.parse(sessionStorage.getItem("myPageBgm")) == null ||
        JSON.parse(sessionStorage.getItem("myPageBgm")) == "null" ||
        JSON.parse(sessionStorage.getItem("myPageBgm")) == undefined ||
        JSON.parse(sessionStorage.getItem("myPageBgm")) == "undefined" ?
        [
            {
                listName : "BGM",
                songList : [
                    {
                        musicArtist : "",
                        musicTitle : "선택한 곡이 없습니다",
                        musicPath : "",
                        coverPath : "/resources/image/앨범커버샘플.png",
                        musicLyrics : ""
                    }
                ]
            }
        ]
        :
        JSON.parse(sessionStorage.getItem("myPageBgm"))
        ,
        feedMusicList :
        JSON.parse(sessionStorage.getItem("feedMusicList")) == null ||
        JSON.parse(sessionStorage.getItem("feedMusicList")) == "null" ||
        JSON.parse(sessionStorage.getItem("feedMusicList")) == undefined ||
        JSON.parse(sessionStorage.getItem("feedMusicList")) == "undefined" ?
        [
            {
                listName : "피드 음악",
                songList : [
                    {
                        musicArtist : "",
                        musicTitle : "선택한 곡이 없습니다",
                        musicPath : "",
                        coverPath : "/resources/image/앨범커버샘플.png",
                        musicLyrics : ""
                    }
                ]
            }
        ]
        :
        JSON.parse(sessionStorage.getItem("feedMusicList"))
        ,
        friendMusicList :
        JSON.parse(sessionStorage.getItem("friendMusicList")) == null ||
        JSON.parse(sessionStorage.getItem("friendMusicList")) == "null" ||
        JSON.parse(sessionStorage.getItem("friendMusicList")) == undefined ||
        JSON.parse(sessionStorage.getItem("friendMusicList")) == "undefined" ?
        [
            {
                listName : "친구 음악",
                songList : [
                    {
                        musicArtist : "",
                        musicTitle : "선택한 곡이 없습니다",
                        musicPath : "",
                        coverPath : "/resources/image/앨범커버샘플.png",
                        musicLyrics : ""
                    }
                ]
            }
        ]
        :
        JSON.parse(sessionStorage.getItem("friendMusicList"))
        ,
        selectedPlayList : 0,
        randomArr : [],
        musicListIndex : sessionStorage.getItem("currentMusicIndex")==null? 0 : parseInt(sessionStorage.getItem("currentMusicIndex")),
        shuffleIndex : 0,
        listKind : sessionStorage.getItem("currentMusicListKind")==null? "myMusicList" : sessionStorage.getItem("currentMusicListKind"),
        listIndex : sessionStorage.getItem("currentMusicListIndex")==null? 0 : parseInt(sessionStorage.getItem("currentMusicListIndex")),
        bgmSelected : sessionStorage.getItem("bgmSelected") == null? "" : sessionStorage.getItem("bgmSelected"),
        yourMusicListSelected : false,
        selectedYourListIndex : 0,
        selectedYourSongIndex : 0,
        feedMusicListSelected : false,
        selectedFeedListIndex : 0,
        selectedFeedSongIndex : 0,
        friendMusicListSelected : false,
        selectedFriendListIndex : 0,
        selectedFriendSongIndex : 0
    },
    reducers : {
        incrementMusicListIndex : (state) => {
            state.musicListIndex += 1;
        },
        decrementMusicListIndex : (state) => {
            state.musicListIndex -= 1;
        },
        incrementShuffleIndex : (state) => {
            state.shuffleIndex += 1;
        },
        decrementShuffleIndex : (state) => {
            state.shuffleIndex -= 1;
        },
        zeroMusicListIndex : (state) => {
            state.musicListIndex = 0;
        },
        zeroShuffleIndex : (state) => {
            state.shuffleIndex = 0;
        },
        lastRecommendMusicListIndex : (state, action) => {
            state.musicListIndex = state.recommendMusicList[action.payload].songList.length-1;
        },
        lastMyMusicListIndex : (state, action) => {
            state.musicListIndex = state.myMusicList[action.payload].songList.length-1;
        },
        lastSearchMusicList : (state, action) => {
            state.musicListIndex = state.searchMusicList[action.payload].songList.length-1;
        },
        lastYourMusicList : (state, action) => {
            state.musicListIndex = state.yourMusicList[action.payload].songList.length-1;
        },
        lastMyPageBgm : (state, action) => {
            state.musicListIndex = state.myPageBgm[action.payload].songList.length-1;
        },
        lastFeedMusicList : (state, action) => {
            state.musicListIndex = state.feedMusicList[action.payload].songList.length-1;
        },
        lastFriendMusicList : (state, action) => {
            state.musicListIndex = state.friendMusicList[action.payload].songList.length-1;
        },
        lastShuffleIndex : (state, action) => {
            state.shuffleIndex = state.randomArr.length-1;
        },
        changeMusicListIndex : (state, action) => {
            state.musicListIndex = action.payload.musicListIndex;
        },
        changeShuffleIndex : (state, action) => {
            state.shuffleIndex = action.payload.shuffleIndex;
        },
        changeRecommendMusicList : (state, action) => {
            state.recommendMusicList = action.payload.recommendMusicList;
        },
        changeMyMusicList : (state, action) => {
            state.myMusicList = action.payload.myMusicList;
        },
        changeSearchMusicList : (state, action) => {
            state.searchMusicList = action.payload.searchMusicList;
        },
        changeYourMusicList : (state, action) => {
            state.yourMusicList = action.payload.yourMusicList;
        },
        changeFeedMusicList : (state, action) => {
            state.feedMusicList = action.payload.feedMusicList;
        },
        changeFriendMusicList : (state, action) => {
            state.friendMusicList = action.payload.friendMusicList;
        },
        changeRandomArr : (state, action) => {
            state.randomArr = [...action.payload.randomArr];
        },
        changeSelectedPlayList : (state, action) => {
            state.selectedPlayList = action.payload.selectedPlayList;
        },
        changeListKind : (state, action)=>{
            state.listKind = action.payload.listKind;
        },
        changeListIndex : (state, action)=>{
            state.listIndex = action.payload.listIndex;
        },
        changeMyPageBgm : (state, action) => {
            state.myPageBgm = action.payload.myPageBgm;
        },
        changeBgmSelected : (state, action) => {
            state.bgmSelected = action.payload.bgmSelected;
        },
        changeYourMusicListSelected : (state, action) => {
            state.yourMusicListSelected = action.payload.yourMusicListSelected;
        },
        changeSelectedYourListIndex : (state, action) => {
            state.selectedYourListIndex = action.payload.selectedYourListIndex;
        },
        changeSelectedYourSongIndex : (state, action) => {
            state.selectedYourSongIndex = action.payload.selectedYourSongIndex;
        },
        changeFeedMusicListSelected : (state, action) => {
            state.feedMusicListSelected = action.payload.feedMusicListSelected;
        },
        changeSelectedFeedListIndex : (state, action) => {
            state.selectedFeedListIndex = action.payload.selectedFeedListIndex;
        },
        changeSelectedFeedSongIndex : (state, action) => {
            state.selectedFeedSongIndex = action.payload.selectedFeedSongIndex;
        },
        changeFriendMusicListSelected : (state, action) => {
            state.friendMusicListSelected = action.payload.friendMusicListSelected;
        },
        changeSelectedFriendListIndex : (state, action) => {
            state.selectedFriendListIndex = action.payload.selectedFriendListIndex;
        },
        changeSelectedFriendSongIndex : (state, action) => {
            state.selectedFriendListIndex = action.payload.selectedFriendListIndex;
        }
    }
});

export const {incrementMusicListIndex, decrementMusicListIndex,
    incrementShuffleIndex, decrementShuffleIndex,
    zeroMusicListIndex, zeroShuffleIndex,
    lastRecommendMusicListIndex, lastMyMusicListIndex, 
    lastShuffleIndex, lastSearchMusicList, lastYourMusicList, lastMyPageBgm,
    lastFeedMusicList, changeMusicListIndex, changeShuffleIndex,
    changeRecommendMusicList, changeMyMusicList, changeSearchMusicList, changeYourMusicList,
    changeRandomArr, deleteMusicList,
    changeSelectedPlayList, changeListKind, changeListIndex, 
    changeMyPageBgm, changeBgmSelected, changeYourMusicListSelected,
    changeSelectedYourListIndex, changeSelectedYourSongIndex,
    changeFeedMusicList, changeFeedMusicListSelected,
    changeSelectedFeedListIndex, changeSelectedFeedSongIndex,
    changeFriendMusicListSelected, changeSelectedFriendListIndex,
    changeSelectedFriendSongIndex, changeFriendMusicList, lastFriendMusicList,
    } = musicListSlice.actions;

export default musicListSlice.reducer;