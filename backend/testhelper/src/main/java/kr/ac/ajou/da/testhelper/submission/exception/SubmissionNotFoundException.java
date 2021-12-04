package kr.ac.ajou.da.testhelper.submission.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class SubmissionNotFoundException extends ResponseStatusException {
    public SubmissionNotFoundException() {
        super(HttpStatus.NOT_FOUND, "제출물을 찾을 수 없습니다.");
    }
}
