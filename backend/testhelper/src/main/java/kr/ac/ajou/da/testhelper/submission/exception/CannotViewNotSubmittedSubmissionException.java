package kr.ac.ajou.da.testhelper.submission.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CannotViewNotSubmittedSubmissionException extends ResponseStatusException {
    public CannotViewNotSubmittedSubmissionException() {
        super(HttpStatus.BAD_REQUEST, "제출되지 않았습니다.");
    }
}
