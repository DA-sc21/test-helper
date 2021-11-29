package kr.ac.ajou.da.testhelper.test.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CannotResendTestInvitationException extends ResponseStatusException {
    public CannotResendTestInvitationException() {
        super(HttpStatus.BAD_REQUEST, "시험 링크를 재전송할 수 없습니다.");
    }
}
