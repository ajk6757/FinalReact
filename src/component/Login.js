import React, { useState, useRef } from "react";
import "../login.css"; // login.css 파일을 import
import EnrollModal from "./EnrollForm";
import axios from "axios";
import { useAuth } from "./LoginContext";
import { useNavigate } from "react-router-dom";

function LoginModal() {
  const [isEnrollModalVisible, setIsEnrollModalVisible] = useState(false);
  const { login } = useAuth(); //useAuth커스텀훅

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
        login(data); //로그인에 업데이트
        console.log(data);
        navigate("/feed");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <form onSubmit={loginMember}>
      <div>
        <div className="enroll_modal_login">
          <div className="enroll_content_login">
            <img
              src="/icons/Muzip.png"
              id="enroll_logo_login"
              style={{ width: "7.5vw", height: "3vw" }}
            />
            <div className="enroll_input">
              <input
                id="enroll_input_val_login"
                type="text"
                placeholder="아이디"
                name="userId"
                ref={userIdRef}
              />
              <br />
              <input
                id="enroll_input_val_login"
                type="text"
                placeholder="비밀번호"
                name="userPwd"
                ref={userPwdRef}
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
              <button type="button" id="login_find">
                아이디/비밀번호 찾기
              </button>
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
