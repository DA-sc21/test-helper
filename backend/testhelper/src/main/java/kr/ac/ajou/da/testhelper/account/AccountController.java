package kr.ac.ajou.da.testhelper.account;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import kr.ac.ajou.da.testhelper.account.dto.PostAccountReqDto;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AccountController {
	
	private final AccountService accountService;

	@PostMapping("/users")
    public ResponseEntity<BooleanResponse> signUp(@RequestBody PostAccountReqDto reqDto) {

		return ResponseEntity.ok().body(BooleanResponse.of(accountService.signUp(reqDto)));

    }
	
}
