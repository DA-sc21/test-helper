package kr.ac.ajou.da.testhelper.test.result;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class TestResultNotFoundException extends ResponseStatusException {
    public TestResultNotFoundException() {
        super(HttpStatus.NOT_FOUND, "시험 결과를 찾을 수 없습니다.");
    }
}
