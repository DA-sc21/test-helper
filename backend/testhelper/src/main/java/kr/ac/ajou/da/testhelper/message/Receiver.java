package kr.ac.ajou.da.testhelper.message;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class Receiver {
    @Autowired
    private SimpMessagingTemplate template;

    // kafka로부터 메시지를 받음
//    @KafkaListener(id = "main-listener", topics = "kafka-chatting")
    public void receive(MessageDto message, String testId, String studentId) throws Exception {
        log.info("message='{}'", message);
        HashMap<String, String> msg = new HashMap<>();
        msg.put("timestamp", Long.toString(message.getTimeStamp()));
        msg.put("message", message.getMessage());
        msg.put("author", message.getUser());

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(msg);

        // websocket으로 메시지를 전송
        this.template.convertAndSend("/topic/public/" + testId + "/" + studentId, json);
    }
}
