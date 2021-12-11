package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.test.invitation.exception.FailedToSendEmailException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestGradeSender {
    private static final String TEST_GRADE_TITLE_FORMAT = "[Test-Helper] %s 시험 점수입니다.";
    private static final String TEST_GRADE_BODY_FORMAT = "<div style='margin:100px;'>\n" +
            "    <h1>%s님, 안녕하세요 Test-Helper 입니다.</h1><br>\n" +
            "    <p><strong>%s</strong> 시험 점수입니다.<p><br>\n" +
            "    <p> 점수 : <strong>%d</strong><p>\n" +
            "    <p> 평균 : <strong>%.2f</strong><p>\n" +
            "</div>";

    private final JavaMailSender mailSender;
    private final String companyEmail;

    @Transactional
    public void sendGrade(List<Submission> submissions) {

        for (Submission submission : submissions) {
            try {
                mailSender.send(createMessage(submission));
            } catch (MessagingException | MailSendException e) {
                log.error("Failed To Send Email : email = {} test = {}", submission.getStudent().getEmail(), submission.getTest().getId());
                throw new FailedToSendEmailException();
            }
        }
    }

    private MimeMessage createMessage(Submission submission) throws MessagingException {
        log.info("Sending Grades to : {}", submission.getStudent().getId());

        MimeMessage message = mailSender.createMimeMessage();
        message.addRecipients(Message.RecipientType.TO, submission.getStudent().getEmail());
        message.setSubject(createMailTitle(submission));
        message.setText(createMailBody(submission), "utf-8", "html"); //내용
        message.setFrom(companyEmail); //보내는 사람

        return message;
    }

    private String createMailTitle(Submission submission) {
        return String.format(TEST_GRADE_TITLE_FORMAT, submission.getTest().resolveName());
    }

    private String createMailBody(Submission submission) {
        return String.format(TEST_GRADE_BODY_FORMAT,
                submission.getStudent().getName(),
                submission.getTest().resolveName(),
                submission.getScore(),
                submission.getTest().getResult().getAverage()
        );
    }
}
