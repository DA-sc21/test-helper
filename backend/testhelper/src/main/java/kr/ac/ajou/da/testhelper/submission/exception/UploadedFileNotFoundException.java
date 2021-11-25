package kr.ac.ajou.da.testhelper.submission.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class UploadedFileNotFoundException extends ResponseStatusException {
    public UploadedFileNotFoundException() {
        super(HttpStatus.NOT_FOUND, "업로드할 파일가 존재하지 않습니다.");
    }
}
