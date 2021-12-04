package kr.ac.ajou.da.testhelper.test.verification.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CannotVerifyWhenTestNotInProgressException extends ResponseStatusException {
    public CannotVerifyWhenTestNotInProgressException() {
        super(HttpStatus.BAD_REQUEST, "시험 진행 중일 때만 변경 가능합니다.");
    }
}
