package kr.ac.ajou.da.testhelper.account.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AccountNotFoundException extends ResponseStatusException {
    public AccountNotFoundException() {
        super(HttpStatus.NOT_FOUND, "계정이 존재하지 않습니다.");
    }
}
