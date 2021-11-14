package kr.ac.ajou.da.testhelper.message;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MessageDto implements Serializable {
    private String message;
    private String user;
    private Long timeStamp;

    private String fileName;
    private String rawData;
    
    private String testId;
    private String studentId;

    public MessageDto() {
    }

    public MessageDto(String message, String user) {
        this.user = user;
        this.message = message;
    }

    public MessageDto(String fileName, String rawData, String user) {

        this.fileName = fileName;
        this.rawData = rawData;
        this.user = user;
    }

    public MessageDto(String message) {
        this.message = message;
    }
}
