package kr.ac.ajou.da.testhelper.message;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class MessageController {

//    @Autowired
//    private Sender sender;

    @Autowired
    private Receiver receiver;

    @Autowired
    private MessageCache chattingHistoryDAO;
        
//    private static String BOOT_TOPIC = "kafka-chatting";


   @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
    @RequestMapping("/history/{testId}/{studentId}")
    public List<MessageDto> getChattingHistory(@PathVariable String testId, @PathVariable String studentId) throws Exception {
    	log.info(testId);
    	log.info(studentId);
        return chattingHistoryDAO.get(testId, studentId);
    }

//    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
//    @MessageMapping("/file")
//    @SendTo("/topic/chatting")
//    public MessageDto sendFile(MessageDto message) throws Exception {
//        return new MessageDto(message.getFileName(), message.getRawData(), message.getUser());
//    }

}
