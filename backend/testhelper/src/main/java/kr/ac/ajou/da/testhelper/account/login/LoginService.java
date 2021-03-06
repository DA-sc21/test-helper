package kr.ac.ajou.da.testhelper.account.login;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.login.dto.LoginReqDto;
import kr.ac.ajou.da.testhelper.account.login.exception.FailedToLoginException;
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
public class LoginService {

    private final AuthenticationProvider authenticationProvider;

    public Account login(LoginReqDto reqDto) {

        log.info("Logging in : {}", reqDto.getUsername());

        Authentication authReq = resolveAuthenticationReqDto(reqDto);

        try {

            Authentication newAuthentication = authenticationProvider.authenticate(authReq);

            SecurityContextHolder.getContext().setAuthentication(newAuthentication);

            return (Account) newAuthentication.getPrincipal();

        } catch (AuthenticationException ex) {
            log.info("Login Failed : {}", reqDto.getUsername());
            throw new FailedToLoginException();
        }
    }

    private Authentication resolveAuthenticationReqDto(LoginReqDto reqDto) {
        UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(reqDto.getUsername(), reqDto.getPassword());
        authReq.setDetails(SecurityContextHolder.getContext().getAuthentication().getDetails());
        return authReq;
    }

    public void logout() {

        SecurityContextHolder.clearContext();

    }
}
