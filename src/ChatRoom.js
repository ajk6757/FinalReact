import React, { useState, useEffect } from 'react';
import './ChatRoom.css'; // ChatRoom.css 파일을 import
import { useAuth } from './LoginContext';
import ChatArea from './ChatArea';
import ChatRoomModal from './ChatRoomModal';
import { BiPlusCircle } from "react-icons/bi";
import { FaSistrix } from "react-icons/fa";
// import { initializeSocket, getStompClient } from './ChatSocket';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { GoDotFill } from 'react-icons/go';
import { deleteRoomAlarm } from './redux/alarmSlice';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';


function ChatRoom({friendsh ,setFriend}) {
  const [stompClient,setStompClient] = useState();
  const initializeSocket = async () => {
    console.log("연결 시작");
    const socket = new SockJS('http://localhost:8082/Muzip/ws-chat');
    const stomp = Stomp.over(socket);
  
    await stomp.connect({}, () => {
      console.log("연결 성공");
      setStompClient(stomp);
  
      stomp.subscribe('/chat/chatget', (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
  
        axios.get('http://localhost:3000/Muzip/ChatList', {
          params: {
            userId: user.userId,
          },
        })
          .then((response) => {
            updateChatRooms(response.data);
          })
          .catch(console.error);
      });
    });
  };
  const { user } = useAuth();
  const [searchChat, setSearchChat] = useState('');
  const [chatrooms, setChatrooms] = useState([]);
  const [roommembers, setMembers] = useState([]);
  const [chatroomNo, setChatRoomNo] = useState();
  const [chatroomName, setChatRoomName] = useState();
  const [memberName, setMemberName] = useState();
  const [chatroomList, setChatRoomList] = useState([]);
  const [isChatRoomModalVisible, setIsChatRoomModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const imageUrl = 'http://localhost:3000/Muzip/resources/image/';
  const dispatch = useDispatch();
  // 채팅방 목록
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8082/Muzip/ChatList', {
          params: {
            userId: user.userId
          }
        });

        const promises = response.data.map(async (chatroom) => {
          const memberResponse = await axios.get(`http://localhost:3000/Muzip/chatRoomMember?chatroomNo=${chatroom.chatroomNo}`);
          return {
            chatroomNo: chatroom.chatroomNo,
            members: memberResponse.data
          };
        });

        const membersData = await Promise.all(promises);
        setMembers(membersData);
        setChatRoomList(response.data);
        console.log(membersData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if(!isLoaded){
      initializeSocket();
      setIsLoaded(true);
      setSearchChat(friendsh);
    }
  }, []);

  //채팅방 추가됐을때 다시 렌더링
  function updateChatRooms(newChatRooms) {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/Muzip/ChatList', {
          params: {
            userId: user.userId
          }
        });

        const promises = response.data.map(async (chatroom) => {
          const memberResponse = await axios.get(`http://localhost:3000/Muzip/chatRoomMember?chatroomNo=${chatroom.chatroomNo}`);
          return {
            chatroomNo: chatroom.chatroomNo,
            members: memberResponse.data
          };
        });

        const membersData = await Promise.all(promises);
        setMembers(membersData);
        setChatRoomList(newChatRooms);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }

  //채팅방 검색
  useEffect(() => {
    if (searchChat.trim() !== '') {
      axios.get(`http://localhost:3000/Muzip/ChatSearch?query=${searchChat}`, {
        params: {
          userId: user.userId
        }
      }).then(response => {
        console.log("챗?",response.data);
        setChatrooms(response.data);
      })
        .catch(console.error);
    }
  }, [searchChat]);

  //채팅방 검색 기능
  const handleSearchChange = event => {
    setSearchChat(event.target.value);
  };
  //해당 채팅방 선택시 저장
  const handleChatroomClick = (chatroom) => {
    setChatRoomNo(chatroom.chatroomNo);
    setChatRoomName(chatroom.chatroomName);
    setMemberName(chatroom.userId);
    setIsVisible(true);
    setFriend('');
  };
  //그룹방 만들기 오픈
  const openChatRoomModal = () => {
    setIsChatRoomModalVisible(true);
  };
  //닫기
  const closeChatRoomModal = () => {
    setIsChatRoomModalVisible(false);
  };
  //프로필 이미지 가져오기
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

  useEffect(() => {
    getUserProfileImgList();
  }, []);

  const alarm = useSelector((state) => state.alarmState.alarm);
  const isNewd = (chatroomNo) => {
    for (let i = 0; i < alarm.length; i++) {
      if (alarm[i].alarmKind == "chat" && alarm[i].alarmPath == chatroomNo) {
        return <GoDotFill className='chatAlarmIcon' fill="red" size="0.85vw" />;
      }
    }
    return <></>;
  }


  function removeChatRoomAlarm(chatroomNo){
    axios.get("http://localhost:3000/Muzip/removeChatRoomAlarm", {
      params : {
        chatroomNo : chatroomNo,
        userNo : user.userNo
      },
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      dispatch(deleteRoomAlarm(chatroomNo));
      // if(response.data === 0) {
      //   alert("오류가 발생하였습니다. 잠시 후 다시 시도해주세요.")
      // }else{
      //   
      // };
    }).catch(console.log);
  }



  return (
    <div id="home-feed">
      <div className="friend_box_main_ch">
        <div className="friend_box_search_list_ch">
          <BiPlusCircle className="chat_mk_img" size={40} onClick={openChatRoomModal} />
          <FaSistrix size={30} className="search_img" fill='black'/>
          <input
            type="search"
            placeholder="이름을 검색해주세요."
            value={searchChat}
            onChange={handleSearchChange}
          />
          {searchChat.length === 0 ? (
            chatroomList.map((chatroom) => {
              const chatroomMembers = roommembers.find((member) => member.chatroomNo === chatroom.chatroomNo);
              const userNos = chatroomMembers?.members.map(member => member.userNo);
              return (
                <div
                  className="search_list_member_ch"
                  onClick={() => handleChatroomClick(chatroom)}
                  key={chatroom.chatroomNo}
                >
                  <div className='ooot'  onClick={()=>removeChatRoomAlarm(chatroom.chatroomNo)}>
                    <div className='pf_ma_wrap'>
                      {userNos && userNos.length > 2 ? (
                        userNos.map(userNo => (
                          <img className="member_img" src={imageUrl + profileImgList[userNo]} key={userNo} />
                        ))
                      ) : (
                        userNos.map(userNo => {
                          if (userNo === user.userNo) {
                            return null;
                          }
                          return (
                            <img
                              className="member_img"
                              style={{ width: "4vw", height: "4vw" }}
                              src={imageUrl + profileImgList[userNo]}
                              key={userNo}
                            />
                          );
                        })
                      )}
                    </div>
                    <div className="gge">
                      <p className='gge_p'>{chatroom.chatroomName === user.userId ? (
                        chatroom.userId
                      ) : (
                        chatroom.chatroomName
                      )}
                      </p>
                      <p className="gge_ctc">{chatroom.viewMsg}</p>
                    </div>
                  </div>
                  {isNewd(chatroom.chatroomNo)}
                </div>
              );
            })
          ) : (
            chatrooms.length === 0 ? (
              <div className="no-results-message">검색 결과가 없습니다.</div>
            ) : (
              chatrooms.map((chatroom) => {
                const chatroomMembers = roommembers.find((member) => member.chatroomNo === chatroom.chatroomNo);
                const userNos = chatroomMembers?.members.map(member => member.userNo);
                return (
                  <div
                    className="search_list_member_ch"
                    onClick={() => handleChatroomClick(chatroom)}
                    key={chatroom.chatroomNo}
                  >
                    <div className='ooot'  onClick={()=>removeChatRoomAlarm(chatroom.chatroomNo)}>
                      <div className='pf_ma_wrap'>
                        {userNos && userNos.length > 2 ? (
                          userNos.map(userNo => (
                            <img className="member_img" src={imageUrl + profileImgList[userNo]} key={userNo} />
                          ))
                        ) : userNos && userNos.length === 0 ? (
                          <div>잠시만 기다려주세요...</div>
                        ) : (
                          userNos && (
                          <img
                            className="member_img"
                            style={{ width: "4vw", height: "4vw" }}
                            src={imageUrl + (userNos[0] === user.userNo ? profileImgList[user.userNo] : profileImgList[userNos[0]])}
                            key={userNos[0]}
                          />
                          )
                        )}
                      </div>
                      <div className="gge">
                        <p className='gge_p'>
                          {chatroom.chatroomName}
                        </p>
                        <p className="gge_ctc">{chatroom.viewMsg}</p>
                      </div>
                    </div>
                    {isNewd(chatroom.chatroomNo)}
                  </div>
                );
              })
            )
          )}

        </div>
        {isVisible && <ChatArea key={chatroomNo} chatroomNo={chatroomNo} updateChatRooms={updateChatRooms} chatroomName={chatroomName} memberName={memberName}
          stomp={stompClient} messages={messages} setMessages={setMessages} isVisible={isVisible} setIsVisible={setIsVisible} />}
        {isChatRoomModalVisible && (
          <ChatRoomModal closeModal={closeChatRoomModal} updateChatRooms={updateChatRooms} />
        )}
      </div>

    </div>

  );
}

export default ChatRoom;

