import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatController.css'; // enroll.css 파일을 import
import axios from 'axios';
import { useAuth } from './LoginContext';
import ChatArea from './ChatArea';




function ChatController({ closeController, chatroomNo, updateChatRooms,setIsVisible}) {
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();
    const imageUrl = 'http://localhost:3000/Muzip/resources/image/';

    const { user } = useAuth();

    useEffect(() => {
        axios.get(`http://localhost:3000/Muzip/chatRoomMember?chatroomNo=${chatroomNo}`)
            .then(response => {
                setMembers(response.data);
            })
            .catch(console.error);
    }, [updateChatRooms]);

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

        useEffect(() =>{
          getUserProfileImgList();
      },[]);


    const exitChatroom = () => {
        axios.delete(`http://localhost:3000/Muzip/exitChatroom?chatroomNo=${chatroomNo}&userId=${user.userId}`)
            .then(response => response.data)
            .then(data => {
                alert(data);
            }).then(() => {
                axios.get('http://localhost:3000/Muzip/ChatList', {
                    params: {
                        userId: user.userId
                    }
                })
                    .then(response => {
                        updateChatRooms(response.data);
                        setIsVisible(false);
                        navigate("/chat");
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    }


    return (
        <div className="chatController_main" onClick={closeController}>
            <p>현재 참여중인 멤버</p>
            <div className='groupmember_list'>
                {members.map(member => (
                    <div className='groupmember_selectM' key={member.id}>
                        <img src={imageUrl+profileImgList[member.userNo]} className='gmgImg' />
                        {member.userName}({member.userId})
                    </div>
                ))}
            </div>
            <div className={'only_two'}>
                {members.length !== 2 && <button onClick={exitChatroom}>채팅방 나가기</button>}
            </div>
        </div>
    );
}

export default ChatController;
