package kr.ac.ajou.da.testhelper.answer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AnswerNotFoundException extends ResponseStatusException {
	public AnswerNotFoundException() {
        super(HttpStatus.NOT_FOUND, "해당 id가 존재하지 않습니다.");
    }
}
