package kr.ac.ajou.da.testhelper.portal.account.dto;

import kr.ac.ajou.da.testhelper.account.definition.AccountRole;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter(value = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class PostPortalAccountReqDto {
	private String name;
	private String email;
	private AccountRole role;
}
