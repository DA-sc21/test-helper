package kr.ac.ajou.da.testhelper.admin.login;

import kr.ac.ajou.da.testhelper.admin.login.dto.AdminLoginReqDto;
import kr.ac.ajou.da.testhelper.admin.login.exception.FailedToLoginAdminException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
public class AdminLoginService {

    private final AuthenticationProvider adminAuthenticationProvider;

    public void login(AdminLoginReqDto reqDto) {

        log.info("Logging in : {}", reqDto.getUsername());

        Authentication authReq = resolveAuthenticationReqDto(reqDto);

        try {

            Authentication newAuthentication = adminAuthenticationProvider.authenticate(authReq);

            SecurityContextHolder.getContext().setAuthentication(newAuthentication);

        } catch (AuthenticationException ex) {
            log.info("Login Failed : {}", reqDto.getUsername());
            throw new FailedToLoginAdminException();
        }
    }

    private Authentication resolveAuthenticationReqDto(AdminLoginReqDto reqDto) {
        UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(reqDto.getUsername(), reqDto.getPassword());
        authReq.setDetails(SecurityContextHolder.getContext().getAuthentication().getDetails());
        return authReq;
    }

    public void logout() {

        SecurityContextHolder.clearContext();

    }
}
