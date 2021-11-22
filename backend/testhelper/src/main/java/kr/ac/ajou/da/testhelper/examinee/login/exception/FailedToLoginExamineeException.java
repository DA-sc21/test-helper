package kr.ac.ajou.da.testhelper.examinee.login.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FailedToLoginExamineeException extends ResponseStatusException {
    public FailedToLoginExamineeException() {
        super(HttpStatus.FORBIDDEN, "시험 대상자 인증을 실패했습니다");
    }
}
