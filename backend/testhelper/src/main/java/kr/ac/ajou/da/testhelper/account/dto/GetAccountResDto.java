package kr.ac.ajou.da.testhelper.account.dto;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.definition.AccountRole;
import lombok.Getter;

@Getter
public class GetAccountResDto {
    private final Long id;
    private final String name;
    private final String email;
    private final AccountRole role;

    public GetAccountResDto(Account account) {
        this.id = account.getId();
        this.name = account.getName();
        this.email = account.getEmail();
        this.role = account.getRole();
    }
}
