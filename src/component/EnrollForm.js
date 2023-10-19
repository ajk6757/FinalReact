import React, { useState, useRef } from "react";
import "../enroll.css"; // enroll.css 파일을 import
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

function onChange(value) {
  console.log("Captcha value:", value);
}

function EnrollModal({ closeModal }) {
  const [isOpen, setIsOpen] = useState(true);

  const formRef = useRef(null);

  function insertMember(e) {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    // ReCAPTCHA 검증을 위해 사용자가 확인했음을 확인합니다.
    // 예제 코드에서는 실제로 ReCAPTCHA를 검증하는 부분이 빠져 있으므로 실제 코드에서는 추가해야 합니다.

    axios
      .post(
        "http://localhost:3000/Muzip/enrollM",
        {
          userId: formData.get("userId"),
          userName: formData.get("userName"),
          userPwd: formData.get("userPwd"),
          email: formData.get("email"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data);
        setIsOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <form ref={formRef} onSubmit={insertMember}>
      {isOpen && (
        <div className="enroll_modal">
          <div className="enroll_content">
            <img
              src="/icons/delete.png"
              id="enroll_exit"
              title="클릭하면 창이 닫힙니다."
              style={{ width: "1.5vw", height: "1.5vw" }}
              onClick={closeModal}
            />
            <img
              src="/icons/Muzip.png"
              id="enroll_logo"
              style={{ width: "7.5vw", height: "3vw" }}
            />
            <div className="enroll_input">
              <input
                id="enroll_input_val"
                type="text"
                placeholder="아이디"
                name="userId"
              />
              <br />
              <input
                id="enroll_input_val"
                type="text"
                placeholder="비밀번호"
                name="userPwd"
              />
              <br />
              <input
                id="enroll_input_val"
                type="text"
                placeholder="닉네임"
                name="userName"
              />
              <br />
              <input
                id="enroll_input_val"
                type="email"
                placeholder="이메일"
                name="email"
              />
              <br />
              <div className="captcha">
                <ReCAPTCHA
                  sitekey="6LfCOsonAAAAAJLJtCC0vBe2M0l0FKZlmQdGuTQ2"
                  onChange={onChange}
                />
              </div>
              <br />
              <button type="button" id="enroll_member" onClick={insertMember}>
                회원가입
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default EnrollModal;
