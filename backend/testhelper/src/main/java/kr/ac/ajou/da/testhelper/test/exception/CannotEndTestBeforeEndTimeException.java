package kr.ac.ajou.da.testhelper.test.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CannotEndTestBeforeEndTimeException extends ResponseStatusException {
    public CannotEndTestBeforeEndTimeException() {
        super(HttpStatus.BAD_REQUEST, "시험 종료 시간 전에 시험을 종료할 수 없습니다.");
    }
}
