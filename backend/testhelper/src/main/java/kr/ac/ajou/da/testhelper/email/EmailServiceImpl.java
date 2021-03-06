package kr.ac.ajou.da.testhelper.email;

import java.util.Random;

import javax.mail.Message.RecipientType;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import kr.ac.ajou.da.testhelper.account.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import kr.ac.ajou.da.testhelper.account.AccountService;
import kr.ac.ajou.da.testhelper.redis.RedisService;
import kr.ac.ajou.da.testhelper.test.verification.TestStudentVerificationController;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailServiceImpl {
	
	@Autowired
	private JavaMailSender emailSender;
	
	@Autowired
	private RedisService redisService;
	
	@Autowired
	private AccountService accountService;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	private MimeMessage codeMessage(String to, String ePw) throws Exception {

		log.info("보내는 대상 : "+ to);
		log.info("인증 번호 : "+ ePw);
		
		MimeMessage  message = emailSender.createMimeMessage();
		message.addRecipients(RecipientType.TO, to);//보내는 대상
	    message.setSubject("[Test-Helper] 이메일 인증코드");//제목
	    
	    String msgg="";
	    msgg+= "<div style='margin:100px;'>";
	    msgg+= "<h1> 안녕하세요  Test-Helper 입니다. </h1>";
	    msgg+= "<br>";
	    msgg+= "<p>사이트로 돌아가 아래 코드를 입력해주세요.<p>";
	    msgg+= "<br>";
	    msgg+= "<p>감사합니다.<p>";
	    msgg+= "<br>";
	    msgg+= "<div align='center' style='border:1px solid black; font-family:verdana';>";
	    msgg+= "<h3 style='color:blue;'>인증코드</h3>";
	    msgg+= "<div style='font-size:130%'>";
	    msgg+= "CODE : <strong>";
	    msgg+= ePw + "</strong><div><br/> ";
	    msgg+= "</div>";
	    message.setText(msgg, "utf-8", "html"); //내용
	    message.setFrom("testhelper@naver.com"); //보내는 사람
	    return message;
	    
	}
	
	private MimeMessage passwordMessage(String to, String ePw) throws Exception {
		MimeMessage  message = emailSender.createMimeMessage();
		message.addRecipients(RecipientType.TO, to);//보내는 대상
	    message.setSubject("[Test-Helper] 임시 비밀번호");//제목
	    
	    String msgg="";
	    msgg+= "<div style='margin:100px;'>";
	    msgg+= "<h1> 안녕하세요  Test-Helper 입니다. </h1>";
	    msgg+= "<br>";
	    msgg+= "<p>사이트로 돌아가 임시 비밀번호로 로그인 후,<p>";
	    msgg+= "<br>";
	    msgg+= "<p>마이페이지에서 비밀번호를 변경해주세요.<p>";
	    msgg+= "<br>";
	    msgg+= "<p>감사합니다.<p>";
	    msgg+= "<br>";
	    msgg+= "<div align='center' style='border:1px solid black; font-family:verdana';>";
	    msgg+= "<h3 style='color:blue;'>임시 비밀번호</h3>";
	    msgg+= "<div style='font-size:130%'>";
	    msgg+= "<strong>";
	    msgg+= ePw + "</strong><div><br/> ";
	    msgg+= "</div>";
	    message.setText(msgg, "utf-8", "html"); //내용
	    message.setFrom("testhelper@naver.com"); //보내는 사람
	    
		return message;
	}
	
	// 인증 코드 만들기
	public static String createKey() {
		
		StringBuffer key = new StringBuffer();
		Random rnd = new Random();

		for (int i = 0; i < 8; i++) { // 인증코드 8자리
			
			int index = rnd.nextInt(3); // 0~2 까지 랜덤

			switch (index) {
			case 0:
				key.append((char) ((int) (rnd.nextInt(26)) + 97));
				// a~z (ex. 1+97=98 => (char)98 = 'b')
				break;
			case 1:
				key.append((char) ((int) (rnd.nextInt(26)) + 65));
				// A~Z 
				break;
			case 2:
				key.append((rnd.nextInt(10)));
				// 0~9
				break;
			}
		}

		return key.toString();
		
	}
	
	public void sendCodeMessage(String to) throws Exception {

		String code = createKey();
		MimeMessage message = codeMessage(to, code);
		try {
			log.info(message.toString());
			emailSender.send(message);
		} catch(MailException es) {
			es.printStackTrace();
			throw new IllegalArgumentException();
		}
		redisService.setRedisValue(to, code);
		
	}

	public void sendPasswordMessage(String email) throws Exception {
		Account account = accountService.getByEmail(email);
		String password = createKey();
		MimeMessage message = passwordMessage(email, password);
		try {
			log.info(message.toString());
			emailSender.send(message);
			account.updatePassword(passwordEncoder.encode(password));
		} catch(MailException e) {
			e.printStackTrace();
			throw new IllegalArgumentException();
		}
	}

}
