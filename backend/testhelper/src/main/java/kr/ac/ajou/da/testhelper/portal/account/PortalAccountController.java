package kr.ac.ajou.da.testhelper.portal.account;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.portal.account.dto.PostPortalAccountReqDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class PortalAccountController {
	private final PortalAccountService portalAccountService;
	
	@PostMapping("/admin/portal/users")
	public ResponseEntity<BooleanResponse> postPortalAccount(@RequestBody PostPortalAccountReqDto reqDto) {
		portalAccountService.createPortalAccount(reqDto);
		return ResponseEntity.ok().body(BooleanResponse.TRUE);
	}

}
