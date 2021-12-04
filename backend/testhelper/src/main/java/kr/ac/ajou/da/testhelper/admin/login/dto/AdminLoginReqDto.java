package kr.ac.ajou.da.testhelper.admin.login.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class AdminLoginReqDto {
    private final String username;
    private final String password;
}
