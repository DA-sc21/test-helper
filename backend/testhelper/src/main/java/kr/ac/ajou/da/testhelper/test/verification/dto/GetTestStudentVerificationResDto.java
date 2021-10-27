package kr.ac.ajou.da.testhelper.test.verification.dto;

import kr.ac.ajou.da.testhelper.definition.VerificationStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class GetTestStudentVerificationResDto {
    private final Long testId;
    private final Long studentId;
    private final Long submissionId;

    private final VerificationStatus verified;
}
