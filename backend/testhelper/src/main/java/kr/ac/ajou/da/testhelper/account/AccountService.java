package kr.ac.ajou.da.testhelper.account;

import kr.ac.ajou.da.testhelper.account.exception.AccountNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountService implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Transactional
    public Account get(Long id){
        return accountRepository.findById(id)
                .orElseThrow(()-> new AccountNotFoundException());
    }

    @Override
    @Transactional
    public Account loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }
}
