package kr.ac.ajou.da.testhelper.submission.answer.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PutSubmissionProblemScoreReqDto {
    private final Integer score;
}
