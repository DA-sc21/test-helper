package kr.ac.ajou.da.testhelper.submission.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class GetSubmissionReqDto {
    private final String studentNumber;
}
