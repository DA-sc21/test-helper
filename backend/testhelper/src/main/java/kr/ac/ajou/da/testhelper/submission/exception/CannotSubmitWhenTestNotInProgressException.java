package kr.ac.ajou.da.testhelper.submission.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CannotSubmitWhenTestNotInProgressException extends ResponseStatusException {
    public CannotSubmitWhenTestNotInProgressException() {
        super(HttpStatus.BAD_REQUEST, "시험 진행 중에만 제출할 수 있습니다.");
    }
}
