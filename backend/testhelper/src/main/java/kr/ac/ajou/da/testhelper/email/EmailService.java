package kr.ac.ajou.da.testhelper.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.email.dto.PostEmailConfirmReqDto;
import kr.ac.ajou.da.testhelper.redis.RedisService;

@Service
public class EmailService {
		
	@Autowired
	private EmailServiceImpl emailServiceImpl;

	public boolean sendEmail(String email) throws Exception {
		emailServiceImpl.sendSimpleMessage(email);
		return true;
	}

}
