package kr.ac.ajou.da.testhelper.account.login;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.login.dto.LoginReqDto;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.IsAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;
    private final LoginCookieResolver loginCookieResolver;


    @PostMapping("/sessions")
    public ResponseEntity<BooleanResponse> login(LoginReqDto reqDto){

        Account account = loginService.login(reqDto);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, loginCookieResolver.resolveNameCookie(account).toString())
                .header(HttpHeaders.SET_COOKIE, loginCookieResolver.resolveRoleCookie(account).toString())
                .body(BooleanResponse.of(true));

    }



    @DeleteMapping("/sessions")
    @IsAccount
    public ResponseEntity<BooleanResponse> logout(){

        loginService.logout();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, loginCookieResolver.expireNameCookie().toString())
                .header(HttpHeaders.SET_COOKIE, loginCookieResolver.expireRoleCookie().toString())
                .body(BooleanResponse.of(true));
    }
}
