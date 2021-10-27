package kr.ac.ajou.da.testhelper.test.verification.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter(AccessLevel.PRIVATE)
public class GetTestStudentVerificationReqDto {
    private Boolean verified;

}
