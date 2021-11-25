package kr.ac.ajou.da.testhelper.redis;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import kr.ac.ajou.da.testhelper.email.EmailServiceImpl;
import kr.ac.ajou.da.testhelper.email.dto.PostEmailConfirmReqDto;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RedisService {
	
	private final int LIMIT_TIME = 3 * 60; // 3분
	
	@Autowired
	private StringRedisTemplate stringRedisTemplate;

	public String getRedisValue(String key) {
		ValueOperations<String, String> stringValueOperations = stringRedisTemplate.opsForValue();
		System.out.println("Redis key : " + key);
		System.out.println("Redis value : " + stringValueOperations.get(key));
		return stringValueOperations.get(key);
	}

	public void setRedisValue(String key, String value) {
		ValueOperations<String, String> stringValueOperations = stringRedisTemplate.opsForValue();
		stringValueOperations.set(key, value, Duration.ofSeconds(LIMIT_TIME));
		System.out.println("Redis key : " + key);
		System.out.println("Redis value : " + stringValueOperations.get(key));
	}
	
	public boolean isVerify(PostEmailConfirmReqDto reqDto) {
		String value = getRedisValue(reqDto.getEmail());
		if(value == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "인증 코드가 만료되었습니다.");
		}
		if(!value.equals(reqDto.getCode())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 인증 코드입니다.");
		}
		return value.equals(reqDto.getCode());
	}

}
