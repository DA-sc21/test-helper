package kr.ac.ajou.da.testhelper.account.login.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FailedToLoginException extends ResponseStatusException {
    public FailedToLoginException() {
        super(HttpStatus.FORBIDDEN, "아이디 또는 비밀번호가 틀렸습니다.");
    }
}
