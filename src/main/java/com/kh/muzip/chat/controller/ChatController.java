//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.kh.muzip.chat.vo.ChatMessage;
//import com.kh.muzip.chat.vo.ChatMessageRepository;
//
//@RestController
//public class ChatController {
//
//    private final SimpMessagingTemplate messagingTemplate;
//    private final ChatMessageRepository chatMessageRepository;
//
//    public ChatController(SimpMessagingTemplate messagingTemplate, ChatMessageRepository chatMessageRepository) {
//        this.messagingTemplate = messagingTemplate;
//        this.chatMessageRepository = chatMessageRepository;
//    }
//
//    @MessageMapping("/chat/sendMessage")
//    public void sendMessage(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
//        // 메시지 DB에 저장
//        chatMessageRepository.save(chatMessage);
//
//        // 클라이언트에게 메시지 전송
//        messagingTemplate.convertAndSend("/topic/public", chatMessage);
//    }
//}
