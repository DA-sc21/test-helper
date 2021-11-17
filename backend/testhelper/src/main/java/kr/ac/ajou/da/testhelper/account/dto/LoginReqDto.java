package kr.ac.ajou.da.testhelper.account.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class LoginReqDto {
    private final String username;
    private final String password;
}
