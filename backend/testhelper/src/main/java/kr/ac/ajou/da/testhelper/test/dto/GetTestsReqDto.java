package kr.ac.ajou.da.testhelper.test.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class GetTestsReqDto {
    private final TestStatusOptions testStatus;
}
