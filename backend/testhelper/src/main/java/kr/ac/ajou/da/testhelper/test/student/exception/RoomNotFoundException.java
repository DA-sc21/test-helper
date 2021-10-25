package kr.ac.ajou.da.testhelper.test.student.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class RoomNotFoundException extends ResponseStatusException {
    public RoomNotFoundException() {
        super(HttpStatus.NOT_FOUND, "방을 찾을 수 없습니다.");
    }
}
