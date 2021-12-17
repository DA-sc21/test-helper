package kr.ac.ajou.da.testhelper.test.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CannotDeleteStartedTestException extends ResponseStatusException {
    public CannotDeleteStartedTestException() {
        super(HttpStatus.BAD_REQUEST, "시작된 시험을 삭제할 수 없습니다.");
    }
}
