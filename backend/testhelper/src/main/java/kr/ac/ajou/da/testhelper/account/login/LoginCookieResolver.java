package kr.ac.ajou.da.testhelper.account.login;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.admin.AdminAccount;
import kr.ac.ajou.da.testhelper.examinee.Examinee;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class LoginCookieResolver {

    private static final String ROLE_COOKIE_KEY = "da_role";
    private static final String NAME_COOKIE_KEY = "da_name";;

    @Value("${server.cookie-domain}")
    private String cookieDomain;

    public ResponseCookie resolveRoleCookie(Account account) {
        return resolveRoleCookie(account.getRole().name());
    }

    public ResponseCookie resolveRoleCookie(AdminAccount account) {
        return resolveRoleCookie("ADMIN");
    }

    public ResponseCookie resolveRoleCookie(Examinee examinee) {
        return resolveNameCookie("EXAMINEE");
    }

    private ResponseCookie resolveRoleCookie(String role){
        return ResponseCookie.from(ROLE_COOKIE_KEY, role)
                .secure(true)
                .path("/")
                .domain(URLEncoder.encode(cookieDomain, StandardCharsets.UTF_8))
                .build();
    }

    public ResponseCookie resolveNameCookie(Account account){
        return resolveNameCookie(account.getName());
    }

    public ResponseCookie resolveNameCookie(AdminAccount account) {
        return resolveNameCookie(account.getName());
    }

    public ResponseCookie resolveNameCookie(Examinee examinee) {
        return resolveNameCookie(examinee.getStudent().getName());
    }

    private ResponseCookie resolveNameCookie(String name) {
        return ResponseCookie.from(NAME_COOKIE_KEY, URLEncoder.encode(name, StandardCharsets.UTF_8))
                .secure(true)
                .path("/")
                .domain(URLEncoder.encode(cookieDomain, StandardCharsets.UTF_8))
                .build();
    }

    public ResponseCookie expireRoleCookie() {
        return ResponseCookie.from(ROLE_COOKIE_KEY, null)
                .maxAge(0L)
                .domain(URLEncoder.encode(cookieDomain, StandardCharsets.UTF_8))
                .build();
    }

    public ResponseCookie expireNameCookie() {
        return ResponseCookie.from(NAME_COOKIE_KEY, null)
                .maxAge(0L)
                .domain(URLEncoder.encode(cookieDomain, StandardCharsets.UTF_8))
                .build();
    }
}
