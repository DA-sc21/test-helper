package kr.ac.ajou.da.testhelper.admin.login.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FailedToLoginAdminException extends ResponseStatusException {
    public FailedToLoginAdminException() {
        super(HttpStatus.FORBIDDEN, "아이디 또는 비밀번호가 틀렸습니다.");
    }
}
