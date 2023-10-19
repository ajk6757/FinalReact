import "./App.css";
import $ from "jquery";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from "react";
import bootstrap from 'bootstrap';
import { Button } from 'react-bootstrap';
import Modal from "bootstrap";
import { useAuth } from "./LoginContext";
import { changeSearchMusicList } from "./redux/musicListSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {AiOutlinePlus} from 'react-icons/ai';
export const UpdateFeed = (props) => {
    const {updateProps} = props;
    const {user} = useAuth();
    const dispatch = useDispatch();
    const searchMusicList = useSelector((state)=>state.musicList.searchMusicList);
    const [originFileLevelSet, setOrigintFileLevel] = useState(new Set());
    const {
        setFilesAttached,
        imageUrl,
        updateSelectedFiles,
        setUpdateSelectedFiles,
        updateItem,
        updateImgs,
        setupdateImgs,
        updateFeedItem,
        updateFeedInputChange,
        refreshItem,
        updateFileLevelSet,
        setUpdateFileLevel,
        deleteFileLevelSet,
        setDeleteFileLevel,
        deleteItems,
        allMusicList
    } = updateProps;

    let lockProperty = updateItem[0].secret == "Y" ? true : false;

    if(originFileLevelSet.size == 0 && updateItem[0].attachList.length != 1){
        updateItem[0].attachList.forEach((item) => {
            if(item.changeName != "img-upload.png"){
                originFileLevelSet.add(item.fileLevel);
            }
        })
        setOrigintFileLevel(originFileLevelSet)
    }

    const [itemLock,setLock] = useState(lockProperty);
    const [mNo,setmNo] = useState(updateItem[0].musicNo);

    function validateImageFile(file) {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif','image/jpg'];
    
    if (acceptedImageTypes.includes(file.type)) {
        return true; // 이미지 파일인 경우
    } else {
        throw new Error('이미지 파일만 첨부 할 수 있습니다.'); // 이미지 파일이 아닌 경우 오류 발생
    }
    }

    const loadImg = (e) => {
        const index = e.target.className;
        const upFileLevel = index == 0 ? 6 :Number(e.target.name);
        if(e.target.files.length == 1){
            const files = e.target.files[0];
            try {
            validateImageFile(e.target.files[0]);
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]); 
            reader.onload = function(ev){
                
               if((updateImgs[index].url && updateImgs[index].url != imageUrl+"img-upload.png")){
                updateImgs[index].url  = ev.target.result;
                updateSelectedFiles[index] = files;
                setupdateImgs([...updateImgs]);
                setUpdateSelectedFiles([...updateSelectedFiles])
                   return;
               }   
               updateImgs[index].url  = ev.target.result;
                    if(e.target.value != "" && (updateImgs.length < 5)  ){
                        setupdateImgs([...updateImgs,{url:imageUrl+"img-upload.png",fileLevel:Number(upFileLevel+1)}]);
                        setUpdateSelectedFiles([...updateSelectedFiles,files])
                    }

                    if(updateImgs[index].url != imageUrl+"img-upload.png" && (updateImgs.length == 5)){
                        setupdateImgs([...updateImgs]);
                        setUpdateSelectedFiles([...updateSelectedFiles,files]);
                    }
                }
            }catch (error) {
           /// alert(error.message); // 오류 메시지 출력
           $("#errorMsg").click();
        }
    }setFilesAttached(true);
    originFileLevelSet.forEach((item) =>{
        if(item == upFileLevel){
            deleteFileLevelSet.add(Number(upFileLevel));
        }
    })
    updateFileLevelSet.add(Number(upFileLevel));
    setUpdateFileLevel(updateFileLevelSet);
    setDeleteFileLevel(deleteFileLevelSet);
}

// ===================================== 이미지 슬릭 ===========================================
const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{position:"absolute" ,right:"-3vw",zIndex:"99" , opacity:"0.8"  }}
        onClick={onClick}
      />
    );
  };
  
  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ position:"absolute" ,left:"-3vw" ,zIndex:"99" , opacity:"0.8"}}
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
            bottom: '10px',
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

const deleteImg = (delFileLevel,index) => {
    delFileLevel = (delFileLevel == undefined) ? index+6 : delFileLevel;
    let newUpdateSelectedFiles = [...updateSelectedFiles];
    newUpdateSelectedFiles.splice(index,1);
    let updatedMoreImg = [...updateImgs];
    updatedMoreImg.splice(index,1); 
    
    let num = 0;
    for(let i = 0 ; i < updatedMoreImg.length; i++){
        if(updatedMoreImg[i].url == imageUrl+"img-upload.png"){
            num++;
        }
    }

    if(updatedMoreImg.length == 4 && num == 0){
        updatedMoreImg = [...updatedMoreImg,{url:imageUrl+"img-upload.png",fileLevel:Number(delFileLevel+1)}];
    }
    
    setupdateImgs(updatedMoreImg);
    setUpdateSelectedFiles(newUpdateSelectedFiles);
    const inputElement = document.getElementById('writeImgSource' + index);
    inputElement.value = '';

    updateFileLevelSet.forEach((item) =>{
        if(item == delFileLevel){
            updateFileLevelSet.delete(Number(item));
        }
    })
    deleteFileLevelSet.add(Number(delFileLevel));
    setDeleteFileLevel(deleteFileLevelSet);
    setUpdateFileLevel(updateFileLevelSet);
}

function searchMusic(){
    const keyword = $('#searchKeyword');
    if(keyword.val() !== null && keyword.val() !== "" && keyword.val() !== undefined){
        axios.get("http://localhost:3000/Muzip/searchMusic", {
            params : {
                keyword : keyword.val()
            },
            headers: {
                'Content-Type': 'application/json',
            }
        }) // 주소 얻고
        .then(response => {    // 응답성공하면 데이터 세팅
            let tempArr = [];
            tempArr[0] = {
                listName : "검색",
                songList : response.data
            };
            dispatch(changeSearchMusicList({
                searchMusicList : [...tempArr]
            }));
        }).catch(console.log); // 아니면 오류 로그찍기
    }
    keyword.val("");
}
function pressEnter(e){
    if (e.key == "Enter" || e.keyCode == "13"){
        searchMusic();
    }
}
function namingRule(name){
    let character;
    let charBytes = 0;
    let tempName = "";
    if(name !== null && name !== "" && name !== undefined){
        for(let i = 0; i < name.length; i++){
            character = name.charAt(i);
            if(escape(character).length > 4) charBytes += 2;
            else charBytes += 1.4;
            if(charBytes >= 50) break;
            else tempName += character;
        }
        
        if(charBytes >= 50){
            return tempName + "...";
        }else{
            return tempName;
        }
    }else{
        return "";
    }
}

const [musicResource,setMusicResource] = useState(allMusicList[mNo]);

function setMusicNo(musicNo,musicTitle,musicArtist){
    setMusicResource(musicArtist+" - "+musicTitle);
    setmNo(musicNo);
    $("#write-music-close-btn").click();
}

    return(
        <div id="home-feed">
            <div id="writeBodyWrap">
                    <div id="writeHeader"><h4>게시물 수정</h4></div>

                    <div id="writeMusicSourceWrap">
                        <div id="WMBW">
                            <label  htmlFor="writeMusicSource" onClick={() => $(".modal-backdrop").remove()} data-bs-toggle="modal" data-bs-target="#exampleModal" >
                                <div id="writeMusicBtn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-file-earmark-music-fill" viewBox="0 0 16 16">
                                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM11 6.64v1.75l-2 .5v3.61c0 .495-.301.883-.662 1.123C7.974 13.866 7.499 14 7 14c-.5 0-.974-.134-1.338-.377-.36-.24-.662-.628-.662-1.123s.301-.883.662-1.123C6.026 11.134 6.501 11 7 11c.356 0 .7.068 1 .196V6.89a1 1 0 0 1 .757-.97l1-.25A1 1 0 0 1 11 6.64z"/>
                                    </svg>음원첨부
                                </div>
                            </label>
                        </div>

                        <div className="musicResource">
                            {musicResource != null ?<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-music-note-beamed" viewBox="0 0 16 16">
                            <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"/>
                            <path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"/>
                            <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"/>
                            </svg> : ""}
                            &nbsp; {musicResource}
                        </div>

                        <div onClick={() => setLock(!itemLock)} id="writeLockImg">
                            {itemLock ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                            </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="25" fill="currentColor" className="bi bi-unlock" viewBox="0 0 16 16">
                            <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z"/>
                            </svg>}
                        </div>
                        
                    </div>

                    <div id="writeImgSourceWrap">
                        <Slider  {...settings}>
                        {updateImgs.map((item,index) => {
                                return(
                                    <label htmlFor={"writeImgSource"+index} className={"imgLabel"+index}   key={"img"+index} onMouseEnter={()=> $(".imgLabel"+index).attr("for","writeImgSource"+index)}>
                                   <div id="writeFileImgWrap">
                                   {item.url != imageUrl+"img-upload.png"? 
                                   <div id="writeImgDelete" className={index} onMouseLeave={()=> $(".imgLabel"+index).attr("for","writeImgSource"+index)}  onMouseEnter={() => $(".imgLabel"+index).attr("for","")} >
                                   <svg xmlns="http://www.w3.org/2000/svg" onClick={() => deleteImg(item.fileLevel,index)}  width="30" height="30" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                   <path  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                   <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                                   </svg>
                                   </div> 
                                   : ""}
                                       <img id={"writeFileImg"+index}  src={item.url}/>
                                   </div>
                                       </label> 
                                )
                            })}
                            </Slider>
                    </div>
                            <form encType="multipart/form-data" onSubmit={(e) => refreshItem(e)}>
                                <input type="file" onChange={loadImg} accept="images/*" className="0" name="6" id="writeImgSource0"/>
                                <input type="file" onChange={loadImg} accept="images/*" className="1" name="7" id="writeImgSource1"/>
                                <input type="file" onChange={loadImg} accept="images/*" className="2" name="8" id="writeImgSource2"/>
                                <input type="file" onChange={loadImg} accept="images/*" className="3" name="9" id="writeImgSource3"/>
                                <input type="file" onChange={loadImg} accept="images/*" className="4" name="10" id="writeImgSource4"/>
                                
                                <input type="hidden" name="itemLock" value={itemLock}/>
                                <input type="hidden" name="boardMusicNo" value={mNo}/>
                                

                                <div id="writeTextWrap">
                                    <textarea id="writeTextarea" name="updateTextContent" value={updateFeedItem.updateTextContent} onChange={updateFeedInputChange} style={sessionStorage.getItem("darkMode") == "Y" ? {color:"white"}:{}} required></textarea>
                                </div>

                                <div id="writeBtnWrap">
                                    <button  id="writeBtn">수정</button>
                                    <button type="button" className="deleteBtn" data-bs-toggle="modal" data-bs-target="#deleteModal">삭제</button>
                                </div>
                            </form>
            </div>

            <button id="errorMsg" data-bs-toggle="modal" data-bs-target="#exampleModal2" style={{display:"none"}}></button>

               {/*==================== 모달 ================ */}
               <div className="modal writeModalWrap" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog writeModalWrap2 modal-dialog-centered">
                                <div className="modal-content writeModal ">
                                    <div className="modal-body">

                                        <div id="write-music-search-header">
                                                <h4>음악 검색</h4>
                                        </div>

                                        <div id="write-music-searchbar">
                                            <input id="searchKeyword" type="search" onKeyUp={pressEnter}/>
                                            <span>
                                            <svg onClick={searchMusic} xmlns="http://www.w3.org/2000/svg" width="20" height="20"fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                            </svg>
                                            </span>
                                        </div>

                                        <div id="write-music-search-body">
                                           
                                            {/* =================== 검색결과 들어갈 영역 ===================== */
                                                searchMusicList.map((item, index) =>
                                                <div id={"searchBoardMusic"+index} key={"searchBoardMusic"+item.listName}>
                                                    {
                                                        item.songList.map((item2, index2)=>
                                                            
                                                            <div className="searchBoardMusicOne" key={"searchBoardMusic"+item.listName+"_"+index2}
                                                                onClick={() => setMusicNo(item2.musicNo,item2.musicTitle,item2.musicArtist)}>
                                                                <div className="searchBoardMusicInfo">
                                                                    <img src={"http://localhost:8082/Muzip" + item2.coverPath}/>
                                                                    <p>{namingRule(item2.musicTitle)}<br/>{namingRule(item2.musicArtist)}</p>
                                                                </div>
                                                                <AiOutlinePlus className="searchBoardMusicOneIcon" size="2vw"/>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                            }
                                      
                                        </div>

                                    </div>

                                    <div className="modal-footer write-Modal-footer">
                                    <button type="button" id="write-music-upload-btn">첨부</button>
                                    <button type="button" id="write-music-close-btn" data-bs-dismiss="modal">취소</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                {/*==================== 모달 ================ */}

                        {/* ====================== 에러 모달 ========================= */}
                        <div className="modal writeModalWrap" id="exampleModal2"  tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog writeModalWrap2 modal-dialog-centered">
                                <div className="modal-content writeModal ">
                                    <div className="modal-body">
                                        
                                        <div id="music-alert-msg">
                                        이미지 파일만 첨부 가능합니다.
                                        </div>

                                    </div>

                                    <div className="modal-footer write-Modal-footer">
                                    <button type="button" id="write-music-close-btn" data-bs-dismiss="modal">확인</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ====================== 에러 모달 ========================= */}

                        {/* 삭제 모달 */}
                        <div className="modal writeModalWrap" id="deleteModal"  tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog writeModalWrap2 modal-dialog-centered">
                                <div className="modal-content writeModal ">
                                    <div className="modal-body">
                                        
                                        <div id="music-alert-msg">
                                        정말 삭제 하시겠습니까?
                                        </div>

                                    </div>

                                    <div className="modal-footer write-Modal-footer">
                                    <button type="button" id="write-music-close-btn" onClick={() =>deleteItems(updateItem[0].boardNo)} data-bs-dismiss="modal">삭제</button>
                                    <button type="button" id="write-music-close-btn" data-bs-dismiss="modal">취소</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 삭제 모달 */}
        </div>
    )
}