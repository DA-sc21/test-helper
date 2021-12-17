package kr.ac.ajou.da.testhelper.course.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CourseNotFoundException extends ResponseStatusException {
    public CourseNotFoundException() {
        super(HttpStatus.NOT_FOUND, "수업을 찾을 수 없습니다.");
    }
}
