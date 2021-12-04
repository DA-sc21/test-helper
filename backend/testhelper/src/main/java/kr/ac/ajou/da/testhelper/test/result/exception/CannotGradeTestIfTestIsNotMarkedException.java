package kr.ac.ajou.da.testhelper.test.result.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CannotGradeTestIfTestIsNotMarkedException extends ResponseStatusException {
    public CannotGradeTestIfTestIsNotMarkedException() {
        super(HttpStatus.BAD_REQUEST, "체점이 완료되지 않았습니다.");
    }
}
