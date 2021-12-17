package kr.ac.ajou.da.testhelper.account.dto;

import lombok.Getter;

import java.util.Objects;

@Getter
public class GetAssistantsReqDto {
    private final String name;
    private final String email;

    public GetAssistantsReqDto(String name, String email) {
        this.name = Objects.isNull(name) ? "" : name;
        this.email = Objects.isNull(email) ? "" : email;
    }
}
