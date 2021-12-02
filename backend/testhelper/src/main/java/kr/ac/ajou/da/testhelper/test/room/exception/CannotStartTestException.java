package kr.ac.ajou.da.testhelper.test.room.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CannotStartTestException extends ResponseStatusException {
    public CannotStartTestException() {
        super(HttpStatus.BAD_REQUEST, "시험을 시작할 수 없습니다.");
    }
}
