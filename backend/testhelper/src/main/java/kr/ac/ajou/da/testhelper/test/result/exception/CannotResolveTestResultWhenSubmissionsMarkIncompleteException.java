package kr.ac.ajou.da.testhelper.test.result.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CannotResolveTestResultWhenSubmissionsMarkIncompleteException extends ResponseStatusException {
    public CannotResolveTestResultWhenSubmissionsMarkIncompleteException() {
        super(HttpStatus.BAD_REQUEST, "모든 시험지를 체점하지 않았습니다.");
    }
}
