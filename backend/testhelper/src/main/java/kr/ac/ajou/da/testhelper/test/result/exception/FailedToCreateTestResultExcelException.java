package kr.ac.ajou.da.testhelper.test.result.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FailedToCreateTestResultExcelException extends ResponseStatusException {
    public FailedToCreateTestResultExcelException() {
        super(HttpStatus.INTERNAL_SERVER_ERROR, "시험 결과 엑셀을 생성하는 과정에서 에러가 발생했습니다.");
    }
}
