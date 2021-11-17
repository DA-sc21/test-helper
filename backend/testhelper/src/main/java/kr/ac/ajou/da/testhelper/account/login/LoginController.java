package kr.ac.ajou.da.testhelper.account.login;

import kr.ac.ajou.da.testhelper.account.dto.LoginReqDto;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LoginController {
    private final LoginService loginService;

    @PostMapping("/sessions")
    public ResponseEntity<BooleanResponse> login(LoginReqDto reqDto){

        loginService.login(reqDto);

        return ResponseEntity.ok().body(BooleanResponse.of(true));

    }
}
