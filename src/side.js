import "./App.css";
import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAlarm, deleteAllAlarm } from "./redux/alarmSlice";
import {GiCancel} from 'react-icons/gi';
import axios from "axios";
import {GoDotFill} from 'react-icons/go';
import {MdOutlineDeleteForever} from 'react-icons/md';


export const Side = (props) => {

    const [sidestring, setsidestring] = useState('ranking');
    const {searchword} = props;
    const alarm = useSelector((state)=>state.alarmState.alarm);
    let aLength = alarm.length;

    const changepage = (string) => {

        setsidestring(string)
    };

    return (
        <div id="sidewrap">
            
            <ul id="sideList">
                <li className={sidestring == 'ranking' ? 'backcolor1' : 'backcolor2'} onClick={() => changepage('ranking')}>검색어 순위</li>
                <li className={sidestring == 'alarm' ? 'backcolor1' : 'backcolor2'} onClick={() => changepage('alarm')}>
                    알람 {aLength == 0 ? " " : <GoDotFill className="sideListAlarmIcon" fill="red" size="0.85vw"/>}
                </li>
            </ul>

            {sidestring == 'ranking' && <Ranking searchword={searchword}/>}
            {sidestring == 'alarm' && <Alarm/>}

        </div>
    )
}


export const Alarm = (props) => {

    const alarm = useSelector((state)=>state.alarmState.alarm);
    const alarmLoading = useSelector((state)=>state.alarmState.alarmLoading);
    const dispatch = useDispatch();
    function checkAlarm(index){
        axios.get("http://localhost:3000/Muzip/checkAlarm", {
            params : {
                alarmNo : alarm[index].alarmNo
            },
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if(response.data === 0) {
                alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.")
            }else{
                dispatch(deleteAlarm(index))
            };
        }).catch(console.log);
    }

    function removeAllAlarm(){

        for(let i = 0; i < alarm.length; i++){
            console.log(alarm)
            axios.get("http://localhost:3000/Muzip/checkAlarm", {
                params : {
                    alarmNo : alarm[i].alarmNo
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            }).catch(console.log);
        }

        dispatch(deleteAllAlarm());

    }

    return (
        <>
            <div id="alarm">
                <table className="alarm_tb">
                    <tbody>
                        {
                        alarmLoading == true ?
                        <img src="http://localhost:8082/Muzip/resources/image/loading.gif" className='alarmLoading'/>
                        :
                        alarm.map((item, index) => (
                            <tr className="alarm_tb_tr" key={"알람"+index}>
                                <td className="alarm_tb_td">
                                    <div className="alarm_img_div">
                                        <img className="alarm_img"/>
                                    </div>
                                    <div className="alarm_msg_div">
                                        <span className="alarm_msg"> {item.alarmMessage}</span>
                                    </div>
                                    <GiCancel className="checkAlarmIcon" onClick={() => checkAlarm(index)} size="0.85vw"/>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>
            <div className="removeAllAlarm" onClick={removeAllAlarm}>
                <MdOutlineDeleteForever size="1.3vw"/>
            </div>
        </>
    )
}

export const Ranking = (props) => {
    const { searchword } = props;
    return (
        <div id="ranking">
            <ol>
                {searchword.map((string, index) => (
                    <li key={index}>{string}</li>
                ))}
            </ol>

        </div>
    )
}