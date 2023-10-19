import React, { useState, useRef, useEffect } from 'react';
import './chatRoomModal.css'; // enroll.css 파일을 import
import axios from 'axios';
import { IoCloseCircleOutline } from "react-icons/io5";
import { useAuth } from './LoginContext';



function InviteChatModal({ closeModal, updateChatRooms, chatroomNo }) {
    const [isOpen, setIsOpen] = useState(true);
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchMembers, setSearchMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [joinMembers, setJoinMembers] = useState([]);
    const imageUrl = 'http://localhost:3000/Muzip/resources/image/';
    const { user } = useAuth();

    const formRef = useRef(null);

    // 멤버 선택/해제를 처리하는 함수
    function toggleMemberSelection(memberId) {
        setSelectedMembers((prevSelectedMembers) => {
            if (prevSelectedMembers.includes(memberId)) {
                // 이미 선택된 경우 선택 해제
                return prevSelectedMembers.filter((id) => id !== memberId);
            } else {
                // 선택되지 않은 경우 선택
                return [...prevSelectedMembers, memberId];
            }
        });
    }


    useEffect(() => {
        if (searchQuery.trim() !== '') {
            axios.get(`http://localhost:3000/Muzip/followSearch?query=${searchQuery}&userId=${user.userId}`)
                .then(response => {
                    setSearchMembers(response.data);
                })
                .catch(console.error);
        } else {
            setSearchMembers([]);
        }
    }, [searchQuery]);

    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    const [profileImgList, setProfileImgList] = useState({});
    useEffect(() => {
        const fetchUserProfileImgList = async () => {
            try {
                const response = await axios.get("http://localhost:3000/Muzip/getUserProfileImgList");
                const imgList = {};

                response.data.forEach((item) => {
                    imgList[item.KEY] = item.VALUE;
                });

                setProfileImgList((prevProfileImg) => ({
                    ...prevProfileImg,
                    ...imgList,
                }));
            } catch (error) {
                console.error("캐치", error);
            }
        }
        fetchUserProfileImgList();
    }, [setProfileImgList]);

    useEffect(() => {
        axios.get(`http://localhost:3000/Muzip/chatRoomFriend?userId=${user.userId}`)
            .then(response => {
                setMembers(response.data);
            })
            .catch(console.error);
    }, []);


    useEffect(() => {
        axios.get(`http://localhost:3000/Muzip/chatRoomMember?chatroomNo=${chatroomNo}`)
            .then(response => {
                setJoinMembers(response.data);
            })
            .catch(console.error);
    }, []);

    function groupMember() {
        axios.post('http://localhost:3000/Muzip/joinGroupChat', {
            chatroomNo: chatroomNo,
            memberId: selectedMembers
        }).then(() => {
            // 채팅방 생성 후 업데이트된 채팅방 리스트를 부모 컴포넌트로 전달
            axios.get('http://localhost:3000/Muzip/ChatList', {
                params: {
                    userId: user.userId
                }
            })
                .then(response => {
                    updateChatRooms(response.data); // 업데이트된 채팅방 리스트 전달
                    closeModal();
                })
                .catch(console.error);
        }).catch(console.error);
    }


    return (
        <form ref={formRef} onSubmit={groupMember}>
            {isOpen && (
                <div className="chatRoom_modal">
                    <div className="chatRoom_content">
                        <IoCloseCircleOutline
                            id="chatRoom_exit"
                            style={{ width: '1.5vw', height: '1.5vw', color:"black"}}
                            onClick={closeModal}
                        />
                        <input
                            type="search"
                            placeholder="아이디를 검색해주세요."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <div className="chatRoom_friendList">
                            {searchQuery ? (
                                // searchQuery가 비어 있지 않을 때
                                searchMembers.map(member => (
                                    !joinMembers.some(joinMember => joinMember.userId === member.memberId) && (
                                        <div key={member.memberId} className="search_chat_member">
                                            <img src={imageUrl+profileImgList[member.userNo]} style={{ width: "3vw", height: "3vw", borderRadius: "1vw" }}/>
                                            <div style={{color:"black"}}>{member.memberId}</div>
                                            <input
                                                type="checkbox"
                                                checked={selectedMembers.includes(member.memberId)}
                                                onChange={() => toggleMemberSelection(member.memberId)}
                                            />
                                        </div>
                                    )
                                ))
                            ) : (
                                members.map(member => (
                                    !joinMembers.some(joinMember => joinMember.userId === member.memberId) && (
                                        <div key={member.memberId} className="search_chat_member">
                                            <img src={imageUrl+profileImgList[member.userNo]} style={{ width: "3vw", height: "3vw", borderRadius: "1vw" }}/>
                                            <div style={{color:"black"}}>{member.memberId}</div>
                                            <input
                                                type="checkbox"
                                                checked={selectedMembers.includes(member.memberId)}
                                                onChange={() => toggleMemberSelection(member.memberId)}
                                            />
                                        </div>
                                    )
                                ))
                            )}
                        </div>
                        <button type="button" id="chatRoom_member" onClick={groupMember}>
                            초대하기
                        </button>
                    </div>
                </div>

            )}
        </form>
    );
}

export default InviteChatModal;
