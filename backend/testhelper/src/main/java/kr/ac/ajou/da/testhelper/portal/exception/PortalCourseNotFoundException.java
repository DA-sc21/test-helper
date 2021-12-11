package kr.ac.ajou.da.testhelper.portal.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class PortalCourseNotFoundException extends ResponseStatusException {
	public PortalCourseNotFoundException() {
        super(HttpStatus.NOT_FOUND, "해당 코스가 존재하지 않습니다.");
    }
}
