import "./App.css";
import Hd from "./hd";
import Menubar from "./menubar";
import { HomeFeed } from "./HomeFeed";
import { BrowserRouter , Link , Route , Routes,useLocation } from "react-router-dom";
import { Ltest } from "./Ltest";
import { useEffect ,useState , useRef } from "react";
import {MoveToTop} from './MoveToTop';
import { WriteComponent } from "./WriteComponent";
import { Cloud } from "./Cloud";
import { UpdateFeed } from "./UpdateFeed";
import {FriendSearch} from "./FriendsList";
import ChatRoom from "./ChatRoom";

function Body(){
    // 피드컨텐츠 (일단 하드코딩)
    const [feedContentItems,setItems] = useState([
        {userId : "dlwlrmazzz" , music : "너의 의미" , artist:"IU" ,hits:"123" , reply:"222" ,heart:"14",itemImg:"https://1.bp.blogspot.com/-83ssx_r6WgI/YTV8DsFLTGI/AAAAAAABUkY/JIbDJwcLWrQr6V3mtd4W01yCl9w2gk-zQCLcBGAsYHQ/s2560/the-valley-minimal-4k-9y-3840x2160.jpg",
        itemContent:"천지는 얼마나 기쁘며 얼마나 아름다우냐? 이것을 얼음 속에서불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을d서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러" },
        {userId : "dlwlrmag" , music : "너의 의미" , artist:"IU" ,hits:"123" , reply:"222" ,heart:"14",itemImg:"https://wallpapercave.com/wp/wp2118371.jpg",
        itemContent:"천지는 마나 아름다우냐? 이것을 얼음 속에서불러 내는 것이천지는 얼마나 기쁘며 얼마나 자바 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐? 이것을 얼음 속에서불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을d서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을" },
        {userId : "dlwlrmab" , music : "너의 의미" , artist:"IU" ,hits:"123" , reply:"222" ,heart:"14",itemImg:"https://cdnimg.melon.co.kr/cm2/artistcrop/images/002/61/143/261143_20210325180240_org.jpg?61e575e8653e5920470a38d1482d7312/melon/optimize/90",
        itemContent:"천지는 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐? 이것을 얼음 속에서불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을d서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을" }
    ])

    const [feedContentItemsClone,setCloneItems] = useState(feedContentItems);
    
    // 하단에 새롭게 랜더링될 피드컨텐츠 (일단 하드코딩)
    const newItem = {userId : "dlwlrma" , music : "너의 의미" , artist:"IU" ,hits:"123" , reply:"222" ,heart:"14",itemImg:"https://windowsforum.kr/files/attach/images/2966154/878/023/012/5c821282d9f78cc659bd2bb9c4f9ceb6.jpg",
             itemContent:"천지는 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 스프링 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐 얼마나 기쁘며 얼마나 아름다우냐? 이것을 얼음 속에서불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을d서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을서 불러 내는 것이 따뜻한 봄바람이다 인생에 따뜻한 봄바람을" }
    
    const [feedReply,setFeedReply] = useState([
        {replyImg:"./icons/FB_IMG_1516870992875.jpg", replyUserId :"dlwlrma1" , replyContent:"이미지가 이뻐여"},
        {replyImg:"./icons/FB_IMG_1516870992875.jpg", replyUserId :"dlwlrma1" , replyContent:"이미지가 이뻐여이미지가 이뻐여이미지가 이뻐여이미지가 이뻐여이미지가 이뻐여이미지가 이뻐여이미지가 이뻐여이미지가 이뻐여이미지가 이뻐여"},
        {replyImg:"./icons/FB_IMG_1516870992875.jpg", replyUserId :"dlwlrma1" , replyContent:"이미지가 이뻐여"},
        {replyImg:"./icons/FB_IMG_1516870992875.jpg", replyUserId :"dlwlrma1" , replyContent:"이미지가 이뻐여"},
        {replyImg:"./icons/FB_IMG_1516870992875.jpg", replyUserId :"dlwlrma1" , replyContent:"이미지가 이뻐여"},
        {replyImg:"./icons/FB_IMG_1516870992875.jpg", replyUserId :"dlwlrma1" , replyContent:"이미지가 이뻐여"},
        {replyImg:"./icons/FB_IMG_1516870992875.jpg", replyUserId :"dlwlrma1" , replyContent:"이미지가 이뻐여"}
    ])
    // 옵저버로 감시중인 요소
    const moreContentTarget = useRef(null);
    
    // 컨텐츠 글에 상태가 더보기 상태인지 닫기 상태인지
    const [isShowMore,setIsShowMore] = useState([false,false,false]);

    const [isShowMoreClone,setIsShowMoreClone] = useState([...isShowMore]);

    const search = useRef(null);
    
    // 최초로 랜더링될 글자수 제한
    const textLimit = useRef(110); 

    const boomUp = (e,index)=> {
        if(e.target.src == "http://localhost:3000/icons/%EC%A2%8B%EC%95%84%EC%9A%94.png"){
            e.target.src ="./icons/좋아요누른거.png";
        }else{
            e.target.src = "./icons/좋아요.png";
        }
    }
    
    // 검색 함수
   const searchF = () => {
   let searchItems = feedContentItems.filter((item) => {
        if(item.userId.includes(search.current.value) ||
            item.artist.includes(search.current.value)||
            item.music.includes(search.current.value) ||
            item.itemContent.includes(search.current.value)){
            return true;
        }else{
            return false;
        }
    });
        setCloneItems(searchItems);
    }
    // 검색 함수

    const setIsShowMoreF = (index) => {
        for(let i = 0; i < isShowMoreClone.length; i++){
            if(i == index){
                isShowMoreClone[i] = !isShowMoreClone[i];
            }
            setIsShowMoreClone([...isShowMoreClone]);
       }
    }

    let [updateItem,setUpdateItem] = useState();
    const updateFeed = (userId) => {
        updateItem = feedContentItems.filter((item) => {
            if(item.userId === userId){
                return true;
            }else{
                return false;
            }
        });
        setUpdateItem(updateItem);
    }

    const propsItems = {
        feedContentItems:feedContentItems,
        setItems : setItems,
        feedContentItemsClone : feedContentItemsClone,
        setCloneItems : setCloneItems,
        newItem : newItem,
        feedReply : feedReply,
        setFeedReply: setFeedReply,
        moreContentTarget:moreContentTarget,
        isShowMore : isShowMore,
        setIsShowMore:setIsShowMore,
        isShowMoreClone:isShowMoreClone,
        setIsShowMoreClone:setIsShowMoreClone,
        textLimit:textLimit,
        boomUp:boomUp,
        search:search,
        searchF:searchF,
        setIsShowMoreF:setIsShowMoreF,
        updateFeed:updateFeed
    };

    return(
        <div id="MuzipBodyWrap">
            <BrowserRouter>
                <Menubar/>
                <Hd/>
                <Routes>
                    <Route path='/' element={<Ltest/>}/>
                    <Route path='/feed' element={<HomeFeed propsItems={propsItems}/>}/>
                    <Route path='/write' element={<WriteComponent/>}/>
                    <Route path='/cloud' element={<Cloud/>}/>
                    <Route path='/updateFeed' element={<UpdateFeed updateItem={updateItem}/>} />
                    <Route path='/chat' element={<ChatRoom/>}/>
                    <Route path='/friend' element={<FriendSearch/>}/>
                </Routes>
            </BrowserRouter>
            
        </div>
    )
}

export default Body;