package kr.ac.ajou.da.testhelper.account.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class GetAssistantsReqDto {
    private final String email;
}
