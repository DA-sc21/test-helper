package kr.ac.ajou.da.testhelper.test.result.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CannotGetTestResultWhenNotMarkedException extends ResponseStatusException {
    public CannotGetTestResultWhenNotMarkedException() {
        super(HttpStatus.BAD_REQUEST, "채점을 완료 후 시험 결과를 볼 수 있습니다.");
    }
}
