import "./App.css";
import "./Setting.css";
import {
  BrowserRouter,
  useLocation,
  Link,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import $ from "jquery";
import { React, useEffect, useState, useRef } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { useAuth } from "./LoginContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "./Login";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import Paging from "./paging";

export const Settings = (props) => {
  const { setBtnFocus, propsMyItems } = props;
  const [myinfo, setmyinfo] = useState(props.myinfo);
  const [setting, setsetting] = useState(props.setting);
  const [changecolor, setchangecolor] = useState("settingClick");
  const { setDarkmode, darkmodeSet, forceClick } = props;
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const liElements = document.querySelectorAll("#settingList li");
    liElements.forEach((liElement) => {
      if (liElement.id === changecolor) {
        liElement.classList.add("settingListBtnClick");
      } else {
        liElement.classList.remove("settingListBtnClick");
      }
    });
    if (forceClick) {
      setchangecolor("membershipClick");
    }
  }, [changecolor]);

  const bgColorChange = (e) => {
    setchangecolor(e.target.id);
  };

  const handleLogout = () => {
    setDarkmode(!darkmodeSet);
    sessionStorage.removeItem("autoPlay");
    sessionStorage.removeItem("darkMode");
    sessionStorage.removeItem("chatAlarm");
    sessionStorage.removeItem("replyAlarm");
    sessionStorage.removeItem("followAlarm");
    logout();
    alert("로그아웃 성공");
    setBtnFocus({ id: "/" });
    navigate("/");
    function toHome1() {
      $("#muzipbar").css({
        width: "16vw",
        height: "2.8vw",
        "background-color": "#000000",
        "border-radius": "1.5vw",
      });
    }
    function toHome2() {
      $("#muzipbar").css({ width: "13vw", height: "2.8vw" });
    }
    function toHome3() {
      $("#muzipbar").css({ width: "14vw", height: "2.8vw" });
    }
    function fadeOutAll() {
      $("#muzipbar-normal").fadeOut(100);
      $("#muzipbar-player").fadeOut(30);
      $("#muzipbar-lyrics").fadeOut(100);
      $("#muzipbar-playList").fadeOut(100);
      $("#muzipbar-recommend").fadeOut(100);
      $("#muzipbar-addPlayListSong").fadeOut(100);
      $("#muzipbar-myPlayListContent").fadeOut(100);
      $("#muzipbar-addNewPlayList").fadeOut(100);
    }
    fadeOutAll();
    setTimeout(() => fadeOutAll(), 450);
    setTimeout(() => toHome1(), 450);
    setTimeout(() => toHome2(), 650);
    setTimeout(() => toHome3(), 850);
    setTimeout(() => {
      $("#muzipbar-normal").fadeIn();
    }, 850);
  };
  if (user) {
    return (
      <div id="settingWrap">
        <div id="settingList">
          <ul>
            <Link to={"/settings/set"}>
              <li id="settingClick" onClick={bgColorChange}>
                설정
              </li>
            </Link>
            <Link to={"/settings/myinfo"}>
              <li id="firstClick" onClick={bgColorChange}>
                내 정보
              </li>
            </Link>
            <Link to={"/settings/membership"}>
              <li id="membershipClick" onClick={bgColorChange}>
                멤버십
              </li>
            </Link>
            <Link to={"/settings/coinfo"}>
              <li id="CoInfoClick" onClick={bgColorChange}>
                문의하기
              </li>
            </Link>
            <Link to={"/settings/withdrawal"}>
              <li id="withdrawalClick" onClick={bgColorChange}>
                회원탈퇴
              </li>
            </Link>

            <li className="logoutBtn" onClick={handleLogout}>
              로그아웃
            </li>
          </ul>
        </div>
        <div id="settingItem">
          {location.pathname == "/settings" ? (
            <MyInfo myinfo={myinfo} />
          ) : (
            <Outlet setting={setting} />
          )}
        </div>
      </div>
    );
  }

  return <LoginModal propsMyItems={propsMyItems} />;
};

export const MyInfo = (props) => {
  const { myinfo, settingprops, getUserIdList } = props;
  const { changecolor, setchangecolor } = settingprops;
  const { user, login } = useAuth();
  const [genre, setGenre] = useState([]);
  const [handlegenre, setHandlegenre] = useState(false);
  const form1Ref = useRef(null);
  const form2Ref = useRef(null);
  const navigate = useNavigate();
  const [isNameCheck, setIsNameCheck] = useState();
  const [isLengthNameCheck, setIsLengthNameCheck] = useState();
  const [isEmailCheck, setIsEmailCheck] = useState();
  const [isCheck, setIsCheck] = useState();
  const [isUpdating, setIsUpdating] = useState(false);

  function isValidEmail(email) {
    // 이메일 주소 형식을 검증하는 정규식
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  }


  const handleNameCheck = (event) => {
    const newValue = event.target.value;
    if(newValue === user.userName){
      setIsNameCheck(true);
      return;
    }

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
      if(userName === user.userName){
        setIsNameCheck(true);
        return;
      }
      const isCheckValue = response.data.IsNameCheck;
      setIsNameCheck(isCheckValue);
    }).catch(error => {
      console.error('Error:', error);
    });
  };

  function updateMember(e) {
    setIsUpdating(true);
    e.preventDefault();
    const formData = new FormData(form1Ref.current);
    // 장르 기존 데이터삭제하고 변경사항 삽입

    axios
      .post(
        "http://localhost:3000/Muzip/setMemberinfo",
        {
          userNo: user.userNo,
          list: formData.getAll("genre"),
          userName: formData.get("userName"),
          email: formData.get("userEmail"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setHandlegenre(!handlegenre);
        alert(data.message);
        getUserIdList();
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setchangecolor("firstClick");
    navigate("/settings/myinfo");
    setIsUpdating(false);
    setIsLengthNameCheck(false);
    setIsEmailCheck(undefined);
  }

  useEffect(() => {
    getMemberinfo();
    getGenre();
  }, [isUpdating]);

  function getMemberinfo() {
    axios
      .post(
        "http://localhost:3000/Muzip/getMemberinfo",
        {
          userId: user.userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        login(data); //로그인에 업데이트
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function getGenre() {
    axios
      .post(
        "http://localhost:3000/Muzip/getGenre",
        {
          userNo: user.userNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setGenre(data);
        setHandlegenre(!handlegenre);
      });
  }

  function updatePwd(e) {
    e.preventDefault();
    const formData = new FormData(form2Ref.current);

    axios
      .post(
        "http://localhost:3000/Muzip/setpassword",
        {
          userNo: user.userNo,
          userId: user.userId,
          memberPwd: formData.get("memberPwd"),
          changePwd: formData.get("changePwd"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    document.querySelector('#myinfoInputBox [name="userName"]').value =
      user.userName;
    document.querySelector('#myinfoInputBox [name="userEmail"]').value =
      user.email;
  }, [user]);

  useEffect(() => {
    const checkboxes = document.querySelectorAll("#myTypeList input");
    const interests = genre.map((item) => {
      return item.genreName;
    });
    checkboxes.forEach((checkbox) => {
      if (interests.includes(checkbox.value)) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    });
  }, [genre]);

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (!isLoaded) {
      getMemberinfo();
      getGenre();
    }
    setIsLoaded(true);
  }, [user]);

  return (
    <div className="myinfoWrap">
      <form ref={form1Ref} onSubmit={(e) => updateMember(e)}>
        <div id="myinfoInputBox">
          <h3>내 정보 설정</h3>
          <input
            className="myinfoUserInfo"
            type="text"
            name="userName"
            placeholder="닉네임"
            style={
              sessionStorage.getItem("darkMode") == "Y"
                ? { border: "1px solid white" }
                : {}
            }
            onChange={handleNameCheck}
          />
          {isLengthNameCheck &&
                <div className={`idCheck_box ${isNameCheck ? 'blueText' : 'redText'}`}>
                  {isNameCheck ? '사용 가능한 닉네임입니다.' : '중복된 닉네임입니다.'}
                </div>
              }
          <input
            className="myinfoUserInfo"
            type="text"
            name="userEmail"
            placeholder="이메일"
            style={
              sessionStorage.getItem("darkMode") == "Y"
                ? { border: "1px solid white" }
                : {}
            }
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
          {/* <input className="myinfoUserInfo" type="text" name="userPhone" placeholder="전화번호" /> */}
        </div>

        <div id="myTypeList">
          <table>
            <tbody>
              <tr>
                <th colSpan={2}>취향</th>
              </tr>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    name="genre"
                    id="ballad"
                    value="발라드"
                  />{" "}
                  <label htmlFor="ballad">발라드</label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="genre"
                    id="trot"
                    value="트로트"
                  />{" "}
                  <label htmlFor="trot">트로트</label>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" name="genre" id="kpop" value="K-POP" />{" "}
                  <label htmlFor="kpop">K-POP</label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="genre"
                    id="hiphop"
                    value="힙합"
                  />{" "}
                  <label htmlFor="hiphop">힙합</label>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" name="genre" id="pop" value="POP" />{" "}
                  <label htmlFor="pop">POP</label>
                </td>
                <td>
                  <input type="checkbox" name="genre" id="rock" value="락" />{" "}
                  <label htmlFor="rock">락</label>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" name="genre" id="edm" value="EDM" />{" "}
                  <label htmlFor="edm">EDM</label>
                </td>
                <td>
                  <input type="checkbox" name="genre" id="jpop" value="포크" />{" "}
                  <label htmlFor="jpop">포크</label>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <FiAlertCircle /> 취향을 설정하고 취향에 맞는 노래를
                  추천받아보세요!
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div id="myinfoUpdateBtn">
          <button
            id="myinfo_changepwd"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            비밀번호 변경
          </button>
          <button type="submit" name="myinfochange" disabled={isNameCheck === false || isEmailCheck === false}>
          {/* <button type="submit" name="myinfochange" disabled={!isNameCheck || !isEmailCheck }> */}
            수정완료
          </button>
        </div>
      </form>

      <form ref={form2Ref} onSubmit={(e) => updatePwd(e)}>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel1">
                  비밀번호 변경
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body changePwd">
                <input
                  id="currentPwd"
                  type="password"
                  name="memberPwd"
                  placeholder="현재 비밀번호"
                />
                <input
                  id="changePwd"
                  type="password"
                  name="changePwd"
                  placeholder="새 비밀번호"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  취소
                </button>
                <button
                  type="submit"
                  name="pwdchange"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={updatePwd}
                >
                  비밀번호 변경
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export const MySet = (props) => {
  const { darkmodeSet, setDarkmode } = props;
  const [{ setting }, setsetting] = useState(props);
  const { user, login } = useAuth();
  const [membersetting, setMembersetting] = useState([]);
  const [handleset, setHandleset] = useState(false);

  const changeSetting = (e) => {
    let result;
    result = e.target.checked == true ? "Y" : "N";
    let cName = e.target.name;

    if (cName == "autoPlay") sessionStorage.setItem("autoPlay", result);
    if (cName == "theme") sessionStorage.setItem("darkMode", result);
    if (cName == "chatAlarm") sessionStorage.setItem("chatAlarm", result);
    if (cName == "commentAlarm") sessionStorage.setItem("replyAlarm", result);
    if (cName == "musicAlarm") sessionStorage.setItem("followAlarm", result);

    axios
      .post(
        "http://localhost:3000/Muzip/changeSetting",
        {
          userNo: user.userNo,
          cName: cName,
          result: result,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setHandleset(!handleset);
        setDarkmode(!darkmodeSet);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function getSetting() {
    if (handleset) return;
    axios
      .post(
        "http://localhost:3000/Muzip/getSetting",
        {
          userNo: user.userNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setMembersetting(data);
        setHandleset(!handleset);
        sessionStorage.setItem("autoPlay", data.autoPlay);
        sessionStorage.setItem("darkMode", data.theme);
        sessionStorage.setItem("chatAlarm", data.chatAlarm);
        sessionStorage.setItem("replyAlarm", data.commentAlarm);
        sessionStorage.setItem("followAlarm", data.musicAlarm);
      });
  }

  useEffect(() => {
    getSetting();

    document.querySelector('#autoPlaySet [name="autoPlay"]').checked =
      membersetting.autoPlay == "Y" ? true : false;
    document.querySelector('#autoPlaySet [name="autoPlay"]').checked =
      membersetting.autoPlay == "Y" ? true : false;
    document.querySelector('.setCheckbox [name="theme"]').checked =
      membersetting.theme == "Y" ? true : false;
    document.querySelector('.setCheckbox [name="commentAlarm"]').checked =
      membersetting.commentAlarm == "Y" ? true : false;
    document.querySelector('.setCheckbox [name="chatAlarm"]').checked =
      membersetting.chatAlarm == "Y" ? true : false;
    document.querySelector('.setCheckbox [name="musicAlarm"]').checked =
      membersetting.musicAlarm == "Y" ? true : false;
  }, [membersetting]);

  return (
    <div className="myinfoWrap">
      <div id="autoPlaySet">
        <span>
          <h5>뮤집 음악 자동재생 설정</h5>
        </span>
        <span>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="autoPlay"
              onClick={changeSetting}
              role="switch"
              id="flexSwitchCheckDefault"
            />
          </div>
        </span>
      </div>
      <div id="setTitle">
        <h5>테마색 변경</h5>
      </div>
      <div className="setItems">
        <table>
          <tbody>
            <tr>
              <td>다크모드</td>
              <td className="setCheckbox">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="theme"
                    onClick={changeSetting}
                    role="switch"
                    id="flexSwitchCheckDefault"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div id="setTitle">
        <h5>알림 설정</h5>
      </div>
      <div className="setItems">
        <table>
          <tbody>
            <tr>
              <td>코멘트 알림</td>
              <td className="setCheckbox">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="commentAlarm"
                    onClick={changeSetting}
                    role="switch"
                    id="flexSwitchCheckDefault"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>채팅방 알림</td>
              <td className="setCheckbox">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="chatAlarm"
                    onClick={changeSetting}
                    role="switch"
                    id="flexSwitchCheckDefault"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>음악 알림</td>
              <td className="setCheckbox">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="musicAlarm"
                    onClick={changeSetting}
                    role="switch"
                    id="flexSwitchCheckDefault"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

function Payment(props) {
  const { user, login } = useAuth();
  const { name, price, membershipNo, forceClick, setForceClick } = props;

  function getMemberinfo() {
    axios
      .post(
        "http://localhost:3000/Muzip/getMemberinfo",
        {
          userId: user.userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        login(data); //로그인에 업데이트
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";

    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
  });

  function onClickPayment() {
    const { IMP } = window;
    IMP.init("imp06580330");

    const data = {
      // pg: 'html5_inicis',                           // PG사
      pg: "kicc", // PG사
      pay_method: "card", // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: price, // 결제금액
      name: name, // 주문명
      buyer_name: "뮤집", // 구매자 이름
      buyer_tel: "01012341234", // 구매자 전화번호
      buyer_email: "example@example", // 구매자 이메일
      buyer_addr: "신사동 661-16", // 구매자 주소
      buyer_postcode: "06018", // 구매자 우편번호
      kiccProducts: price,
    };
    IMP.request_pay(data, callback);
  }

  const removeMembership = () => {
    const paymentHistory = {
      userNo: user.userNo,
      membershipNo: 1,
    };

    axios
      .post("http://localhost:3000/Muzip/updateMembership", paymentHistory, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        alert(response.data);
        getMemberinfo();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function callback(response) {
    const { success, merchant_uid, error_msg } = response;

    if (success) {
      const paymentHistory = {
        userNo: user.userNo,
        membershipNo: membershipNo,
      };

      axios
        .post("http://localhost:3000/Muzip/updateMembership", paymentHistory, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          alert(response.data);
          getMemberinfo();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setForceClick(false);
      alert("결제가 취소되었습니다.");
    }
  }

  return (
    <>
      <button
        id={forceClick ? "aaa" : ""}
        onClick={
          user.membershipNo == 1
            ? onClickPayment
            : user.membershipNo == membershipNo
            ? () => $(".hiddenRemove").click()
            : onClickPayment
        }
        className={
          sessionStorage.getItem("darkMode") == "Y"
            ? "btn btn-light subBtn"
            : "btn btn-dark subBtn"
        }
        style={
          sessionStorage.getItem("darkMode") == "Y"
            ? { color: "black" }
            : { color: "white" }
        }
      >
        {user.membershipNo == 1
          ? "구독"
          : user.membershipNo == membershipNo
          ? "해지하기"
          : "변경하기"}
      </button>

      <button
        className="hiddenRemove"
        data-bs-toggle="modal"
        data-bs-target="#removeMembership"
      ></button>
      <div
        className="modal writeModalWrap"
        id="removeMembership"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog writeModalWrap2 modal-dialog-centered">
          <div className="modal-content writeModal ">
            <div className="modal-body">
              <div id="music-alert-msg">정말 해지하시겠습니까?</div>
            </div>

            <div className="modal-footer write-Modal-footer">
              <button
                onClick={removeMembership}
                type="button"
                id="write-music-close-btn"
                data-bs-dismiss="modal"
              >
                해지
              </button>
              <button
                type="button"
                id="write-music-close-btn"
                data-bs-dismiss="modal"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const MemberShip = (props) => {
  const { user, login } = useAuth();
  const { forceClick, setForceClick, setchangecolor } = props;
  useEffect(() => {
    if (forceClick == true) {
      setTimeout(() => {
        $("#aaa").click();
        setForceClick(false);
      }, 100);
    }
    setchangecolor("membershipClick");
  });

  return (
    <div className="myinfoWrap">
      <div id="membershipWrap">
        <div className="membershipitem1 membershipItems">
          <h4>리스너플랜</h4>
          <table>
            <tbody>
              <tr>
                <td>음악 무제한 듣기</td>
                <td>
                  <FcCheckmark />
                </td>
              </tr>
              <tr>
                <td>플레이리스트 공유</td>
                <td>
                  <FcCheckmark />
                </td>
              </tr>
              <tr>
                <td>게시글 음악첨부</td>
                <td>
                  <FcCheckmark />
                </td>
              </tr>
              <tr>
                <td>뮤집 클라우드 등록</td>
                <td>
                  <FcCancel />
                </td>
              </tr>
              <tr>
                <td>뮤집크리에이터 마크</td>
                <td>
                  <FcCancel />
                </td>
              </tr>
              <tr>
                <td>16bit 고해상도 음원</td>
                <td>
                  <FcCheckmark />
                </td>
              </tr>
            </tbody>
          </table>
          <h4>5,700원</h4>
          <div className="subscribeBtn">
            {user.membershipNo == 2 ? (
              <button id="subBtn" type="button" className="btn btn-danger">
                구독중
              </button>
            ) : (
              ""
            )}
            <Payment
              name={"리스너플랜"}
              price={"5700"}
              membershipNo={2}
              setForceClick={setForceClick}
            />
          </div>
        </div>
        <div className="membershipItems">
          <h4>라이터플랜</h4>
          <table>
            <tbody>
              <tr>
                <td>음악 무제한 듣기</td>
                <td>
                  <FcCheckmark />
                </td>
              </tr>
              <tr>
                <td>플레이리스트 공유</td>
                <td>
                  <FcCheckmark />
                </td>
              </tr>
              <tr>
                <td>게시글 음악첨부</td>
                <td>
                  <FcCheckmark />
                </td>
              </tr>
              <tr>
                <td>뮤집 클라우드 등록</td>
                <td>
                  <FcCheckmark />
                </td>
              </tr>
              <tr>
                <td>뮤집크리에이터 마크</td>
                <td>
                  <FcCheckmark />
                </td>
              </tr>
              <tr>
                <td>24bit 초고해상도 음원</td>
                <td>
                  <FcCheckmark />
                </td>
              </tr>
            </tbody>
          </table>
          <h4>10,700원</h4>
          <div className="subscribeBtn">
            {user.membershipNo == 3 ? (
              <button id="subBtn" type="button" className="btn btn-danger">
                구독중
              </button>
            ) : (
              ""
            )}
            <Payment
              name={"라이터플랜"}
              price={user.membershipNo == 2 ? "5000" : "10700"}
              membershipNo={3}
              forceClick={forceClick}
              setForceClick={setForceClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CoInfo = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageinfo, setPageinfo] = useState();
  const [contactList, setContactList] = useState([]);
  const [listcount, setListcount] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpen1, setModalOpen1] = useState(false);
  const [contactDetail, setContactDetail] = useState();
  const [formData, setFormData] = useState({
    category: "title", // 초기값 설정
    researchinput: "", // 초기값 설정
  });
  const [research, setResearch] = useState({
    category: "title",
    researchinput: "",
  });
  const formRef1 = useRef(null);
  const [rowData, setRowData] = useState();

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const openContactDetail = (data) => {
    setModalOpen1(true);
    setContactDetail(data);
  };

  const closeContactDetail = () => {
    setModalOpen1(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function Short(String) {
    if (String.length <= 10) {
      return String;
    } else {
      return String.substring(0, 10) + "...";
    }
  }

  function selectListandresearch() {
    setResearch({
      category: formData.category,
      researchinput: formData.researchinput,
    });
    setPage(1);
  }

  function selectContactListCount() {
    axios
      .post(
        "http://localhost:3000/Muzip/userSelectContactListCount",
        {
          userNo: String(user.userNo),
          category: research.category,
          researchinput: research.researchinput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setListcount(data);
      });
  }

  function selectContactList() {
    axios
      .post(
        "http://localhost:3000/Muzip/userSelectContactList",
        {
          userNo: String(user.userNo),
          currentPage: page,
          category: research.category,
          researchinput: research.researchinput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setContactList(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function insertContact(e) {
    e.preventDefault();
    const formData1 = new FormData(formRef1.current);

    if (
      formData1.get("contactTitle") == "" ||
      formData1.get("contactCont") == ""
    ) {
      alert("모든 사항을 입력해주세요!");
      return;
    }

    axios
      .post(
        "http://localhost:3000/Muzip/insertContact",
        {
          userNo: user.userNo,
          contactTitle: formData1.get("contactTitle"),
          contactCont: formData1.get("contactCont"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
        selectContactListCount();
        selectContactList();
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    closeModal();
  }

  useEffect(() => {
    selectContactListCount();
    selectContactList();
  }, [page]);

  useEffect(() => {
    if (research.researchinput !== "") {
      selectContactListCount();
      selectContactList();
    }
  }, [research]);

  return (
    <div className="myinfoWrap" id="setting_contact_wrap">
      <h2 id="setting_contact_title">문의하기</h2>
      <div id="setting_contact_research">
        <select name="category" onChange={handleInputChange}>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>
        <input
          className="contactBar"
          type="text"
          name="researchinput"
          onChange={handleInputChange}
          placeholder="검색어를 입력해주세요"
          style={
            sessionStorage.getItem("darkMode") == "Y"
              ? { border: "1px solid white" }
              : {}
          }
        />
        <button onClick={selectListandresearch}>검색</button>
      </div>
      <table id="setting_contact_tb">
        <thead>
          <tr>
            <td>문의번호</td>
            <td>제목</td>
            <td>내용</td>
            <td>작성날짜</td>
          </tr>
        </thead>
        <tbody>
          {/* onClick={() => handleModalOpen(contactList[index])} */}
          {contactList.map((item, index) => (
            <tr
              key={item.contactNo}
              onClick={() => openContactDetail(contactList[index])}
            >
              <td>{item.contactNo}</td>
              <td>{item.contactTitle}</td>
              <td>{Short(item.contactCont)}</td>
              <td>{item.contactDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div id="setting_contact_write">
        <button onClick={openModal}>작성하기</button>
      </div>

      <Paging page={page} count={listcount} setPage={setPage} />

      {contactDetail && (
        <Modal
          show={isModalOpen1}
          onHide={closeContactDetail}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            {/* <Modal.Title>문의 결과</Modal.Title> */}
            <p className="contactDetailTitle">문의결과</p>
          </Modal.Header>
          <Modal.Body>
            <table className="contactDetailtb">
              <tbody>
                <tr>
                  <td>제목: </td>
                  <td>{contactDetail.contactTitle}</td>
                </tr>
                <tr>
                  <td>내용: </td>
                  <td>{contactDetail.contactCont}</td>
                </tr>
                <tr>
                  <td>답변:</td>
                  <td>{contactDetail.adminReply}</td>
                </tr>
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
      )}

      <Modal show={isModalOpen} onHide={closeModal} centered>
        <Form ref={formRef1} onSubmit={(e) => insertContact(e)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <p>문의하기</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="contact_insert_wrap">
              <span>제목: </span>
              <input
                className="contact_text_insert"
                type="text"
                name="contactTitle"
                defaultValue=""
              />
              <span id="contact_textarea_text">내용: </span>
              <textarea
                className="contact_textarea_insert"
                name="contactCont"
                defaultValue=""
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              취소
            </Button>
            <Button variant="primary" type="submit">
              문의 작성
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export const Withdrawal = (props) => {
  const { setBtnFocus, setLoadingState } = props;
  const { user, logout } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleWithdrawal = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    axios
      .post(
        "http://localhost:3000/Muzip/withdrawal",
        {
          userNo: user.userNo,
          userId: user.userId,
          memberPwd: formData.get("memberPwd"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
        setLoadingState(false);
        logout();
        navigate("/");
        setBtnFocus("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    closeModal();
  };

  return (
    <div className="myinfoWrap">
      <form ref={formRef} onSubmit={(e) => handleWithdrawal(e)}>
        <div id="withdrawal_text1">
          <p>회원탈퇴를 하면 더이상 서비스를 이용할수 없습니다.</p>
          <p>회원탈퇴를 진행하시겠습니까?</p>
        </div>

        <input
          id="withdrawal_input"
          type="password"
          name="memberPwd"
          placeholder="현재 비밀번호 입력"
        />
        <button type="button" id="withdrawal_btn" onClick={openModal}>
          회원탈퇴하기
        </button>

        <Modal show={isModalOpen} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>회원탈퇴</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>정말 탈퇴 하시겠습니까?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              취소
            </Button>
            <Button variant="primary" onClick={handleWithdrawal}>
              회원 탈퇴
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
    </div>
  );
};
