import React, { useState, useRef } from "react";
import "./login.css"; // login.css 파일을 import
import EnrollModal from "./EnrollForm";
import axios from "axios";
import { useAuth } from "./LoginContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeMyMusicList } from "./redux/musicListSlice";
import {changeAlarm} from "./redux/alarmSlice";
import { initializeSocket } from "./ChatSocket";
function LoginModal(props) {
   const {propsMyItems} = props;
   const {getBoardList,
          getUserIdList,
          getUserProfileImgList,
          getAllMusicList,
          setBtnFocus} =  propsMyItems;
          const {setMessages,updateChatRooms} = props;
  const [isEnrollModalVisible, setIsEnrollModalVisible] = useState(false);
  const { login } = useAuth(); //useAuth커스텀훅
  const { user } = useAuth();
    
  const navigate = useNavigate();

  const userIdRef = useRef(null);
  const userPwdRef = useRef(null);

  const openEnrollModal = () => {
    setIsEnrollModalVisible(true);
  };

  const closeEnrollModal = () => {
    setIsEnrollModalVisible(false);
  };

  function loginMember(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", userIdRef.current.value);
    formData.append("userPwd", userPwdRef.current.value);

    const dataTosend = {
      userId: formData.get("userId"),
      userPwd: formData.get("userPwd"),
    };

    axios
      .post("http://localhost:3000/Muzip/loginM", dataTosend, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        if(data != null){
          login(data); 
          initializeSocket(data, setMessages, updateChatRooms);
        }
        if(data.membershipNo == 0 || data.membershipNo == "0"){
          setBtnFocus("/admingpage");
          navigate("/adminpage");
          return
        }
        if (data && data.userNo) {

          // 만약 data에 userNo가 있다면
          const userPageURL = `/user/${data.userNo}`; // 해당 사용자의 마이페이지 URL 생성
          getBoardList();
          getUserIdList();
          getUserProfileImgList();
          getAllMusicList();
          navigate(userPageURL); // 해당 페이지로 리다이렉트
        } else {
          navigate("/"); // 만약 userNo가 없다면 기본 경로로 이동
        }

        console.log("되나");
        setPlaylist(data);
        setAlarm(data);
        setSetting(data);
      })
      .catch((error) => {
        alert("아이디 또는 비밀번호가 잘못되었습니다.");
        userIdRef.current.value = "";
        userPwdRef.current.value = "";
        userIdRef.current.focus();
      });
  }

  const dispatch = useDispatch();
  const setPlaylist = (data) => {
    if (data != null) {
      axios
        .get("http://localhost:3000/Muzip/myPlaylist", {
          params: {
            userNo: data.userNo,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }) // 주소 얻고
        .then((response) => {
          // 응답성공하면 데이터 세팅
          console.log(response.data);
          let tempArr = [];
          for (let i = 0; i < response.data.length; i++) {
            tempArr[i] = {
              listName: response.data[i].playlistName,
              songList: response.data[i].playlistSongs,
            };
          }
          dispatch(
            changeMyMusicList({
              myMusicList: [...tempArr],
            })
          );
        })
        .catch(console.log); // 아니면 오류 로그찍기
    }
  };
  
  const setAlarm = (data)=>{
    if(data != null){
      axios.get('http://localhost:3000/Muzip/getAlarms',{
        params:{
            userNo : data.userNo
        }
      }).then((response) => {
        dispatch(changeAlarm({
            alarm : [...response.data]
        }));
      })
      .catch(console.log);
    }
  }

  function pressEnter(e){
    if (e.key == "Enter" || e.keyCode == "13"){
      loginMember(e);
    }
}

  const setSetting = (data) => {
    if (data != null){
      axios.post("http://localhost:3000/Muzip/getSetting", {
          userNo: data.userNo
      }, {
          headers: {
              'Content-Type': 'application/json',
          }
      })
      .then(response => response.data)
      .then(data => {
          sessionStorage.setItem("autoPlay", data.autoPlay);
          sessionStorage.setItem("darkMode", data.theme);
          sessionStorage.setItem("chatAlarm", data.chatAlarm);
          sessionStorage.setItem("replyAlarm", data.commentAlarm);
          sessionStorage.setItem("followAlarm", data.musicAlarm);
      });
    }
  }
  return (
    <form onSubmit={loginMember}>
      <div>
        <div className="enroll_modal_login">
          <div className="enroll_content_login">
            <div className="loginMuzipLogoWrap"><div className="loginMuzipLogo"><h2>Muzip</h2></div></div>
            <div className="enroll_input">
              <input
                id="enroll_input_val_login"
                type="text"
                placeholder="아이디"
                name="userId"
                ref={userIdRef}
                onKeyUp={(e) =>pressEnter(e)}
              />
              <br />
              <input
                id="enroll_input_val_login"
                type="password"
                placeholder="비밀번호"
                name="userPwd"
                ref={userPwdRef}
                onKeyUp={(e) =>pressEnter(e)}
              />
              <br />
              <button
                type="button"
                id="enroll_login"
                style={{ marginTop: "2vw" }}
                onClick={loginMember}
              >
                로그인
              </button>
              <button type="button" id="enroll_login" onClick={openEnrollModal}>
                회원가입
              </button>
              <br />
            </div>
            <br />
          </div>
        </div>
      </div>
      {isEnrollModalVisible && <EnrollModal closeModal={closeEnrollModal} />}
    </form>
  );
}

export default LoginModal;
