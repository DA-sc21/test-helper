package kr.ac.ajou.da.testhelper.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.email.dto.PostCodeReqDto;
import kr.ac.ajou.da.testhelper.email.dto.PostEmailReqDto;
import kr.ac.ajou.da.testhelper.redis.RedisService;

@Service
public class EmailService {
		
	@Autowired
	private EmailServiceImpl emailServiceImpl;
	
	@Autowired
	private RedisService redisService;

	public boolean sendCode(String email) throws Exception {
		emailServiceImpl.sendCodeMessage(email);
		return true;
	}

	public boolean confirmCode(PostCodeReqDto reqDto) {
		return redisService.isVerify(reqDto);
	}

	public boolean sendPassword(PostEmailReqDto reqDto) throws Exception {
		emailServiceImpl.sendPasswordMessage(reqDto.getEmail());
		return true;
	}

}
