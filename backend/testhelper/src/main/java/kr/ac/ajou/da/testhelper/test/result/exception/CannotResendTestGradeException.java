package kr.ac.ajou.da.testhelper.test.result.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CannotResendTestGradeException extends ResponseStatusException {
    public CannotResendTestGradeException() {
        super(HttpStatus.BAD_REQUEST, "시험 결과를 재전송할 수 없습니다.");
    }
}
