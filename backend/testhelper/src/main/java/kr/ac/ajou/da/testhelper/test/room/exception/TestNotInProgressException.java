package kr.ac.ajou.da.testhelper.test.room.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class TestNotInProgressException extends ResponseStatusException {
    public TestNotInProgressException() {
        super(HttpStatus.BAD_REQUEST, "시험을 입장할 수 없습니다.");
    }
}
