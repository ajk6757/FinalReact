import {createSlice} from "@reduxjs/toolkit";

export const alarmStateSlice = createSlice({
    name : 'alarmState',
    initialState : {
        alarm : [],
        alarmStompClient : null,
        newAlarm : {},
        alarmLoading : false
    },
    reducers : {
        changeAlarm : (state, action) => {
            state.alarm = action.payload.alarm;
        },
        addNewAlarm : (state, action) => {
            const newAlarm = action.payload.newAlarm;
            let cloneAlarm = [...state.alarm];
            state.alarm = [...cloneAlarm, newAlarm];
        },
        deleteAlarm : (state, action) => {
            const updateAlarmList = state.alarm.filter(function(item, index){
                if(index != action.payload){
                    return true;
                }else {
                    return false;
                }
            });
            const newUpdateList = [...updateAlarmList];
            state.alarm = newUpdateList;
        },
        deleteAllAlarm : (state, action) => {
            state.alarm = [];
        },
        deleteRoomAlarm : (state, action) => {
            const chatroomNo = action.payload;
            const updateAlarmList = state.alarm.filter(function(item, index){
                if(item.alarmPath == chatroomNo && item.alarmMessage.indexOf('채팅')){
                    return false;
                }else{
                    return true;
                }
            })
            const newUpdateList = [...updateAlarmList];
            state.alarm = newUpdateList;
        },
        changeStompClient : (state, action) => {
            state.alarmStompClient = action.payload.alarmStompClient;
        },
        changeNewAlarm : (state, action) => {
            state.newAlarm = action.payload.newAlarm;
        },
        alarmLoadingFalse : (state, action) => {
            state.alarmLoading = false;
        },
        alarmLoadingTrue : (state, action) => {
            state.alarmLoading = true;
        },
        settingLoadingFalse : (state, action) => {
            state.settingLoading = false;
        },
        settingLoadingTrue : (state, action) => {
            state.settingLoading = true;
        }
    }
});

export const {changeAlarm, addNewAlarm, deleteAlarm,
    changeStompClient, changeNewAlarm,  deleteAllAlarm, deleteRoomAlarm,
    alarmLoadingFalse, alarmLoadingTrue} = alarmStateSlice.actions;

export default alarmStateSlice.reducer;
