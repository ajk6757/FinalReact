import React, { useState, useRef } from 'react';
import './enroll.css'; // enroll.css 파일을 import
import ReCAPTCHA from 'react-google-recaptcha';
import { IoCloseCircleOutline } from "react-icons/io5";
import axios from 'axios';

function onChangeCap(value) {
  console.log('Captcha value:', value);
}

function isValidEmail(email) {
  // 이메일 주소 형식을 검증하는 정규식
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
}

function EnrollModal({ closeModal }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCheck, setIsCheck] = useState();
  const [isNameCheck, setIsNameCheck] = useState();
  const [isLengthIdCheck, setIsLengthIdCheck] = useState();
  const [isLengthNameCheck, setIsLengthNameCheck] = useState();
  const [isEmailCheck, setIsEmailCheck] = useState();
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const formRef = useRef(null);

  const handleIdCheck = (event) => {
    const newValue = event.target.value;
    // 아이디 중복 검사를 호출하고 결과를 업데이트
    setIsLengthIdCheck(newValue.length > 0);
    checkIdAvailability(newValue);
  };

  const checkIdAvailability = (userId) => {
    axios.get('http://localhost:3000/Muzip/checkId', {
      params: {
        userId: userId
      },
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      const isCheckValue = response.data.IsCheck;
      setIsCheck(isCheckValue);
    }).catch(error => {
      console.error('Error:', error);
    });
  };


  const handleNameCheck = (event) => {
    const newValue = event.target.value;
    setIsLengthNameCheck(newValue.length > 0);
    checkNameAvailability(newValue);
  };

  const checkNameAvailability = (userName) => {
    axios.get('http://localhost:3000/Muzip/checkName', {
      params: {
        userName: userName
      },
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      const isCheckValue = response.data.IsNameCheck;
      setIsNameCheck(isCheckValue);
    }).catch(error => {
      console.error('Error:', error);
    });
  };

  function insertMember(e) {
    e.preventDefault();

    const formData = new FormData(formRef.current);


    axios.post('http://localhost:3000/Muzip/enrollM', {
      userId: formData.get("userId"),
      userName: formData.get('userName'),
      userPwd: formData.get('userPwd'),
      email: formData.get('email')
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.data)
      .then(data => {
        alert(data);
        setIsOpen(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }



  return (
    <form ref={formRef} onSubmit={insertMember}>
      {isOpen && (

        <div className="enroll_modal">
          <div className="enroll_content">
            <IoCloseCircleOutline
              id="enroll_exit"
              style={{ width: '1.5vw', height: '1.5vw' }}
              onClick={closeModal}
            />
            <div className="enrollMuzipLogoWrap"><div className="enrollMuzipLogo"><h2>Muzip</h2></div></div>
            <div className="enroll_input">
              <input
                id="enroll_input_val"
                type="text"
                placeholder='아이디'
                name='userId'
                onChange={handleIdCheck}
              />
              {isLengthIdCheck &&
                <div className={`idCheck_box ${isCheck ? 'blueText' : 'redText'}`} >
                  {isCheck ? '사용가능한아이디입니다.' : '중복된 아이디입니다.'}
                </div>
              }
              <br />
              <input
                id="enroll_input_val"
                type="text"
                placeholder="비밀번호"
                name='userPwd'
              />
              <br />
              <input
                id="enroll_input_val"
                type="text"
                placeholder="닉네임"
                name='userName'
                onChange={handleNameCheck}
              />
              {isLengthNameCheck &&
                <div className={`idCheck_box ${isNameCheck ? 'blueText' : 'redText'}`}>
                  {isNameCheck ? '사용 가능한 닉네임입니다.' : '중복된 닉네임입니다.'}
                </div>
              }
              <br />
              <input
                id="enroll_input_val"
                type="email"
                placeholder="이메일"
                name='email'
                onBlur={(e) => {
                  const email = e.target.value;
                  const isValid = isValidEmail(email);
                  setIsEmailCheck(isValid); 
                }}
              />
              {isEmailCheck !== undefined && (
                <div className={`idCheck_box ${isEmailCheck ? 'blueText' : 'redText'}`}>
                  {isEmailCheck ? '사용가능한 이메일입니다.' : '이메일 형식을 올바르게 입력해주세요.'}
                </div>
              )}
              <br />
              <div className="captcha">
                <ReCAPTCHA
                  sitekey="6LfCOsonAAAAAJLJtCC0vBe2M0l0FKZlmQdGuTQ2"
                  onChange={(value) => {
                    onChangeCap(value);
                    setIsCaptchaVerified(true); 
                  }}
                />
              </div>
              <br />
              <button type="button" id="enroll_member" onClick={insertMember} disabled={!isCheck || !isNameCheck || !isEmailCheck || !isCaptchaVerified} >
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
