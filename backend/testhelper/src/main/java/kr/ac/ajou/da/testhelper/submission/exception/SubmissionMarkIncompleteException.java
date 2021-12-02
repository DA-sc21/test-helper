package kr.ac.ajou.da.testhelper.submission.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class SubmissionMarkIncompleteException extends ResponseStatusException {
    public SubmissionMarkIncompleteException() {
        super(HttpStatus.BAD_REQUEST, "채점을 완료하지 않았습니다.");
    }
}
