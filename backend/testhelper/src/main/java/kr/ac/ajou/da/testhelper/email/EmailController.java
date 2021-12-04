package kr.ac.ajou.da.testhelper.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.email.dto.PostCodeReqDto;
import kr.ac.ajou.da.testhelper.email.dto.PostEmailReqDto;

@RestController
public class EmailController {
	
	@Autowired
	private EmailService emailService;
		
	@PostMapping("/users/email/validate")
	public ResponseEntity<BooleanResponse> sendCode(@RequestBody PostEmailReqDto email) throws Exception {
		return ResponseEntity.ok().body(BooleanResponse.of(emailService.sendCode(email.getEmail())));
	}
	
	@PostMapping("/users/email/confirm")
	public ResponseEntity<BooleanResponse> confirmCode(@RequestBody PostCodeReqDto reqDto) {
		return ResponseEntity.ok().body(BooleanResponse.of(emailService.confirmCode(reqDto)));
	}
	
	@PostMapping("/users/email/password")
	public ResponseEntity<BooleanResponse> sendPassword(@RequestBody PostEmailReqDto reqDto) throws Exception {
		return ResponseEntity.ok().body(BooleanResponse.of(emailService.sendPassword(reqDto)));
	}

}
