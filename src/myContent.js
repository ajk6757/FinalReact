import "./App.css";
import {useEffect , useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {bootstrap} from 'bootstrap';
import { Tooltip ,Alert } from "react-bootstrap";
import { Button } from 'react-bootstrap';
import Modal from "bootstrap";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import Slider from "react-slick";
import{ AiFillHeart,AiOutlineHeart} from "react-icons/ai";
import {BsChatLeftDots} from "react-icons/bs";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import $ from "jquery";

function MyFeedContent(props){
    const {propsMyItems} = props;
    const {
        myfeedContentItems,
        myfeedReply,
        setMyFeedReply,
        moreMyContentTarget,
        textLimit,
        updateFeed,
    } = propsMyItems;
    const [myfeedContentItemsClone,setCloneMyItems] = useState([myfeedContentItems[0],myfeedContentItems[1],myfeedContentItems[2]]);
    
    let showMoreArr = myfeedContentItemsClone.map(() => {
        return false;
    })

    const [isMyShowMore,setIsMyShowMore] = useState(showMoreArr);

    const [isMyShowMoreClone,setIsMyShowMoreClone] = useState([...isMyShowMore]);
    const setIsMyShowMoreF = (index) => {
        for(let i = 0; i < isMyShowMoreClone.length; i++){
            if(i == index){
                isMyShowMoreClone[i] = !isMyShowMoreClone[i];
                console.log(isMyShowMoreClone);
                setIsMyShowMoreClone([...isMyShowMoreClone]);
                return;
            }
        }
    }

//     // 글 최초 렌더링
const moreMyText = (index) => {
    const shortText = myfeedContentItems[index].itemContent.slice(0, textLimit.current); 	
    if (myfeedContentItems[index].itemContent.length > textLimit.current) { 	
        if (isMyShowMoreClone[index]) { return myfeedContentItems[index].itemContent; } 	
        return shortText;			
    }
    return myfeedContentItems[index].itemContent; 			
}
//     // 글 최초 렌더링
    
//    옵저버
useEffect( () => {
    if(myfeedContentItemsClone.length >= 2){
        const myobserver = new IntersectionObserver((items) => {
            if(items[0].isIntersecting){
                if(myfeedContentItemsClone.length != myfeedContentItems.length){
                    setCloneMyItems([...myfeedContentItemsClone,myfeedContentItems[myfeedContentItemsClone.length]]);
                    setIsMyShowMore([...isMyShowMore,false]);
                    setIsMyShowMoreClone([...isMyShowMoreClone,false]);
                }
            }
        });
        myobserver.observe(moreMyContentTarget.current);
        return () => myobserver.disconnect(moreMyContentTarget.current);
    }
},[myfeedContentItemsClone])
//    옵저버

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

    // ====================== 현재 컴포넌트 리턴문 시작 =========================
    return(
        <div id="myfeedContent">
   
        {
            myfeedContentItemsClone.length != 0 ? myfeedContentItemsClone.map( (item,index) => {
            
            return(

            <div className="feedItemsWrap" key={"feedItem"+index}>
            
            {/* 컨텐츠 상단부 프로필이미지, 아이디 , 아이콘들 */}
            <div id="feedItemsTop">
                
                <div id="feedItemsTopLeft">
                 
                    <img id="feedItemsTopProfile" src="resources/icons/FB_IMG_1516870992875.jpg"/>
                    <span id="feedItemsUserId">{item.userId}</span> 
              
                </div>

                <div id="feedItemsTopIconsWrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                    </svg>
                    <Link to={"/updatefeed"} onClick={() => updateFeed(item.userId)}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                    </svg>
                    </Link>
                </div>

            </div>
            {/* 컨텐츠 상단부 프로필이미지, 아이디 , 아이콘들 */}
            

            {/* 이미지가 있다면 가운데에 위치 */}
            <div id="feedItemsMiddleWrap">
                    {item.itemImg.length > 1 ? 
                    <Slider {...settings}>
                    <div id="slickImgWrap" >
                    <img src={item.itemImg} />
                    </div>
                    <div  id="slickImgWrap">
                    <img src={item.itemImg}/>
                    </div>
                    <div  id="slickImgWrap">
                    <img src={item.itemImg}/>
                    </div>
                    </Slider>
                    : <div></div>} 
            </div>
            {/* 이미지가 있다면 가운데에 위치 */}


            {/* 사진 바로밑에 노래나 아이콘들 */}
            <div id="feedItemsBottomIconsWrap">
                <div id="feedItemsBottomIconsLeft"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-music-note-beamed" viewBox="0 0 16 16">
                <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"/>
                <path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"/>
                <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"/>
                </svg>{item.artist} - {item.music}
                </div>

                <div id="feedItemsBottomIconsRight">
                    <svg xmlns="http://www.w3.org/2000/svg"  data-bs-toggle="modal" data-bs-target={"#exampleModal"+index} width="18" height="18" fill="currentColor" className="bi bi-chat-left-dots feedItemReplyList" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    <label>{item.reply}</label>
                    <AiOutlineHeart className="boomUp"/>
                    <label>{item.heart}</label>
                </div>
            </div>
            {/* 사진 바로밑에 노래나 아이콘들 */}

                {/* 텍스트들 */}
                <div id="feedItemsTextWrap">
                    <div id="feedItemsText">
                        {moreMyText(index)}
                        &nbsp;
                        <label>
                        <a onClick={() => setIsMyShowMoreF(index)}>
                        {(item.itemContent.length > textLimit.current) && (isMyShowMoreClone[index] ? '닫기' : '...더보기')}
                        </a>
                        </label>
                    </div>
                </div>
                {/* 텍스트들 */}

                {/*=============================== 댓글열기 클릭시 열릴 모달 부분 시작 ================================ */}
                <div className="modal fade" id={"exampleModal"+index} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className={item.itemImg.length > 1 ? "modal-dialog modal-xl modal-dialog-centered": "modal-dialog  modal-dialog-centered"}>
                        <div className="modal-content " >
                            <div className="modal-header">
                                <button type="button" className="btn-close"  data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>

                {/*=============================== 모달 바디 부분 시작===================================== */}
                    <div className={"modal-body"+(item.itemImg.length > 1 ? "":" isImg")} id="modalFlex" >
                      <div id={item.itemImg.length > 1 ? "modalImgWrap" :""} className={item.itemImg.length > 1 ? "":"noImg"}>
                        <div className="modalFeedItemsWrap" style={{border:'none'}}>
                            <div id="feedItemsTop">
                
                                <div id="feedItemsTopLeft">
                                    <img id="feedItemsTopProfile" src="resources/icons/FB_IMG_1516870992875.jpg"/>
                                    <span id="feedItemsUserId">{item.userId}</span> 
                                </div>

                                <div id="feedItemsTopIconsWrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                                    </svg>
                                    <AiOutlineHeart size={20}/>                               
                                    <label>{item.heart}</label>
                                </div>
                            </div>
                {/*==================================== 모달 이미지 ================================== */}
                                    <div id="feedItemsMiddleWrap">
                                        {item.itemImg.length > 1 ? 
                                        <Slider {...settings}>
                                            <div id="slickImgWrap" >
                                                <img src={item.itemImg} />
                                            </div>
                                            <div  id="slickImgWrap">
                                                <img src={item.itemImg}/>
                                            </div>
                                            <div  id="slickImgWrap">
                                                <img src={item.itemImg}/>
                                            </div>
                                            <div  id="slickImgWrap">
                                                <img src={item.itemImg}/>
                                            </div>
                                        </Slider>
                                        : <div></div>} 
                                    </div>
               {/*==================================== 모달 이미지 ================================== */}
                            </div>
                        </div>
                {/* ========================== 모달 글내용 및 댓글부분 시작 ====================================== */}
                <div id="TextAndReplyListWrap" className={item.itemImg.length > 1 ? "":"noImg"}>
                    <div id="TextAndReplyList">

                        <div id="feedItemsBottomIconsWrap">

                            <div id="feedItemsBottomIconsLeft">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-music-note-beamed" viewBox="0 0 16 16">
                                    <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"/>
                                    <path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"/>
                                    <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"/>
                                </svg>{item.artist} - {item.music}
                            </div>

                        </div>
                        
                            <div id="feedItemsTextWrap">
                                <div id="feedItemsText">
                                    {item.itemContent}
                                    <br/><br/>

                                    <table id="replyTable" >
                                        <tbody>
                                        {
                                            myfeedReply.map((modalItem,index) => {
                                                return(
                                                    <tr id="feedReplyWrap" key={"reply"+index}>
                                                        <td id="replyImgWrap"><img id="replyImg" src={modalItem.replyImg} /> </td>
                                                        <td id="replyUserId">{modalItem.replyUserId}</td>
                                                        <td id="replyContent" className={item.itemImg.length > 1 ? "":"noImgReply"}>{modalItem.replyContent}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                    </div>
                            <form id="myReplyForm">
                                <textarea className="" id="myReply" placeholder="댓글달기" name="myReply"></textarea>
                                <button type="submit" id="submitBtn" className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-chat-left-dots" viewBox="0 0 16 16">
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
            }) : <div id="noResultSearch">게시물이 없습니다.</div>
        }
                                        {/* 감시중인 요소 (항상 하단부에 위치) */}
                    <div id="circle" ref={moreMyContentTarget}></div>

          



        </div>

        
    )
}
export default MyFeedContent;