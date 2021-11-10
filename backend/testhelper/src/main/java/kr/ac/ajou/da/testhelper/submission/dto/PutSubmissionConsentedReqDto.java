package kr.ac.ajou.da.testhelper.submission.dto;

import lombok.*;

@Getter
@Setter(value = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class PutSubmissionConsentedReqDto {
    private Boolean consented;
}
