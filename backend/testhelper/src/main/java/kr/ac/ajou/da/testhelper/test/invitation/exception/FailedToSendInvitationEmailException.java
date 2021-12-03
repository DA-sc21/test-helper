package kr.ac.ajou.da.testhelper.test.invitation.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FailedToSendInvitationEmailException extends ResponseStatusException {
    public FailedToSendInvitationEmailException() {
        super(HttpStatus.INTERNAL_SERVER_ERROR, "시험 접속 이메일 전송을 실패했습니다.");
    }
}
