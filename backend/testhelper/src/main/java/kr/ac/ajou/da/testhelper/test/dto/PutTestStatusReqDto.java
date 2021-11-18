package kr.ac.ajou.da.testhelper.test.dto;

import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PutTestStatusReqDto {
    private final TestStatus status;
}
