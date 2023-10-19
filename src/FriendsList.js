import React, { useEffect, useState, useRef, useCallback } from 'react';
import './FriendsList.css';
import { useAuth } from './LoginContext';
import { FaSistrix } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { GoHeart, GoHeartFill } from "react-icons/go";
import axios from 'axios';
import { initializeSocket, getStompClient } from './ChatSocket';
import ChatArea from './ChatArea';
import {  useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { changeFriendMusicList } from './redux/musicListSlice';
import MypageMyPlaylist from './component/mypageMyPlaylist';
import MyPlayList from './component/MyPlayList';


export const FriendSearch = ({setFriend,setBtnFocus}) => {

  const { user } = useAuth();
  const stompClient = getStompClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isFriend, setIsFriend] = useState();
  const [follow, setFollow] = useState([]);
  const [follower, setFollower] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const imageUrl = 'http://localhost:3000/Muzip/resources/image/';
  const prevIsFriend = usePrevious(isFriend);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alarmStompClient = useSelector((state) => state.alarmState.alarmStompClient);
  const playlists = useSelector((state) => state.musicList.friendMusicList);

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


  //친구 검색
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      axios.get(`http://localhost:3000/Muzip/friendSearch?query=${searchQuery}`)
        .then(response => {
          setMembers(response.data);
        })
        .catch(console.error);
    } else {
      setMembers([]);
    }
  }, [searchQuery]);

  //팔로우 확인 코드
  useEffect(() => {
    if (selectedMember) {
      axios.get(`http://localhost:3000/Muzip/checkFollow?userId=${user.userId}&memberId=${selectedMember.userId}`)
        .then(response => {
          setIsFriend(response.data.isFriend);
        })
        .catch(console.error);
    }
  }, [selectedMember, isFriend]);

  const handleHeartClick = useCallback(() => {
    if (selectedMember) {
      const url = isFriend
        ? `http://localhost:3000/Muzip/unFollow?userId=${user.userId}&memberId=${selectedMember.userId}`
        : `http://localhost:3000/Muzip/Follow?userId=${user.userId}&memberId=${selectedMember.userId}`;
      axios.post(url)
        .then(response => {
          setIsFriend(response.data.isFriend);
          const followAlarm = sessionStorage.getItem("followAlarm");
          if (followAlarm == 'Y' && url == `http://localhost:3000/Muzip/Follow?userId=${user.userId}&memberId=${selectedMember.userId}`) {
            const newAlarm = {
              alarmNo: "",
              alarmMessage: "",
              receiverNo: selectedMember.userId,
              senderNo: user.userId,
              alarmKind: "follow",
              alarmPath: "",
              createDate: new Date().toISOString(),
              checkStatus: 'N',
              status: 'Y'
            };
            alarmStompClient.send('/alarm/alarm', {}, JSON.stringify(newAlarm));
          }
        })
        .catch(console.error);
    }
  }, [isFriend]);

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };



  const handleMemberClick = member => {
    setSelectedMember(member); // 멤버 클릭 시 선택된 멤버 저장
    axios.get(`http://localhost:3000/Muzip/chatRoomFriend?userId=${member.userId}`)
      .then(response => {
        setFollow(response.data);
      })
      .then(() => {
        axios.get(`http://localhost:3000/Muzip/followerlist?userId=${member.userId}`)
          .then(response => {
            setFollower(response.data);
          })
      }).then(() => {
        axios.get(`http://localhost:3000/Muzip/userInfo?userNo=${member.userNo}`)
          .then(response => {
            setUserInfo(response.data);
          })
      }).then(() => {
        axios
          .get("http://localhost:3000/Muzip/myPlaylist", {
            params: {
              userNo: member.userNo,
            },
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            let tempArr = [];
            if (response.data === null || response.data.length === 0) {
            } else if (response.data.length <= 4) {
              for (let i = 0; i < response.data.length; i++) {
                tempArr[i] = {
                  listName: response.data[i].playlistName,
                  playlistNo: response.data[i].playlistNo,
                  songList: response.data[i].playlistSongs,
                };
              }
            } else {
              for (let i = 0; i < 4; i++) {
                tempArr[i] = {
                  listName: response.data[i].playlistName,
                  playlistNo: response.data[i].playlistNo,
                  songList: response.data[i].playlistSongs,
                };
              }
            }
            dispatch(
              changeFriendMusicList({
                friendMusicList: [...tempArr],
              })
            );
          })
          .catch(console.log);
      })
      .catch(console.error);
    console.log(playlists);
  };

  const FdHome = (memberNo) => {
    navigate(`/user/${memberNo}`);
  }


  //메세지, 채팅방 생성
  const handleMsgClick = () => {
    if (selectedMember) {
      axios.post(`http://localhost:3000/Muzip/checkChatroom?userId=${user.userId}&memberId=${selectedMember.userId}`)
        .then(response => {
          const chatroomNo = response.data;
          if (chatroomNo !== -1) {
            setSelectedMember(false);
            setFriend(selectedMember.userId);
            setBtnFocus({ id: "/chat" });
            navigate("/chat");
          }
        })
        .catch(console.error);
    }
  };

  function smallScale(e) {
    console.log(e.target);
  }
  const [activeComponent, setActiveComponent] = useState();
  const handlePlaylistBoxClick = (index) => {
    setActiveComponent(
      <MyPlayList
        playlists={playlists}
        selectedPlaylistIndex={index} // Pass the selected index
        onBackToMyPagePlayList={handleBackToMyPagePlayList}
        pageUserData={selectedMember.userNo}
      />
    );
  };

  const handleBackToMyPagePlayList = () => {
    setActiveComponent(
      <MypageMyPlaylist
        playlists={playlists}
        onPlaylistBoxClick={handlePlaylistBoxClick}
        pageUserData={selectedMember.userNo}
      />
    );
  };

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (isLoaded) {
      console.log("플리", playlists);
      handleBackToMyPagePlayList();
    }
    setIsLoaded(true);
  }, [playlists, selectedMember]);

  return (
    <div id="home-feed">
      <div className="friend_box_main">
        <div className="friend_box_search_list">
          <FaSistrix size={28} className='Fasistrix' fill='black' />
          <input type="search"
            placeholder="이름을 검색해주세요."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ color: "black" }}
          />
          <div className='noSearch_friend'>
            {members.length === 0 && '검색 결과가 없습니다.'}
          </div>
          {members.map(member => (
            user.userId !== member.userId && (
              <div key={member.userId} className="search_list_member" onClick={() => handleMemberClick(member)}>
                <img src={imageUrl + profileImgList[member.userNo]} width="58vw" height="58vw" style={{ borderRadius: "1.5vw" }} />
                <div className='memberName_friend'>{member.userName}</div>
              </div>
            )
          ))}
        </div>
        {selectedMember && (
          <div className="friend_box_search_profile">
            <div className="friend_search_pf_main">
              <img src={imageUrl + profileImgList[selectedMember.userNo]} alt="프로필 이미지" />
              <div className="pf_info">
                <div style={{ fontWeight: 'bolder' }}>{selectedMember.userName}</div>
                <div style={{ fontWeight: 100 }}>@{selectedMember.userId}</div>
                <br />
                <div>팔로우 {follow.length} 팔로워 {follower.length}</div>
                <div className='friend_info'>{userInfo}</div>
              </div>
              <div className="pf_menu_ic">
                <div className='pf_content'>
                  <AiOutlineHome size={50} onClick={() => FdHome(selectedMember.userNo)} />
                  <HiOutlineChatBubbleLeftRight size={50} onClick={handleMsgClick} />
                  {isFriend ? (
                    <GoHeartFill color='red' size={50} onClick={handleHeartClick} />
                  ) : (
                    <GoHeart size={50} onClick={handleHeartClick} />
                  )}
                </div>
              </div>
            </div>
            <div className='pf_music_content'>
              {activeComponent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

