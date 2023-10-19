import "./App.css";
import Menubar from "./menubar";
import { HomeFeed } from "./HomeFeed";
import { BrowserRouter , Link , Route , Routes, useNavigate ,useLocation, useParams} from "react-router-dom";
import { useEffect ,useState , useRef } from "react";
import {MoveToTop} from './MoveToTop';
import { WriteComponent } from "./WriteComponent";
import { Cloud } from "./Cloud";
import { UpdateFeed } from "./UpdateFeed";
import MypageBody from "./component/mypageBody";
import "bootstrap/dist/css/bootstrap.min.css";
import MuzipWrap from "./MuzipWrap";
import ChatRoom from "./ChatRoom";
import {FriendSearch} from "./FriendsList";
import { Ltest } from "./Ltest";
import { useAuth } from "./LoginContext";
import {Settings ,MyInfo, MySet, MemberShip,CoInfo,Withdrawal} from "./Settings";
import {Side} from "./side.js"
import axios from "axios";
import $ from "jquery";
import { useSelector,useDispatch} from "react-redux";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { addNewAlarm, alarmLoadingFalse, alarmLoadingTrue, changeAlarm,changeStompClient } from "./redux/alarmSlice";
import {Adminpage, ManageMember,ManageContent,ManageMusic,ManageComplain,ManagePayment} from "./adminpage";
import ChatArea from "./ChatArea";

function App() {
    const {darkmodeSet,setDarkmode} = useAuth();
    const {user} = useAuth();

    const isDark = () =>{
        if(user&&sessionStorage.getItem("darkMode") == "Y"){
            $("#root").css("backgroundColor","rgb(41, 46, 50)");
            $("#root *").css("color","white");
            $("#root input").css("color","white");
            $("input").css("color","white");
            $("#menubar *").css("color","white");
            $("#settingList *").css("color","white");
            $("#MuzipBodyWrap").css({backgroundColor:"rgb(33,37,41)",color:"white"});
            $("#writeBodyWrap button").css({color:"black"});
            $("#settingWrap button").css({color:"black"});
            $("#setting_contact_research select").css({color:"black"});
            $("#muzipbar-outer *").css("color", "white");
            $(".toSongInfo").css("color","black");
            $(".myPlayListBtns button").css("color","black");
            $("#writeBtn").css("color","black");
            $(".searchInput").css("color","black");
            $(".friend_box_search_list input").css("color","black");
            $(".friend_box_main_ch input").css("color","black");
            $("#inputChatting").css("color","black");
            $(".search_chat_member").css("color","black");
            $("#newPlayListName").css("color","black");

           }else{
            $("#root").css("backgroundColor","");
            $("#root *").css("color","black");
            $("#settingList *").css("color","black");
            $("#settingItem *").css("color","black");
            $("#menubar *").css("color","black");
            $("#MuzipBodyWrap").css({backgroundColor:"white",color:""});
            $(".subBtn").css("color","white");
            $("#muzipbar-outer *").css("color", "white");
            $(".toSongInfo").css("color","black");
            $(".myPlayListBtns button").css("color","black");
            $(".searchInput").css("color","black");
            $("#writeBodyWrap .modal-body *").css("color","white");
            $("#newPlayListName").css("color","black");
        }
    }

    const navigate = useNavigate();
    useEffect(() =>{
        isDark();
    },[darkmodeSet])


    const [btnFocus , setBtnFocus] = useState({});
    const imageUrl = 'http://localhost:3000/Muzip/resources/image/';
    // 피드컨텐츠
    const { pageUserNo } = useParams();
    let [feedContentItems,setItems] = useState([]);
    const [feedContentItemsClone,setCloneItems] = useState([]);
    let [loadingState,setLoadingState] = useState(false);
    let [itemCount,setItemCount] =useState(0);

    const renderFeed = () => {
        setItemCount(itemCount);
        for(let i =0; i < itemCount; i++){
            feedContentItemsClone.push(feedContentItems[i]);
            isShowMoreClone.push(false);
        }
        setCloneItems(feedContentItemsClone);
        setIsShowMoreClone(isShowMoreClone);
    }
    
    // 무한스크롤
    const moreFeed = () => {
        setCloneItems([...feedContentItemsClone,feedContentItems[itemCount]]);
        setIsShowMoreClone([...isShowMoreClone,false]);
        setItemCount(itemCount+1);
    }
    // 무한스크롤
  
    const getBoardList =  () => {
        if(loadingState == false){
            setCloneItems([]);
            setIsShowMoreClone([]);
            axios.post("http://localhost:3000/Muzip/selectBoardList")
            .then(response => {
                feedContentItems.splice(0, feedContentItems.length);
                response.data.forEach((item) => {
                    feedContentItems.push(item);
                });
                itemCount = feedContentItems.length <= 5 ? feedContentItems.length : 5;
                renderFeed();
            }).catch(console.log("캐치에러"));
            setLoadingState(true);
        }
    };
    // 피드컨텐츠

    const [isShowMoreClone,setIsShowMoreClone] = useState([]);

    // 옵저버로 감시중인 요소
    const moreContentTarget = useRef();
    
    const search = useRef(null);
    
    // 최초로 랜더링될 글자수 제한
    const textLimit = useRef(110); 

    // 모든 유저 아이디 및 프로필이미지 가져오기
    const [userIdList, setUserIdList] = useState({});
    const getUserIdList = () => {
            axios
            .get("http://localhost:3000/Muzip/getUserIdList")
            .then((response) => {
                response.data.forEach((item) => {
                    setUserIdList((prevUserIdList) => ({ ...prevUserIdList, [item.KEY]: item.VALUE }));
                })
            })
            .catch((error) => {
                console.log("캐치")
            });
    };

    const [profileImgList, setProfileImgList] = useState({});
    const getUserProfileImgList = () => {
            axios
            .get("http://localhost:3000/Muzip/getUserProfileImgList")
            .then((response) => {
                
                response.data.forEach((item) => {
                    setProfileImgList((prevProfileImg) => ({ ...prevProfileImg, [item.KEY]: item.VALUE }));
                })
            })
            .catch((error) => {
                console.log("캐치")
            });
        }
    // 모든 유저 아이디 및 프로필이미지 가져오기
   

    const [allMusicList, setAllMusicList] = useState({});
    const getAllMusicList = () => {
            axios
            .get("http://localhost:3000/Muzip/getAllMusicList")
            .then((response) => {
                response.data.forEach((item) => {
                    setAllMusicList((prevMusicList) => ({ ...prevMusicList, [item.KEY]: item.VALUE }));
                })
            })
            .catch((error) => {
                console.log("캐치")
            });
        }
   
    // 모든 유저 아이디,프로필, 모든음악정보 불러오기
    useEffect(() =>{
        getUserIdList();
        getUserProfileImgList();
        getAllMusicList();
        getBoardList();
    },[loadingState]);
    getBoardList();
    
    // 모든 유저 아이디,프로필, 모든음악정보 불러오기
    
    // 검색 함수
        const searchF = () => {
        let searchItems = feedContentItems.filter((item) => {
            if(
                item.boardContent.includes(search.current.value)||
                item.userId.includes(search.current.value)){
                  
                    return true;
            }else{
                return false;
            }
        });
            setCloneItems(searchItems);

            if(search.current.value != undefined && search.current.value != ""){
                axios.get(`http://localhost:3000/Muzip/insertKeyword?keyword=${search.current.value}`);
            }
        }
    // 검색 함수
      
    // 긴글 더보기 함수
    const setIsShowMoreF = (index) => {
        for(let i = 0; i < isShowMoreClone.length; i++){
            if(i == index){
                isShowMoreClone[i] = !isShowMoreClone[i];
                setIsShowMoreClone([...isShowMoreClone]);
                return;
            }
        }
    }
    // 긴글 더보기 함수

    // 좋아요 함수
    const boomUp = (index, bNo) => {
        axios
          .post(`http://localhost:3000/Muzip/boomUp?userNo=${user.userNo}&boardNo=${bNo}`)
          .then((response) => {
            if (response.data === "삭제") {
              const updatedClone = [...feedContentItemsClone];
              updatedClone[index].likeList = updatedClone[index].likeList.filter((item) => Number(item.userNo) !== Number(user.userNo));
              setCloneItems(updatedClone);
            }
            if (response.data === "삽입") {
              const updatedClone = [...feedContentItemsClone];
              updatedClone[index].likeList.push({ userNo: user.userNo, boardNo: bNo });
              setCloneItems(updatedClone);
            }
          })
          .catch((error) => {
            console.error("에러 발생:", error);
          });
      };
    // 좋아요 함수
   
    // 새 게시물 추가
   const [newFeedItem , setNewFeedItem] = useState({feedTextContent:""});
   const [selectedFiles, setSelectedFiles] = useState([]);
   const [updateSelectedFiles, setUpdateSelectedFiles] = useState([]);
   const [imgs,setImgs] = useState([imageUrl+"img-upload.png"]);
   const [updateImgs,setupdateImgs] = useState([]);
   const [updateFeedItem , setUpdateFeedItem] = useState({updateTextContent:""});
   
    // 업데이트
    let [updateItem,setUpdateItem] = useState();
 
    const updateFeed = (boardNo) => {
        const _ = require('lodash');
        let clonClone = _.cloneDeep(feedContentItems);

        updateItem = clonClone.filter((item) => {
            if(item.boardNo === boardNo){
                return true;
            }else{
                return false;
            }
        });
       
        if(updateItem[0].attachList.length < 5 ){
            updateItem[0].attachList.push({changeName:"img-upload.png"});
        }
        updateItem[0].attachList.forEach((item) =>{
            updateImgs.push({url:imageUrl+item.changeName,fileLevel:item.fileLevel});
        })
        setUpdateFeedItem({updateTextContent:updateItem[0].boardContent});
        setFilesAttached(true);
        setupdateImgs(updateImgs);
        setUpdateItem(updateItem);
    }
    // 업데이트

    const deleteItems = async (boardNo) => {

        const newData = new FormData();
        newData.append("boardNo",boardNo);
        const response = await fetch("http://localhost:3000/Muzip/deleteBoard",
        {
            method : 'POST',
            body : newData 
        });

        const responseData = await response.text();
        if(responseData == "게시물이 삭제되었습니다."){
             setUpdateSelectedFiles([]);
             setNewFeedItem({updateTextContent:""});
             setFilesAttached(false);
             setCloneItems([]);
             setItems([]);
             setIsShowMoreClone([]);
             setLoadingState(false);
             setupdateImgs([]);
             setUpdateItem([]);
             setUpdateFileLevel(new Set());
             setDeleteFileLevel(new Set());
            }
            alert(responseData);
            setItemCount(itemCount);
            setupdateImgs([]);
            setUpdateItem([]);
            getUserIdList();
            getUserProfileImgList();
            getAllMusicList();
            navigate("/feed");
    }
   

    const updateFeedInputChange = (e) => {
        const {name,value} = e.target;
        setUpdateFeedItem({...updateFeedItem,[name] : value});
   }
   
    
    const newFeedInputChange = (e) => {
         const {name,value} = e.target;
         setNewFeedItem({...newFeedItem,[name] : value});
    }
    

    const insertFeedItem = async (e) => {
        const boardMusicNo = e.target.boardMusicNo.value;
        e.preventDefault();
        let lockItem = 'N';
        if(e.target.itemLock.value == "true" || e.target.itemLock.value == true){
            lockItem = 'Y';
        }
        
        const formData = new FormData();
        
        if(selectedFiles != []){
            selectedFiles.forEach((file) => {
                formData.append(`files`, file);
            });
        }
        formData.append("boardContent", newFeedItem.feedTextContent);
        formData.append("userNo", user.userNo);
        formData.append("secret", lockItem);
        formData.append("musicNo", boardMusicNo);

        const response = await fetch("http://localhost:3000/Muzip/insertBoard",
        {
            method : 'POST',
            body : formData 
        });

        const responseData = await response.text();
        if(responseData == "게시물 등록 성공하였습니다."){
            setSelectedFiles([]);
            setImgs([imageUrl+"img-upload.png"]);
            setNewFeedItem({feedTextContent:""});
            setFilesAttached(false);
            setCloneItems([]);
            setItems([]);
            setIsShowMoreClone([]);
            setLoadingState(false);
        }
        alert(responseData);
        setItemCount(itemCount);
        getUserIdList();
        getUserProfileImgList();
        getAllMusicList();
        setBtnFocus({"id" : "/feed" })
        navigate("/feed");
    }
    const [filesAttached, setFilesAttached] = useState(false);
    // 새 게시물 추가
    
    // 게시물 수정
    const [updateFileLevelSet, setUpdateFileLevel] = useState(new Set());
    const [deleteFileLevelSet, setDeleteFileLevel] = useState(new Set());
    
    const refreshItem = async (e) => {
        const boardMusicNo = e.target.boardMusicNo.value;
        const deleteFileLevel = Array.from(deleteFileLevelSet);
        const updateFileLevel = Array.from(updateFileLevelSet);
        
        e.preventDefault();
        let lockItem = 'N';
        if(e.target.itemLock.value == "true" || e.target.itemLock.value == true){
            lockItem = 'Y';
        }
        
        const formData = new FormData();
        
        if(updateSelectedFiles != []){
            updateSelectedFiles.forEach((file) => {
                formData.append(`files`, file);
            });
        }
        formData.append("boardContent", updateFeedItem.updateTextContent);
        formData.append("userNo", user.userNo);
        formData.append("secret", lockItem);
        formData.append("musicNo", boardMusicNo);
        formData.append("deleteFileLevel", deleteFileLevel);
        formData.append("updateFileLevel", updateFileLevel);
        formData.append("boardNo", updateItem[0].boardNo);

        const response = await fetch("http://localhost:3000/Muzip/updateBoard",
        {
            method : 'POST',
            body : formData 
        });

        const responseData = await response.text();
        if(responseData == "게시물 수정 성공하였습니다."){
             setUpdateSelectedFiles([]);
             setNewFeedItem({updateTextContent:""});
             setFilesAttached(false);
             setCloneItems([]);
             setItems([]);
             setIsShowMoreClone([]);
             setLoadingState(false);
             setupdateImgs([]);
             setUpdateItem([]);
             setUpdateFileLevel(new Set());
             setDeleteFileLevel(new Set());
            }
            alert(responseData);
            setItemCount(itemCount);
            setupdateImgs([]);
            setUpdateItem([]);
            getUserIdList();
            getUserProfileImgList();
            getAllMusicList();
            setBtnFocus({"id" : "/feed" })
            navigate("/feed");
    }
    // 게시물 수정
    
    // 댓글 추가
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
         const updatedClone = [...feedContentItemsClone];
         updatedClone[index].replyList.unshift(response.data);
         setCloneItems(updatedClone);
         const replyAlarm = sessionStorage.getItem("replayAlarm");
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
            };
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
                const updatedClone = [...feedContentItemsClone];
                updatedClone.forEach((item) =>{
                    if(item.boardNo == boardNo){
                        item.replyList.splice(index,1);
                    }
                })
                setCloneItems(updatedClone);
                alert(response.data);
            }
        })
        .catch((error) => {
          console.error("에러 발생:", error);
        });
    }

    
    const writeProps = {
        newFeedItem:newFeedItem,
        setNewFeedItem:setNewFeedItem,
        newFeedInputChange:newFeedInputChange,
        insertFeedItem:insertFeedItem,
        filesAttached:filesAttached,
        setFilesAttached:setFilesAttached,
        imageUrl:imageUrl,
        selectedFiles:selectedFiles,
        setSelectedFiles:setSelectedFiles,
        imgs:imgs,
        setImgs:setImgs
    };
   
    const updateProps = {
        setFilesAttached:setFilesAttached,
        imageUrl:imageUrl,
        updateSelectedFiles:updateSelectedFiles,
        setUpdateSelectedFiles:setUpdateSelectedFiles,
        updateItem :updateItem,
        updateImgs:updateImgs,
        setupdateImgs:setupdateImgs,
        updateFeedItem:updateFeedItem,
        updateFeedInputChange:updateFeedInputChange,
        refreshItem:refreshItem,
        updateFileLevelSet:updateFileLevelSet,
        setUpdateFileLevel:setUpdateFileLevel,
        deleteFileLevelSet:deleteFileLevelSet,
        setDeleteFileLevel:setDeleteFileLevel,
        deleteItems:deleteItems,
        allMusicList:allMusicList
    }
    
    // 피드에 내려줄 스테이트
    const propsItems = {
        feedContentItems:feedContentItems,
        feedContentItemsClone : feedContentItemsClone,
        moreContentTarget:moreContentTarget,
        isShowMoreClone:isShowMoreClone,
        textLimit:textLimit,
        search:search,
        searchF:searchF,
        setIsShowMoreF:setIsShowMoreF,
        updateFeed:updateFeed,
        imageUrl:imageUrl,
        user:user,
        itemCount:itemCount,
        getBoardList:getBoardList,
        moreFeed:moreFeed,
        boomUp:boomUp,
        newReplyInputChange:newReplyInputChange,
        newReply:newReply,
        replyInsert:replyInsert,
        userIdList:userIdList,
        profileImgList:profileImgList,
        allMusicList:allMusicList,
        deleteReply:deleteReply
    };
    // 피드에 내려줄 스테이트

    // 마이페이지에 내려줄 스테이트
    const propsMyItems = {
        feedContentItems:feedContentItems,
        textLimit:textLimit,
        updateFeed:updateFeed,
        imageUrl:imageUrl,
        user:user,
        itemCount:itemCount,
        getBoardList:getBoardList,
        moreFeed:moreFeed,
        boomUp:boomUp,
        newReplyInputChange:newReplyInputChange,
        newReply:newReply,
        replyInsert:replyInsert,
        userIdList:userIdList,
        profileImgList:profileImgList,
        allMusicList:allMusicList,
        getUserIdList:getUserIdList,
        getUserProfileImgList:getUserProfileImgList,
        getAllMusicList:getAllMusicList,
        setBtnFocus:setBtnFocus
    };
    // 마이페이지에 내려줄 스테이트
   
  const handlePageChange = (e) => {
    if (filesAttached) {
      const shouldMove = window.confirm('내용이 저장되지 않습니다. 이동하시겠습니까?');
      if (shouldMove) {
        setFilesAttached(false);
        setSelectedFiles([]);
        setImgs([imageUrl+"img-upload.png"]);
        setupdateImgs([]);
        setUpdateItem([]);
        setUpdateFileLevel(new Set());
        setDeleteFileLevel(new Set());
    } else {
          e.preventDefault();
        return;
      }
    } else {
        // return;
    }
  };
  
  
 // ========================= 검색어 ======================================
 const [searchword, setSearchword] =  useState([]);

 const selectRanking = () => {
     axios
         .get("http://localhost:3000/Muzip/selectRanking")
         .then((response) => {
             const rankingArr = [];
             for(let i = 0; i < 10; i++){
                 rankingArr[i] = response.data[i];
             }
             setSearchword([...rankingArr]);
             $("#ranking").fadeOut(300);
             $("#ranking").fadeIn(800);
         })
         .catch((error) => {
             console.log("캐치")
         });
 }
 
 useEffect(() => {
     selectRanking();
     const intervalId = setInterval(selectRanking, 60000); // 1분마다
     
     return () => {
         clearInterval(intervalId);
 };
 }, []);

 /////////////// 알람 /////////////////////////////
 const dispatch = useDispatch();
 const alarmStompClient = useSelector((state)=>state.alarmState.alarmStompClient);

 let userInfo = JSON.parse(sessionStorage.getItem("user"));
 function settingAlarm(){
     userInfo = JSON.parse(sessionStorage.getItem("user"));
     if(userInfo != null && userInfo!= undefined && userInfo.userNo != "" && userInfo.userNo != undefined){
         axios.get('http://localhost:3000/Muzip/getAlarms',{
             params:{
                 userNo : userInfo.userNo
             }
         }).then((response) => {
            const cloneAlarm = [...response.data].filter(item => {
                if(item.senderNo != userInfo.userNo){
                    return true;
                }else{
                    return false;
                }
            })
            dispatch(changeAlarm({
                alarm : [...cloneAlarm]
            }));
         });
     }
 }

 const serverConnect = async () => {
    // 웹소켓 연결 설정
    if(alarmStompClient) return;
    dispatch(alarmLoadingTrue());
    console.log("1. 소켓 연결요청");
    const socket = new SockJS('http://localhost:8082/Muzip/ws-alarm');
    console.log("1_1. 소켓 링크 : ",socket);
    const stomp = Stomp.over(socket);
    console.log("2. 스톰프정보 : ",stomp);
    
   await stomp.connect({}, () => {
        console.log("알람서버 연결성공");
        dispatch(alarmLoadingFalse());
        settingAlarm();

        dispatch(changeStompClient({
            alarmStompClient : stomp
        }));

        stomp.subscribe('/alarm/alarmget', (alarm) => {
           userInfo = JSON.parse(sessionStorage.getItem("user"));
           const newAlarm = JSON.parse(alarm.body);
           if(userInfo.userNo == newAlarm.receiverNo && userInfo.userNo != newAlarm.senderNo){
               dispatch(addNewAlarm({
                   newAlarm : newAlarm
               }));
           }
        });
    });
    socket.onclose =  function(){
       setTimeout(function(){serverConnect();},1000);
    }
}

 useEffect(() => {
     settingAlarm();
     serverConnect();
 }, [alarmStompClient]);

 const [friendsh,setFriend] = useState('');
// ========================= 검색어끝 ======================================
const [forceClick,setForceClick] = useState(false);
//사이드 페이지에 내려줄 스테이트

//설정 내정보에 보내줄 개인정보
const [myinfo , setmyinfo] =  useState(
    {username : "아이유", email : "iu11@naver.com", phone : "01011112222", interest : "trot,hiphop,edm", pwd : "1234"}
)

//설정 개인설정 내용
const [setting, setsetting] =  useState(
    {autoplay: true, themecolor : "light", comentalarm : true, chatalarm : true}
)
const [changecolor, setchangecolor] = useState('settingClick')

const settingprops = {
    myinfo : myinfo,
    setting : setting,
    changecolor:changecolor,
    setchangecolor:setchangecolor
}
isDark();

    return(
        <div id="MuzipBodyWrap">
           
                <Menubar handlePageChange={handlePageChange} setchangecolor={setchangecolor} btnFocus={btnFocus} setBtnFocus={setBtnFocus} forceClick={forceClick} setForceClick={setForceClick} />
                <div className="최외곽">
                <MuzipWrap/>
                </div>
                    
                    <Routes>
                    <Route path="/" element={<Ltest propsMyItems={propsMyItems} />} />
                        <Route
                        path="/user/:pageUserNo"
                        element={<Ltest propsMyItems={propsMyItems} />}
                        />
                    <Route path='/feed'  element={<HomeFeed propsItems={propsItems}/>}/>
                    <Route path='/write' element={<WriteComponent writeProps={writeProps}/>}/>
                    <Route path='/cloud' element={<Cloud/>}/>
                    <Route path="/friend" element={<FriendSearch setFriend={setFriend} setBtnFocus={setBtnFocus}/>}/>
                    <Route path="/chat" element={<ChatRoom friendsh={friendsh} setFriend={setFriend}/>}/>
                    <Route path='/updateFeed' element={<UpdateFeed updateProps={updateProps}/>} />
                    <Route path='/settings' element={<Settings propsMyItems={propsMyItems} settingprops={settingprops} forceClick={forceClick} myinfo={myinfo} setting={setting} setBtnFocus={setBtnFocus}darkmodeSet={darkmodeSet} setDarkmode={setDarkmode}/>} >
                            <Route path='myinfo' element={<MyInfo myinfo={myinfo} settingprops={settingprops} getUserIdList={getUserIdList}/>}/>
                            <Route path='set' element={<MySet setting={setting} darkmodeSet={darkmodeSet}setDarkmode={setDarkmode} />}/>
                            <Route path='membership' element={<MemberShip forceClick={forceClick} setchangecolor={setchangecolor} setForceClick={setForceClick}/>}/>
                            <Route path='coinfo' element={<CoInfo/>}/>
                            <Route path='withdrawal' element={<Withdrawal setBtnFocus={setBtnFocus} setLoadingState={setLoadingState}/>}/>
                        </Route>
                    <Route path='/adminpage' element={<Adminpage setBtnFocus={setBtnFocus}/>} >
                        <Route path='managemember' element={<ManageMember/>}/>
                        <Route path='managecontent' element={<ManageContent/>}/>
                        <Route path='managemusic' element={<ManageMusic/>}/>
                        <Route path='managecomplain' element={<ManageComplain/>}/>
                        <Route path='managepayment' element={<ManagePayment/>}/>
                    </Route>    
                </Routes>
                <Side searchword={searchword}/>
            
        </div>
         
    )
}

export default App;