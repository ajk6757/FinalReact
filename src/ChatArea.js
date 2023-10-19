import React, { useState, useEffect, useRef } from 'react';
import './ChatRoom.css'; // ChatRoom.css 파일을 import
import { useAuth } from './LoginContext';
import axios from 'axios';
import ChatController from './ChatController';
import InviteChatModal from './InviteChatModal';
import ChatRoom from './ChatRoom';
import { useSelector } from 'react-redux';
import { BiSolidUserPlus } from "react-icons/bi";
import { FaList } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { isVisible } from '@testing-library/user-event/dist/utils';


function ChatMessage({ isMyChat, chatDate, content, senderName }) {
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  const messageParts = content.split(linkRegex);
  const formattedChatDate = new Date(chatDate).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // 오전/오후 표시
  });

  return (
    <li className={isMyChat ? "myChat" : ""}>
    {!isMyChat && <b>{senderName}</b>}
    <br />
    <p className="chat">
      {messageParts.map((part, index) => {
        if (linkRegex.test(part)) {
          return (
              <a key={index} className="a-link" href={part} target="_blank" rel="noopener noreferrer">
                {part}
              </a>
          );
        } else {
          // 링크가 아닌 경우 그대로 텍스트로 표시합니다.
          return part;
        }
      })}
    </p>
    <span className="chatDate">{formattedChatDate}</span>
  </li>
  );
}

function ChatArea({ chatroomNo, updateChatRooms, chatroomName, memberName,stomp,messages, setMessages, isVisible,setIsVisible}) {
  // const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isControllerOpen, setIsControllerOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const { user } = useAuth(); // 사용자 정보를 가져오는 함수 사용
  const chatContainerRef = useRef(null);
  const [OpenW,setOpenW] = useState(true);
  

  if(OpenW){
    axios
      .get('/Muzip/messages', {
        params: {
          chatroomNo: chatroomNo,
        },
      })
      .then((response) => {
        setMessages(response.data);
        setOpenW(!OpenW);
      });
    }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }else{
      return;
    }
  });

  const alarmStompClient = useSelector((state)=>state.alarmState.alarmStompClient);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    const newMessage = {
      chatroomNo,
      senderName: user.userName,
      message: inputMessage,
      chatDate: new Date().toISOString(),
    };
    // 웹소켓을 통해 메시지를 서버로 보냅니다.
    
    stomp.send('/chat/chat', {}, JSON.stringify(newMessage));
    setInputMessage('');

    axios
      .get('/Muzip/messages', {
        params: {
          chatroomNo: chatroomNo,
        },
      })
      .then((response) => {
        setMessages(response.data);
      });
    
    const chatAlarm = sessionStorage.getItem("chatAlarm")
    for(let i = 0; i < members.length; i++){
      if(chatAlarm == 'Y' && members[i].userNo != user.userNo){
        const newAlarm = {
          alarmNo : "",
          alarmMessage : "",
          receiverNo : members[i].userNo,
          senderNo : user.userNo,
          alarmKind : "chat",
          alarmPath : chatroomNo,
          createDate : new Date().toISOString(),
          checkStatus : 'N',
          status : 'Y'
        };
        alarmStompClient.send('/alarm/alarm', {}, JSON.stringify(newAlarm));
      }
    }
  };

  useEffect(() => {
    axios.get(`/Muzip/chatRoomMember?chatroomNo=${chatroomNo}`)
      .then(response => {
        setMembers(response.data);
      })
      .catch(console.error);
  }, []);

  const handleKeyDown = (event) => {
    // 엔터 키를 누를 때 메시지 전송
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const openController = () => {
    setIsControllerOpen(true);
  };

  const closeController = () => {
    setIsControllerOpen(false);
  };

  const inviteController = () => {
    setIsInviteOpen(true);
  };

  const closeInvite = () => {
    setIsInviteOpen(false);
  };


  return (
    <>
      {stomp === null ? (
        <img src="http://localhost:8082/Muzip/resources/image/loading.gif" className="loadingIcon" />
      ) : (
        <div className="chat_room" style={{display: isVisible ? 'block' : 'none'}}>
          {members.length !== 2 && <BiSolidUserPlus size={45} className="chat_mk" onClick={inviteController} />}
          <div className='h3_box'><h3 className='chat_room_name'>{chatroomName === user.userId ? (
            memberName
          ) : (
            chatroomName
          )}
          <FaList size={35} className='cht_setting' onClick={openController} />
          <span style={{ fontSize: '0.8vw' }}>({members.length})</span></h3></div>
          {isControllerOpen && (
            <ChatController closeController={closeController} chatroomNo={chatroomNo} updateChatRooms={updateChatRooms} isChatOpen={isVisible} setIsVisible ={setIsVisible}/>
          )}
          <div className="chatting_area">
            <ul ref={chatContainerRef} className="display_chatting">
              {
                messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    isMyChat={message.senderName === user.userName}
                    chatDate={message.createDate}
                    content={message.message}
                    senderName={message.senderName}
                  />
                ))}
            </ul>
            <div className="input_area_ch">
              <FiSend size={42} className='Fisend' color='black'
                onClick={handleSendMessage}
              />
              <textarea
                id="inputChatting"
                rows="3"
                placeholder="내용을 입력해주세요"
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={handleKeyDown}
              ></textarea>
            </div>
          </div>
          {isInviteOpen && (
            <InviteChatModal closeModal={closeInvite} chatroomNo={chatroomNo} updateChatRooms={updateChatRooms} />
          )}
        </div>
      )}
    </>
  )
  
}
export default ChatArea;