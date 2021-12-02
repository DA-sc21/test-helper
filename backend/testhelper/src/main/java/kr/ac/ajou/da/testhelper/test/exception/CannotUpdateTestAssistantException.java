package kr.ac.ajou.da.testhelper.test.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CannotUpdateTestAssistantException extends ResponseStatusException {
    public CannotUpdateTestAssistantException() {
        super(HttpStatus.BAD_REQUEST, "시험 응시 후 시험 감독관을 변경할 수 없습니다.");
    }
}
