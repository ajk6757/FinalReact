import "./App.css";
import {useEffect , useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {bootstrap} from 'bootstrap';
import { Tooltip ,Alert } from "react-bootstrap";
import { Button } from 'react-bootstrap';
import Modal from "bootstrap";
import { Route, Link, Routes, useLocation, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import{ AiFillHeart,AiOutlineHeart} from "react-icons/ai";
import {BsChatLeftDots} from "react-icons/bs";
import {RiDeleteBack2Line} from "react-icons/ri";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import $ from "jquery";
import axios from "axios";
import { useAuth } from "./LoginContext";
import { useSelector,useDispatch } from "react-redux";
import { changeFeedMusicList, changeFeedMusicListSelected, changeSelectedFeedListIndex, changeSelectedFeedSongIndex} from "./redux/musicListSlice";
function MyFavFeedContent(props){
    const {propsMyItems ,pageUserNo} = props;
    const {
        feedContentItems,
        textLimit,
      //  boomUp,
        updateFeed,
        imageUrl,
        user,
      //  newReplyInputChange,
      //  newReply,
      //  replyInsert,
        userIdList,
        profileImgList,
        allMusicList
    } = propsMyItems;
    const navigate = useNavigate();
    const [myFavItems,setMyFavItems] = useState([]);
    const [myFavItemsShowMore,setMyFavItemsShowMore] = useState([]);
    const alarmStompClient = useSelector((state)=>state.alarmState.alarmStompClient);
    
    const setUp = () =>{
        if(myFavItems.length == 0){
            feedContentItems.forEach((item) => {
                if(item.likeList.some((item) => Number(item.userNo) === Number(pageUserNo))){
                    myFavItems.push(item);
                    myFavItemsShowMore.push(false);
                }
            })
            if(myFavItems.length == 0){
                myFavItems.push({boardNo:0});
            }
            setMyFavItems(myFavItems);
            setMyFavItemsShowMore(myFavItemsShowMore);
        }
    }
    setUp();
    
    const setMyFavIsShowMoreF = (index) => {
        for(let i = 0; i < myFavItemsShowMore.length; i++){
            if(i == index){
                myFavItemsShowMore[i] = !myFavItemsShowMore[i];
                setMyFavItemsShowMore([...myFavItemsShowMore]);
                return;
            }
        }
    }
    
    const moreText = (index) => {
        const shortText = myFavItems[index].boardContent.slice(0, textLimit.current); 	
        if (myFavItems[index].boardContent.length > textLimit.current) { 
            if (myFavItemsShowMore[index]) { return myFavItems[index].boardContent; } 	
            return shortText;		
        }
        return myFavItems[index].boardContent; 		
    }
    //    최초 글 렌더링
    const boomUp = (index, bNo) => {
            axios
          .post(`http://localhost:3000/Muzip/boomUp?userNo=${user.userNo}&boardNo=${bNo}`)
          .then((response) => {
            if (response.data === "삭제") {
                const updatedClone = [...myFavItems];
                updatedClone[index].likeList = updatedClone[index].likeList.filter((item) => Number(item.userNo) !== Number(user.userNo));
                updatedClone.splice(index,1);
                setMyFavItems(updatedClone);
            }
            if (response.data === "삽입") {
              const updatedClone = [...myFavItems];
              updatedClone[index].likeList.push({ userNo: user.userNo, boardNo: bNo });
              setMyFavItems(updatedClone);
            }
          })
          .catch((error) => {
            console.error("에러 발생:", error);
          });
      };



      const [newReply , setNewReply] = useState({replyContent:""});
        const newReplyInputChange = (e) => {
            const {name,value} = e.target;
            setNewReply({...newReply,[name] : value});
        }

        const replyInsert = (e,boardNo,index) => {
        if(newReply.replyContent != ""){
        e.preventDefault();
        const formData = new FormData();
        formData.append("refBno",boardNo);
        formData.append("userNo", user.userNo);
        formData.append("replyContent", newReply.replyContent);

        axios
        .post("http://localhost:3000/Muzip/insertReply",formData,{  
        headers:{'Content-Type' : 'application/json'}
        })
        .then((response) => {
         setNewReply({replyContent:""})
         const updatedClone = [...myFavItems];
         updatedClone[index].replyList.unshift(response.data);
         setMyFavItems(updatedClone);
         const replyAlarm = sessionStorage.getItem("replyAlarm");
         if(replyAlarm = 'Y'){
             const newAlarm = {
                alarmNo : "",
                alarmMessage : "",
                receiverNo : "",
                senderNo : user.userNo,
                alarmKind : "reply",
                alarmPath : boardNo,
                createDate : new Date().toISOString(),
                checkStatus : 'N',
                status : 'Y'
              };
              alarmStompClient.send('/alarm/alarm', {}, JSON.stringify(newAlarm));
            }
        })
        .catch((error) => {
          console.error("에러 발생:", error);
        });
        }else{
            alert("댓글을 작성해주세요");
            e.preventDefault();
        }
}
    // 댓글 추가

    const deleteReply = (e,replyNo,index,boardNo) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("replyNo",replyNo);
        axios
        .post("http://localhost:3000/Muzip/deleteReply",formData,{  
       headers:{'Content-Type' : 'application/json'}
        })
        .then((response) => {
            if(response.data== "댓글이 삭제되었습니다."){
                const updatedClone = [...myFavItems];
                updatedClone.forEach((item) =>{
                    if(item.boardNo == boardNo){
                        item.replyList.splice(index,1);
                    }
                })
                setMyFavItems(updatedClone);
                alert(response.data);
            }
        })
        .catch((error) => {
          console.error("에러 발생:", error);
        });
    }
  
        // ===================================== 이미지 슬릭 ===========================================
        const SampleNextArrow = (props) => {
            const { className, style, onClick } = props;
            return (
              <div
                className={className}
                style={{position:"absolute" ,right:"60px" ,zIndex:"99" , opacity:"0.9"  }}
                onClick={onClick}
              />
            );
          };
          const SamplePrevArrow = (props) => {
            const { className, style, onClick } = props;
            return (
              <div
                className={className}
                style={{ position:"absolute" ,left:"50px" ,zIndex:"99" , opacity:"0.9"}}
                onClick={onClick}
              />
            );
          };
        const settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
            appendDots: (dots) => (
                <div
                  style={{
                    width: '100%',
                    position: 'absolute',
                    bottom: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
             <ul>{dots}</ul>
             </div>
              ),
              dotsClass: 'dots_custom'
          };
        // ===================================== 이미지 슬릭 ===========================================
            
        function pressReplyEnter(e,boardNo,index){
            if (e.key == "Enter" || e.keyCode == "13"){
                replyInsert(e,boardNo,index)
            }
        }

        // ================ 음악 재생 ==========================

    const dispatch = useDispatch();

    const playFeedMusic = (musicNo) => {

        axios.get("http://localhost:3000/Muzip/selectOneMusic", { // delete
            params : {
                musicNo : musicNo
            },
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            let tempArr = [];
            if (response.data === null || response.data === undefined) {
                dispatch(
                    changeFeedMusicList({
                        feedMusicList: [...tempArr],
                    })
                );
            } else {
                tempArr[0] = {
                    listName: "피드 음악",
                    songList: [response.data],
                };
                dispatch(
                    changeFeedMusicList({
                        feedMusicList: [...tempArr],
                    })
                );
            }
        }).catch(console.log);

        dispatch(
          changeSelectedFeedListIndex({ selectedFeedListIndex: 0 })
        );
        dispatch(
          changeSelectedFeedSongIndex({ selectedFeedSongIndex: 0 })
        );
        dispatch(changeFeedMusicListSelected({ feedMusicListSelected: true }));
    };

    // ================= 음악 재생끝=========================


        // ====================== 현재 컴포넌트 리턴문 시작 =========================
        return(
            <div id="myfeedContent">
            {
                myFavItems[0].boardNo != 0 ? myFavItems.map( (item,index) => {
                
                return(
                   
                <div className="feedItemsWrap" key={"feedItem"+index}>
                
                {/* 컨텐츠 상단부 프로필이미지, 아이디 , 아이콘들 */}
                <div id="feedItemsTop">
                    
                    <div id="feedItemsTopLeft" onClick={() => navigate(`/user/${item.userNo}`)}> 
                     
                        <img id="feedItemsTopProfile" src={imageUrl+profileImgList[item.userNo]}/>
                       <span id="feedItemsUserId">{userIdList[item.userNo]}</span>
                  
                    </div>
    
                    <div id="feedItemsTopIconsWrap">
                        {(item.secret == "Y") &&(user.userNo == item.userNo) ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                        </svg>
                         :""   }
                         {(user.userNo == item.userNo) ?
                        <Link to={"/updatefeed"} onClick={() => updateFeed(item.boardNo)}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                        </svg>
                        </Link> : ""}
                    </div>
    
                </div>
                {/* 컨텐츠 상단부 프로필이미지, 아이디 , 아이콘들 */}
                
    
                {/* 이미지가 있다면 가운데에 위치 */}
                <div id="feedItemsMiddleWrap">
                        {item.attachList.length > 0 ? 
                            <Slider {...settings}>
                                {item.attachList.map((item) => {
                                    return(
                                        <div id="slickImgWrap" >
                                        <img src={imageUrl+item.changeName}/>
                                        </div>
                                    )
                                })}
                            </Slider>
                        : <div></div>} 
                </div>
                {/* 이미지가 있다면 가운데에 위치 */}
    
                {/* 사진 바로밑에 노래나 아이콘들 */}
                <div id="feedItemsBottomIconsWrap">
    
                    <div id="feedItemsBottomIconsLeft">
                        {item.musicNo !== null   ?
                            <>
                                <svg onClick={()=>playFeedMusic(item.musicNo)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-music-note-beamed" viewBox="0 0 16 16">
                            <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"/>
                            <path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"/>
                            <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"/>
                            </svg><span onClick={()=>playFeedMusic(item.musicNo)}>{allMusicList[item.musicNo]}</span>
                            </>
                        :""}
                    </div>
                                   
    
                    <div id="feedItemsBottomIconsRight">
                        <svg xmlns="http://www.w3.org/2000/svg"  data-bs-toggle="modal" data-bs-target={"#exampleModal"+index} width="18" height="18" fill="currentColor" className="bi bi-chat-left-dots feedItemReplyList" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        </svg>
                        <label>{item.replyList.length}</label>
                            {item.likeList.length === 0 ? (
                                <AiOutlineHeart className="boomUp" onClick={() => boomUp(index,item.boardNo)} />
                                ) : (
                                item.likeList.some((item) => Number(item.userNo) === Number(user.userNo)) ? (
                                    <AiFillHeart className="boomUp" onClick={() => boomUp(index,item.boardNo)}/>
                                ) : (
                                    <AiOutlineHeart className="boomUp" onClick={() => boomUp(index,item.boardNo)} />
                                )
                            )}
                   
                         <label>{item.likeList.length}</label> 
                    </div>
                </div>
                {/* 사진 바로밑에 노래나 아이콘들 */}
    
    
                    {/* 텍스트들 */}
                    <div id="feedItemsTextWrap">
                        <div id="feedItemsText">
                            {moreText(index)}
                            &nbsp;
                            <label>
                            <a onClick={() => setMyFavIsShowMoreF(index)}>
                            {(item.boardContent.length > textLimit.current) && (myFavItemsShowMore[index] ? '닫기' : '...더보기')}
                            </a>
                            </label>
                        </div>
                    </div>
                    {/* 텍스트들 */}
    
    
                    {/*=============================== 댓글열기 클릭시 열릴 모달 부분 시작 ================================ */}
                    <div className="modal fade" id={"exampleModal"+index} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className={item.attachList.length > 0 ? "modal-dialog modal-xl modal-dialog-centered": "modal-dialog  modal-dialog-centered"}>
                            <div className={sessionStorage.getItem("darkMode") == "Y" ?"modal-content bg-dark":"modal-content"} >
                                <div className="modal-header">
                                    <button type="button" className={sessionStorage.getItem("darkMode") == "Y" ? "btn-close btn-close-white" : "btn-close"}  data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
    
                    {/*=============================== 모달 바디 부분 시작===================================== */}
                     
                        <div className={"modal-body"+(item.attachList.length > 0 ? "":" isImg")} id="modalFlex" >
                          <div id={item.attachList.length > 0 ? "modalImgWrap" :""} className={item.attachList.length > 0 ? "":"noImg"}>
                            <div className="modalFeedItemsWrap" style={{border:'none'}}>
                                <div id="feedItemsTop">
                    
                                    <div id="feedItemsTopLeft">
                                        <img id="feedItemsTopProfile" src={imageUrl+profileImgList[item.userNo]}/>
                                        <span id="feedItemsUserId">{userIdList[item.userNo]}</span> 
                                    </div>
    
                                    <div id="feedItemsTopIconsWrap">
                                    {(user.userNo == item.userNo) ?
                                    <Link to={"/updatefeed"}  onClick={() => updateFeed(item.boardNo)}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16" data-bs-dismiss="modal">
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                                    </svg>
                                    </Link> : ""}
                                            {item.likeList.length === 0 ? (
                                                <AiOutlineHeart className="boomUp" onClick={() => boomUp(index,item.boardNo)} />
                                                ) : (
                                                item.likeList.some((item) => Number(item.userNo) === Number(user.userNo)) ? (
                                                    <AiFillHeart className="boomUp" onClick={() => boomUp(index,item.boardNo)}/>
                                                ) : (
                                                    <AiOutlineHeart className="boomUp" onClick={() => boomUp(index,item.boardNo)} />
                                                )
                                            )}                              
                                        <label>{item.likeList.length}</label>
                                    </div>
                                </div>
    
                    {/*==================================== 모달 이미지 ================================== */}
                                        <div id="feedItemsMiddleWrap">
                                            {item.attachList.length > 0 ? 
                                            <Slider {...settings}>
                                                {item.attachList.map((item) => {
                                                return(
                                                    <div id="slickImgWrap" >
                                                    <img src={imageUrl+item.changeName}/>
                                                    </div>
                                                    )
                                                 })}
                                            </Slider>
                                            : <div></div>} 
                                        </div>
                   {/*==================================== 모달 이미지 ================================== */}
                                </div>
                            </div>
                    {/* ========================== 모달 글내용 및 댓글부분 시작 ====================================== */}
                    <div id="TextAndReplyListWrap" className={item.attachList.length > 0 ? "":"noImg"}>
                        <div id="TextAndReplyList">
    
                                {item.musicNo !== null   ?
                                    <div id="feedItemsBottomIconsWrap">
                                            <div id="feedItemsBottomIconsLeft">
                                                <svg onClick={()=>playFeedMusic(item.musicNo)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-music-note-beamed" viewBox="0 0 16 16">
                                                    <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"/>
                                                    <path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"/>
                                                    <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"/>
                                                </svg><span onClick={()=>playFeedMusic(item.musicNo)}>{allMusicList[item.musicNo]}</span>
                                            </div>
                                    </div>
                                :""}
                            
                                <div id="feedItemsTextWrap">
                                    <div id="feedItemsText">
                                        {item.boardContent}
                                        <br/><br/>
    
                                        <table id="replyTable" >
                                            <tbody>
                                            {
                                                item.replyList.map((replyItem,index) => {
                                     
                                                    return(
                                                        <tr id="feedReplyWrap" key={"reply"+index}>
                                                            <td id="replyImgWrap" onClick={() => navigate(`/user/${replyItem.userNo}`)} data-bs-dismiss="modal"><img id="replyImg" src={imageUrl+profileImgList[replyItem.userNo]}/> </td>
                                                            <td id="replyUserId" onClick={() => navigate(`/user/${replyItem.userNo}`)} data-bs-dismiss="modal">{userIdList[replyItem.userNo]}</td>
                                                            <td id="replyContent" className={item.attachList.length > 0 ? "wrap-text":"noImgReply wrap-text"}>{replyItem.replyContent}</td>
                                                            {user.userNo == replyItem.userNo ?
                                                            <td id="replyDelete" className="replyHover"><RiDeleteBack2Line onClick={(e) =>deleteReply(e,replyItem.replyNo,index,item.boardNo)}/></td> : ""
                                                            }
                                                        </tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                        </div>
                                <form id="myReplyForm" onSubmit={(e) =>replyInsert(e,item.boardNo,index)}>
                                    <textarea className={sessionStorage.getItem("darkMode") == "Y" ?"bg-dark":""} id="myReply" placeholder="댓글달기" name="replyContent" value={newReply.replyContent} onChange={newReplyInputChange} onKeyUp={(e) =>pressReplyEnter(e,item.boardNo,index)} style={sessionStorage.getItem("darkMode") == "Y" ? {color:"white"}:{}}></textarea>
                                    <button type="submit" id="submitBtn" className={sessionStorage.getItem("darkMode") == "Y" ?"bg-dark":""}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-chat-left-dots" viewBox="0 0 16 16" style={sessionStorage.getItem("darkMode") == "Y" ? {color:"white"}:{}}>
                                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                        <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                        </svg>
                                    </button>
                                </form>
                    </div>
                    {/* ========================== 모달 글 밑 댓글부분 끝 ====================================== */}
                              </div>
                {/*=============================== 모달 바디 부분 끝===================================== */}
                            </div>
                        </div>
                    </div>
                {/*=============================== 댓글열기 클릭시 열릴 모달 부분 끝 ================================ */}
               </div>
    
                )
                }) : <div id="noResultSearch">좋아요한 게시물이 없습니다.</div>
            }
                                          
            </div>
        )
}
export default MyFavFeedContent;