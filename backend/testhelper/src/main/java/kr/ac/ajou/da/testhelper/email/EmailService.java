package kr.ac.ajou.da.testhelper.email;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.AccountService;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.email.dto.PostCodeReqDto;
import kr.ac.ajou.da.testhelper.email.dto.PostEmailReqDto;
import kr.ac.ajou.da.testhelper.portal.PortalAccount;
import kr.ac.ajou.da.testhelper.portal.account.PortalAccountService;
import kr.ac.ajou.da.testhelper.redis.RedisService;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmailService {
		
	@Autowired
	private EmailServiceImpl emailServiceImpl;
	
	@Autowired
	private RedisService redisService;
	
	@Autowired
	private AccountService accountService;
	
	@Autowired
	private PortalAccountService portalAccountService;
	
	public Optional<Account> verifyEmail(String email) {
		return accountService.verifyEmail(email);
	}
	
	public PortalAccount checkPortal(String email) {
		return portalAccountService.getByEmail(email);
	}

	public boolean sendCode(String email) throws Exception {
		if(!verifyEmail(email).isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 존재하는 계정입니다.");
		}
		checkPortal(email);
		emailServiceImpl.sendCodeMessage(email);
		return true;
	}

	public boolean confirmCode(PostCodeReqDto reqDto) {
		return redisService.isVerify(reqDto);
	}

	@Transactional
	public boolean sendPassword(PostEmailReqDto reqDto) throws Exception {
		emailServiceImpl.sendPasswordMessage(reqDto.getEmail());
		return true;
	}

}
