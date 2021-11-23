package kr.ac.ajou.da.testhelper.account.dto;

import kr.ac.ajou.da.testhelper.account.Account;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class GetAssistantsResDto {
    private final Long id;
    private final String name;
    private final String email;

    public GetAssistantsResDto(Account account) {
        this.id = account.getId();
        this.name = account.getName();
        this.email = account.getEmail();
    }
}
