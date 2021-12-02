package kr.ac.ajou.da.testhelper.submission.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class GetDetailedSubmissionReqDto {
    private final Boolean includeCapture;
}
