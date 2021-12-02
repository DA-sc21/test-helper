package kr.ac.ajou.da.testhelper.account;

import kr.ac.ajou.da.testhelper.account.dto.PostAccountReqDto;
import kr.ac.ajou.da.testhelper.account.dto.PutAccountPasswordReqDto;
import kr.ac.ajou.da.testhelper.account.exception.AccountNotFoundException;
import kr.ac.ajou.da.testhelper.definition.PortalStatus;
import kr.ac.ajou.da.testhelper.portal.PortalAccount;
import kr.ac.ajou.da.testhelper.portal.account.PortalAccountService;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService implements UserDetailsService {

    private final AccountRepository accountRepository;
     private final PortalAccountService portalAccountService;

    @Autowired
	private PasswordEncoder passwordEncoder;

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
    public boolean signUp(PostAccountReqDto reqDto) {
    	if(!verifyEmail(reqDto.getEmail()).isEmpty()) {
    		throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 존재하는 계정입니다. 비밀번호 찾기를 진행해주세요.");
    	}
		Account account = new Account(reqDto.getName(), reqDto.getEmail(), passwordEncoder.encode(reqDto.getPassword()), reqDto.getRole());
		PortalAccount portalAccount = portalAccountService.getByEmail(reqDto.getEmail());
		accountRepository.save(account);
		portalAccount.updateJoined(PortalStatus.DONE);
		return true;
	}
  
    @Transactional
    private Optional<Account> verifyEmail(String email) {
		return accountRepository.findByEmail(email);
	}

	public List<Account> getByIds(List<Long> ids) {
        return accountRepository.findAllById(ids);
    }

    @Transactional
    public List<Account> getAssistantsByEmailStartingWith(String email) {
        return accountRepository.findAllByEmailStartingWith(email);
    }
    
    @Transactional
    public Account getByEmail(String email) {
		return accountRepository.findByEmail(email)
				.orElseThrow(AccountNotFoundException::new);
	}

    @Transactional
	public boolean updatePasswordByEmail(String email, String password) {
		Account account = getByEmail(email);
		account.updatePassword(passwordEncoder.encode(password));
		return true;
	}

}
