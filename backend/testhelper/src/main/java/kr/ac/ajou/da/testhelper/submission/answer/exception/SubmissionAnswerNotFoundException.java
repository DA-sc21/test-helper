package kr.ac.ajou.da.testhelper.submission.answer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class SubmissionAnswerNotFoundException extends ResponseStatusException {
    public SubmissionAnswerNotFoundException() {
        super(HttpStatus.NOT_FOUND, "답안이 없습니다.");
    }
}
