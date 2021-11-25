package kr.ac.ajou.da.testhelper.account;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import kr.ac.ajou.da.testhelper.account.dto.PostAccountReqDto;
import kr.ac.ajou.da.testhelper.account.dto.GetAssistantsReqDto;
import kr.ac.ajou.da.testhelper.account.dto.GetAssistantsResDto;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.IsProfessor;
import lombok.RequiredArgsConstructor;

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
        List<Account> assistants = accountService.getAssistantsByEmailStartingWith(reqDto.getEmail());

        return ResponseEntity.ok().body(assistants.stream()
                .map(GetAssistantsResDto::new)
                .collect(Collectors.toList()));
    }

}
