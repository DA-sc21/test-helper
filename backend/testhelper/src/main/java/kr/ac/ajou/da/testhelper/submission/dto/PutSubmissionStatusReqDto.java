package kr.ac.ajou.da.testhelper.submission.dto;

import kr.ac.ajou.da.testhelper.submission.definition.SubmissionStatus;
import lombok.*;

@Getter
@Setter(value = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class PutSubmissionStatusReqDto {
    private SubmissionStatus status;
}

