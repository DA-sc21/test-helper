package kr.ac.ajou.da.testhelper.account;


import kr.ac.ajou.da.testhelper.account.definition.AccountRole;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.Collections;

@NoArgsConstructor
@Getter
@Setter(value = AccessLevel.PRIVATE)
@Entity
public class Account implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private AccountRole role;

    public Account(Long id) {
        this.id = id;
    }

    public Account(Long id, String name, String email, String password, AccountRole role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    
    public Account(String name, String email, String password, AccountRole role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public boolean isProfessor(){
        return AccountRole.PROFESSOR.equals(role);
    }

    public boolean isAssistant(){
        return AccountRole.ASSISTANT.equals(role);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role.resolveAuthority()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
