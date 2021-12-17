package kr.ac.ajou.da.testhelper.admin.login;

import kr.ac.ajou.da.testhelper.account.login.LoginCookieResolver;
import kr.ac.ajou.da.testhelper.admin.AdminAccount;
import kr.ac.ajou.da.testhelper.admin.login.dto.AdminLoginReqDto;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AdminLoginController {
    private final AdminLoginService adminLoginService;
    private final LoginCookieResolver loginCookieResolver;

    @PostMapping("/admin/sessions")
    public ResponseEntity<BooleanResponse> login(AdminLoginReqDto reqDto){

        AdminAccount account = adminLoginService.login(reqDto);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, loginCookieResolver.resolveNameCookie(account).toString())
                .header(HttpHeaders.SET_COOKIE, loginCookieResolver.resolveRoleCookie(account).toString())
                .body(BooleanResponse.of(true));

    }

    @DeleteMapping("/admin/sessions")
    public ResponseEntity<BooleanResponse> logout(){

        adminLoginService.logout();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, loginCookieResolver.expireNameCookie().toString())
                .header(HttpHeaders.SET_COOKIE, loginCookieResolver.expireRoleCookie().toString())
                .body(BooleanResponse.of(true));
    }
}
