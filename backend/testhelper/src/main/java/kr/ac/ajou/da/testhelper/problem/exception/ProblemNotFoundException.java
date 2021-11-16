package kr.ac.ajou.da.testhelper.problem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class ProblemNotFoundException extends ResponseStatusException {
	public ProblemNotFoundException() {
        super(HttpStatus.NOT_FOUND, "문제를 찾을 수 없습니다.");
    }
}
