package kr.ac.ajou.da.testhelper.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService implements UserDetailsService {

    private final AdminAccountRepository adminAccountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return adminAccountRepository.findByEmail(username)
                .orElseThrow(()-> new UsernameNotFoundException(username));
    }
}
