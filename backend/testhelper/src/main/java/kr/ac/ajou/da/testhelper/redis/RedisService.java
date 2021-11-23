package kr.ac.ajou.da.testhelper.redis;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import kr.ac.ajou.da.testhelper.email.dto.PostEmailConfirmReqDto;

@Service
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
		return getRedisValue(reqDto.getEmail()).equals(reqDto.getCode());
	}

}
