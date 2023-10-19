// socket.js
import axios from 'axios';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const initializeSocket = async (user, setMessages, updateChatRooms) => {
  const socket = new SockJS('http://localhost:8082/Muzip/ws-chat');
  const stomp = Stomp.over(socket);

  await stomp.connect({}, () => {
    stompClient = stomp;

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

export const getStompClient = () => {
  return stompClient;
};
