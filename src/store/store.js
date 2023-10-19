import {configureStore} from "@reduxjs/toolkit";
import musicListSlice from "../redux/musicListSlice";
import musicStatus from "../redux/musicStatusSlice";
import { useEffect, useState } from "react";
import alarmStateSlice from "../redux/alarmSlice";
// import CallMiddleware from "./CallMiddleware";


export default configureStore({
    reducer : {
        musicList : musicListSlice,
        musicStatus : musicStatus,
        alarmState : alarmStateSlice
    },
    middleware:[]
});
