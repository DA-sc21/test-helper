package kr.ac.ajou.da.testhelper.file.exception;

import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FailedToConvertFileException extends ResponseStatusException {
    public FailedToConvertFileException(Long studentId, Long testId, SubmissionType submissionType) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, String.format("파일 변경에 실패했습니다 : 학생번호 = {} 시험 번호 = {} 파일 종류 = {}", studentId, testId, submissionType.name()));
    }
}
