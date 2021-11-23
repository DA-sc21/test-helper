package kr.ac.ajou.da.testhelper.account;

import kr.ac.ajou.da.testhelper.account.exception.AccountNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Transactional
    public Account get(Long id){
        return accountRepository.findById(id)
                .orElseThrow(AccountNotFoundException::new);
    }

    @Override
    @Transactional
    public Account loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }

    @Transactional
    public List<Account> getByIds(List<Long> ids) {
        return accountRepository.findAllById(ids);
    }
}
