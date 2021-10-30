package kr.ac.ajou.da.testhelper.test.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class TestNotFoundException extends ResponseStatusException {

    public TestNotFoundException() {
        super(HttpStatus.NOT_FOUND, "테스트를 찾을 수 없습니다.");
    }
}
