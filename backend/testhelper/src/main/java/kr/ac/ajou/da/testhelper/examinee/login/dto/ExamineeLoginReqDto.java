package kr.ac.ajou.da.testhelper.examinee.login.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class ExamineeLoginReqDto {
    private final Long testId;
    private final Long studentId;
    private final String password;
}
