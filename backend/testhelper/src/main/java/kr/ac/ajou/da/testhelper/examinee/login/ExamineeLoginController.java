package kr.ac.ajou.da.testhelper.examinee.login;

import kr.ac.ajou.da.testhelper.account.login.LoginCookieResolver;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.IsExaminee;
import kr.ac.ajou.da.testhelper.examinee.Examinee;
import kr.ac.ajou.da.testhelper.examinee.login.dto.ExamineeLoginReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ExamineeLoginController {
    private final ExamineeLoginService examineeLoginService;
    private final LoginCookieResolver loginCookieResolver;

    @PostMapping("/examinee/sessions")
    public ResponseEntity<BooleanResponse> login(ExamineeLoginReqDto reqDto){

        Examinee examinee = examineeLoginService.login(reqDto);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, loginCookieResolver.resolveNameCookie(examinee).toString())
                .header(HttpHeaders.SET_COOKIE, loginCookieResolver.resolveRoleCookie(examinee).toString())
                .body(BooleanResponse.of(true));

    }

    @DeleteMapping("/examinee/sessions")
    @IsExaminee
    public ResponseEntity<BooleanResponse> logout(){

        examineeLoginService.logout();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, loginCookieResolver.expireNameCookie().toString())
                .header(HttpHeaders.SET_COOKIE, loginCookieResolver.expireRoleCookie().toString())
                .body(BooleanResponse.of(true));
    }
}
