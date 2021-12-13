package kr.ac.ajou.da.testhelper.account;

import kr.ac.ajou.da.testhelper.account.dto.*;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.IsAccount;
import kr.ac.ajou.da.testhelper.common.security.authority.IsProfessor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class AccountController {
	
	private final AccountService accountService;

	@PostMapping("/users")
    public ResponseEntity<BooleanResponse> signUp(@RequestBody PostAccountReqDto reqDto) {
		return ResponseEntity.ok().body(BooleanResponse.of(accountService.signUp(reqDto)));
    }

    @GetMapping("/assistants")
    @IsProfessor
    public ResponseEntity<List<GetAssistantsResDto>> getAssistants(GetAssistantsReqDto reqDto){
        List<Account> assistants = accountService.getAssistantsByNameAndEmailStartingWith(reqDto);

        return ResponseEntity.ok().body(assistants.stream()
                .map(GetAssistantsResDto::new)
                .collect(Collectors.toList()));
    }
    
    @PutMapping("/users/password")
    @IsAccount
    public ResponseEntity<BooleanResponse> putAccountPassword(@RequestBody PutAccountPasswordReqDto reqDto,
                                                              @AuthenticationPrincipal @ApiIgnore Account account) {

    	return ResponseEntity.ok().body(BooleanResponse.of(accountService.updatePassword(account.getId(), reqDto.getPassword(), reqDto.getNewPassword())));
    }

    @GetMapping("/account")
    @IsAccount
    public ResponseEntity<GetAccountResDto> getAccount(@AuthenticationPrincipal @ApiIgnore Account account){
        return ResponseEntity.ok().body(new GetAccountResDto(account));
    }
            
}
