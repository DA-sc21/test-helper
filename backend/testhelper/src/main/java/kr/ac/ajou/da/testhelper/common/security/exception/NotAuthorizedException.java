package kr.ac.ajou.da.testhelper.common.security.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NotAuthorizedException extends ResponseStatusException {
    public NotAuthorizedException() {
        super(HttpStatus.FORBIDDEN, "접근 권한이 없습니다.");
    }
}
