import {createSlice} from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

export const musicStateSlice = createSlice({
    name : 'musicStatus',
    initialState : {
        playStatus : sessionStorage.getItem("playStatus")==null? false : sessionStorage.getItem("playStatus"),
        volumeStatus : 0 /* 0 == 음소거, 1 == 1~50, 2== 51~100 */,
        repeatStatus : false,
        initialPlayStatus : sessionStorage.getItem("initialPlayStatus")==null? 0 : sessionStorage.getItem("initialPlayStatus"),
        currentPlayTimeStatus : sessionStorage.getItem("currentPlayTimeStatus")==null? 0 : sessionStorage.getItem("currentPlayTimeStatus"),
        currentMusicListKind : sessionStorage.getItem("currentMusicListKind")==null? "myMusicList" : sessionStorage.getItem("currentMusicListKind"),
        currentMusicListIndex : sessionStorage.getItem("currentMusicListIndex")==null? 0 : sessionStorage.getItem("currentMusicListIndex"),
        currentMusicIndex : sessionStorage.getItem("currentMusicIndex")==null? 0 : sessionStorage.getItem("currentMusicIndex"),
        currentMusicVolume : sessionStorage.getItem("currentMusicVolume")==null? 0.5 : sessionStorage.getItem("currentMusicVolume")
    },
    reducers : {
        iconStatus : (state, action) => {
            switch(action.payload.type){
                case 'changePlayStatus' : return {...state, 
                    playStatus : action.payload.playStatus
                };
                case 'changeVolumeStatus' : return {...state, 
                    volumeStatus : action.payload.volumeStatus
                };
                case 'changeRepeatStatus' : return {...state, 
                    repeatStatus : action.payload.repeatStatus
                };
            }
            return state;
        },
        changeInitialPlayStatus : (state, action) => {
            // console.log(action.payload);
            state.initialPlayStatus = action.payload;
        },
        changeCurrentPlayTimeStatus : (state, action) => {
            state.currentPlayTimeStatus = action.payload;
        },
        changeCurrentMusicListKind : (state, action) => {
            state.currentMusicListKind = action.payload;
        },
        changeCurrentMusicListIndex : (state, action) => {
            state.currentMusicListIndex = action.payload;
        },
        changeCurrentMusicIndex : (state, action) => {
            state.currentMusicIndex = action.payload;
        },
        changeCurrentMusicVolume : (state, action) => {
            state.currentMusicVolume = action.payload;
        }
    }
});

export const {iconStatus, changeCurrentPlayTimeStatus,
    changeCurrentMusicListKind, changeCurrentMusicListIndex, changeInitialPlayStatus,
    changeCurrentMusicIndex, changeCurrentMusicVolume} = musicStateSlice.actions;

export default musicStateSlice.reducer;
