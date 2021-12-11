package kr.ac.ajou.da.testhelper.test.invitation.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FailedToSendEmailException extends ResponseStatusException {
    public FailedToSendEmailException() {
        super(HttpStatus.INTERNAL_SERVER_ERROR, "이메일 전송을 실패했습니다.");
    }
}
