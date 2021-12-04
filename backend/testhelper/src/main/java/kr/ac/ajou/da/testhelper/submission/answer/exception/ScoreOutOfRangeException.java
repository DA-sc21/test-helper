package kr.ac.ajou.da.testhelper.submission.answer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class ScoreOutOfRangeException extends ResponseStatusException {
    public ScoreOutOfRangeException() {
        super(HttpStatus.BAD_REQUEST, "0~최대 점수 범위 내로 입력해주세요.");
    }
}
