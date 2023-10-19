import "./App.css";
import {  Link ,useLocation, useNavigate} from "react-router-dom";
import { useEffect ,useState } from "react";
import $ from 'jquery';
import { BsPersonLinesFill } from "react-icons/bs";
import { PiBookOpenText } from "react-icons/pi";
import {
  AiOutlinePlusSquare,
  AiOutlineSetting,
  AiOutlineHome,AiFillHeart,AiOutlineHeart
} from "react-icons/ai";
import { BsCloudPlus } from "react-icons/bs";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineBellAlert,
} from "react-icons/hi2";
import { MdManageAccounts } from "react-icons/md";
import { useAuth } from "./LoginContext";
import {  FcCheckmark } from "react-icons/fc";
function Menubar(props){
const {handlePageChange,btnFocus,setBtnFocus,forceClick, setForceClick,setchangecolor} = props;
  
  const {user} = useAuth();
  const [isUser,setIsUser] = useState();
  const navigate = useNavigate();
  
  const location = useLocation();

  useEffect(() => {
    // 컴포넌트가 마운트될 때 실행되는 코드
    if(btnFocus["id"]) return;
    // 각 li 태그 중에서 id 값이 현재 URL과 일치하는 것의 배경색을 변경
    setBtnFocus({id :location.pathname })
  }, [btnFocus]);


  useEffect(() => {
    // 링크 클릭 시 페이지 새로 고침
    const handleClick = (event) => {
        const clickedUrl = event.target.getAttribute("name");
        
      if (clickedUrl === location.pathname) {
        event.preventDefault();
        window.location.reload();
      }
    };

    // 모든 링크에 클릭 이벤트 리스너 추가
    const links = document.querySelectorAll('li');
    links.forEach(link => {
      link.addEventListener('click', handleClick);
    });


    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleClick);
      });
    };
  }, [location]);

    
  const forcePay = () =>{
    setForceClick(true);
    navigate("/settings/membership");
    
  }

  const clickEvent = (e) => {
    if(e.target.id == "/cloud" && user.membershipNo != 3 && user.membershipNo != 0){
      e.preventDefault();
      $("#noWriterPlanBtn").click();
    }
    else{
      setBtnFocus({"id" : e.target.id })
      handlePageChange(e);
      if(user != null){
        setIsUser(true);
      }else{
        setIsUser(false);
        alert("로그인 후 이용해주세요");
      }
    }
  }

  return(
    <>
      <div id="menubar">
          <ul>
            <div id="home-Logo"><h2 id="home-Logo">Muzip</h2></div>
            {((user == null) || (user &&user.membershipNo!=0)) &&
              <Link to={"/"}><li id="/" onClick={clickEvent} className={btnFocus["id"] && btnFocus["id"] == "/" ? "menubarBtnClick" : ""} >
                  <div name="/">
                  <AiOutlineHome size={28}/>Home
                  </div>
              </li></Link>}

             {((user == null) || (user &&user.membershipNo!=0)) &&
              <Link to={user ? "/feed" : "/"}><li  id="/feed" onClick={clickEvent} className={btnFocus["id"] && btnFocus["id"] == "/feed" ? "menubarBtnClick" : ""} >
                <div name="/feed">
                <PiBookOpenText size={28} />Feed
                </div>
              </li></Link>}

              {((user == null) || (user &&user.membershipNo!=0)) &&
              <Link to={user ? "/write": "/"}><li  id="/write" onClick={clickEvent} className={btnFocus["id"] && btnFocus["id"] == "/write" ? "menubarBtnClick" : ""}>
                <div name="/write">
                  <AiOutlinePlusSquare size={28} />Write
                </div>
                </li></Link>}

             
                {((user == null) || (user &&user.membershipNo!=0)) &&
               <Link to={user ? "/friend" : "/"}><li id="/friend" onClick={clickEvent} className={btnFocus["id"] && btnFocus["id"] == "/friend" ? "menubarBtnClick" : ""}>
                <div>
                <BsPersonLinesFill size={28} />Friends
                </div>
              </li></Link>}
              
              {/* {user&&user.membershipNo==3 &&
              <Link to={user ? "/cloud" : "/"} ><li id="/cloud" onClick={clickEvent} className={btnFocus["id"] && btnFocus["id"] == "/cloud" ? "menubarBtnClick" : ""}>
                <div name="/cloud">
                <BsCloudPlus size={28} />Music
              </div></li></Link>} */}
           
              <Link to={user ? "/cloud" : "/"}><li  id="/cloud" onClick={clickEvent} className={btnFocus["id"] && btnFocus["id"] == "/cloud" ? "menubarBtnClick" : ""}>
                <div  name="/cloud" id="/cloud" style={(user&&user.membershipNo != 3&&user.membershipNo != 0)? {color:"rgb(182, 182, 182)"}:{}}>
                <BsCloudPlus size={28}  style={(user&&user.membershipNo != 3&&user.membershipNo != 0)? {fill:"rgb(182, 182, 182)"}:{}}/>Music
              </div></li></Link>

              {((user == null) || (user &&user.membershipNo!=0)) &&
              <Link to={user ? "/chat" : "/"}><li id="/chat" onClick={clickEvent} className={btnFocus["id"] && btnFocus["id"] == "/chat" ? "menubarBtnClick" : ""}>
                <div>
                <HiOutlineChatBubbleLeftRight size={28} />Chats
              </div></li></Link>}

              {((user == null) || (user &&user.membershipNo!=0)) &&
              <Link to={user ? "/settings/set" : "/"}><li id="/settings/set" onClick={clickEvent} className={btnFocus["id"] && btnFocus["id"] == "/settings/set" ? "menubarBtnClick" : ""}>
                <div>
                <AiOutlineSetting size={28} />Settings
              </div></li></Link>}

              {user&&user.membershipNo==0 &&
              <Link to={user ? "/adminpage" : "/"}><li id="/adminpage" onClick={clickEvent} className={btnFocus["id"] && btnFocus["id"] == "/adminpage" ? "menubarBtnClick" : ""}>
                <div>
                <MdManageAccounts size={28} />AdminPage
              </div></li></Link>}


                </ul>
            <button type="button" id="noWriterPlanBtn" className="btn btn-primary" data-bs-toggle="modal" style={{display:"none"}} data-bs-target="#noWriterPlan"></button>
      </div>
                    {/* 결제유도 모달 */}
                    <div className="modal fade " id="noWriterPlan" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div className="modal-dialog modal-dialog-centered ">
                        <div className={sessionStorage.getItem("darkMode") == "Y" ?"modal-content bg-dark noWriterPlan":"modal-content noWriterPlan"}>
                          <div className="modal-header" style={{borderBottom:"none"}}>
                            
                            <button type="button" className={sessionStorage.getItem("darkMode") == "Y" ? "btn-close btn-close-white" : "btn-close"} data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body">
                            
                          <div className="noWriterPlanItem">
                            <h3 style={sessionStorage.getItem("darkMode") == "Y" ? {borderBottom:"1px solid white"}:{}}>라이터플랜</h3>
                            <table>
                                <tbody>

                                    <tr>
                                        <td>음악 무제한 듣기</td>
                                        <td><FcCheckmark /></td>
                                    </tr>
                                    <tr>
                                        <td>플레이리스트 공유</td>
                                        <td><FcCheckmark /></td>
                                    </tr>
                                    <tr>
                                        <td>게시글 음악첨부</td>
                                        <td><FcCheckmark /></td>
                                    </tr>
                                    <tr>
                                        <td>뮤집 클라우드 등록</td>
                                        <td><FcCheckmark /></td>
                                    </tr>
                                    <tr>
                                        <td>뮤집크리에이터 마크</td>
                                        <td><FcCheckmark /></td>
                                    </tr>
                                    <tr>
                                        <td>24bit 초고해상도 음원</td>
                                        <td><FcCheckmark /></td>
                                    </tr>
                                </tbody>
                            </table>
                            <h3 style={sessionStorage.getItem("darkMode") == "Y" ? {borderBottom:"1px solid white"}:{}}>10,700원</h3>
                            <br/>
                            <h5>음원 등록은 라이터플랜 구독후에 가능합니다</h5>
                            <h5>지금 구독하시겠습니까?</h5>
                          </div>

                          </div>
                          <div className="modal-footer" style={{border:"none",display:"flex",justifyContent:"center"}}>
                            <button type="button" className="btn btn-primary" id="noPlanBtn" data-bs-dismiss="modal" onClick={forcePay} style={{marginRight:"30px"}}>이동</button>
                            <button type="button" className="btn btn-secondary" id="noPlanBtn"  data-bs-dismiss="modal">취소</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 결제유도 모달 */}
</>
  )
}




             
export default Menubar;