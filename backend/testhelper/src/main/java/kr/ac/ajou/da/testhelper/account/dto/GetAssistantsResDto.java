package kr.ac.ajou.da.testhelper.account.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class GetAssistantsResDto {
    private final Long id;
    private final String name;
    private final String email;
}
