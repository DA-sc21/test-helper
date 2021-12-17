package kr.ac.ajou.da.testhelper.portal.account.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class PortalAccountNotFoundException extends ResponseStatusException {
	public PortalAccountNotFoundException() {
        super(HttpStatus.NOT_FOUND, "학교에 등록된 이메일이 아닙니다.");
    }
}
