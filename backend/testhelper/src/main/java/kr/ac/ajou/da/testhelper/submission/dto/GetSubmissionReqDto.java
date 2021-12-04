package kr.ac.ajou.da.testhelper.submission.dto;

import lombok.Getter;

import java.util.Objects;

@Getter
public class GetSubmissionReqDto {
    private final String studentNumber;

    public GetSubmissionReqDto(String studentNumber) {
        this.studentNumber = Objects.isNull(studentNumber) ? "" : studentNumber;
    }
}
