package kr.ac.ajou.da.testhelper.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class InvalidInputException extends ResponseStatusException {
    public InvalidInputException(String message) {
        super(HttpStatus.BAD_REQUEST, message);

    }
}
