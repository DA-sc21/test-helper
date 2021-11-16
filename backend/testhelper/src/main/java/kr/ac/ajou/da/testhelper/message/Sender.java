//package kr.ac.ajou.da.testhelper.message;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.stereotype.Component;
//
//import lombok.extern.slf4j.Slf4j;
//
//@Component
//@Slf4j
//public class Sender {
//    @Autowired
//    private KafkaTemplate<String, ChattingMessage> kafkaTemplate;
//
//    // topic에 메시지를 보냄
//    public void send(String topic, ChattingMessage data, String testId, String studentId) {
//        log.info("sending data='{}' to topic='{}'", data, topic + "-" + testId + "-" + studentId);
//        kafkaTemplate.send(topic + "-" + testId + "-" + studentId, data);// send to react clients via websocket(STOMP)
//    }
//}
