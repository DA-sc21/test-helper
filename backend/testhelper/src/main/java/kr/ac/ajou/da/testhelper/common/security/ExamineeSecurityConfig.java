package kr.ac.ajou.da.testhelper.common.security;

import kr.ac.ajou.da.testhelper.examinee.ExamineeService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@RequiredArgsConstructor
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE + 100)
public class ExamineeSecurityConfig extends WebSecurityConfigurerAdapter {

    private final ExamineeService examineeService;

    @Bean
    public PasswordEncoder ExamineePasswordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationProvider examineeAuthenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(examineeService);
        authenticationProvider.setPasswordEncoder(ExamineePasswordEncoder());

        return authenticationProvider;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(examineeService).passwordEncoder(ExamineePasswordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .antMatcher("/examinee/sessions")
                .csrf().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.POST, "/examinee/sessions").permitAll()
                .anyRequest().authenticated();
    }
}