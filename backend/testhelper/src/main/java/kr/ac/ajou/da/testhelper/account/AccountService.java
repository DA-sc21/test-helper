package kr.ac.ajou.da.testhelper.account;

import kr.ac.ajou.da.testhelper.account.dto.PostAccountReqDto;
import kr.ac.ajou.da.testhelper.account.exception.AccountNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountService implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Autowired
	private PasswordEncoder passwordEncoder;

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

    @Transactional
    public boolean signUp(PostAccountReqDto reqDto) {
		Account account = new Account(reqDto.getName(), reqDto.getEmail(), passwordEncoder.encode(reqDto.getPassword()), reqDto.getRole());
		accountRepository.save(account);
		return true;
	}
}
