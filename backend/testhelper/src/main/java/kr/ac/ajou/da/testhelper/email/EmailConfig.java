package kr.ac.ajou.da.testhelper.email;

import java.util.Properties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class EmailConfig {

	@Bean
	public String companyEmail(){
		return "testhelper@naver.com";
	}
	
	@Bean
	public JavaMailSender javaMailService() {
		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		
		// 구글: smtp.gmail.com
		// 네이버: smtp.naver.com
		// 다음: smtp.daum.net
		mailSender.setHost("smtp.naver.com");
		// 구글: 587
		// 네이버: 465
		// 다음: 465
		mailSender.setPort(465);
		// 이메일 주소
		mailSender.setUsername(companyEmail());
		// 이메일 패스워드
		mailSender.setPassword("");
		
		Properties javaMailProperties = new Properties();
		
		javaMailProperties.put("mail.smtp.starttls.enable", "true");
        javaMailProperties.put("mail.smtp.auth", "true");
        javaMailProperties.put("mail.transport.protocol", "smtp");
        javaMailProperties.put("mail.debug", "true");
        javaMailProperties.put("mail.smtp.ssl.enable", "true");
 
        mailSender.setJavaMailProperties(javaMailProperties);
		
		return mailSender;
	}

}
