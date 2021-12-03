package kr.ac.ajou.da.testhelper.test.invitation;

import kr.ac.ajou.da.testhelper.examinee.Examinee;
import kr.ac.ajou.da.testhelper.test.invitation.exception.FailedToSendInvitationEmailException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestInvitationSender {

    private static final String TEST_INVITATION_TITLE_FORMAT = "[Test-Helper] %s 시험 접속 안내입니다.";
    private static final String TEST_INVITATION_BODY_FORMAT = "<div style='margin:100px;'>\n" +
            "    <h1>%s님, 안녕하세요 Test-Helper 입니다.</h1><br>\n" +
            "    <p><strong>%s</strong> 시험 접속 안내입니다.<p><br>\n" +
            "    <p>시험 시작 시간 : <strong>%s</strong><p>\n" +
            "    <p>시험 종료 시간 : <strong>%s</strong><p>\n" +
            "    <br>\n" +
            "    <p><a href=\"%s\">시험 접속 링크</a>입니다.</p>\n" +
            "</div>";
    private static final String TEST_INVITATION_LINK_FORMAT = "%s/tests/%d/students/%d?accessKey=%s";

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Value("${server.fe}")
    private String feDomain;

    private final JavaMailSender mailSender;
    private final String companyEmail;

    @Transactional
    public void sendInvitations(List<Examinee> examinees) {

        for (Examinee examinee : examinees) {
            try {
                mailSender.send(createInvitation(examinee));
            } catch (MessagingException | MailSendException e) {
                log.error("Failed To Send Email : email = {} test = {}", examinee.getStudent().getEmail(), examinee.getTest().getId());
                throw new FailedToSendInvitationEmailException();
            }
        }
    }

    private MimeMessage createInvitation(Examinee examinee) throws MessagingException {
        log.info("Sending Invitation to : {}", examinee.getStudent().getId());

        MimeMessage message = mailSender.createMimeMessage();
        message.addRecipients(Message.RecipientType.TO, examinee.getEmail());
        message.setSubject(createMailTitle(examinee));
        message.setText(createMailBody(examinee), "utf-8", "html"); //내용
        message.setFrom(companyEmail); //보내는 사람

        return message;
    }

    private String createMailTitle(Examinee examinee) {
        return String.format(TEST_INVITATION_TITLE_FORMAT, examinee.getTest().resolveName());
    }

    private String createMailBody(Examinee examinee) {
        return String.format(TEST_INVITATION_BODY_FORMAT,
                examinee.getStudent().getName(),
                examinee.getTest().resolveName(),
                examinee.getTest().getStartTime().format(dateTimeFormatter),
                examinee.getTest().getEndTime().format(dateTimeFormatter),
                createInvitationLink(examinee)
        );
    }

    private String createInvitationLink(Examinee examinee) {
        return String.format(TEST_INVITATION_LINK_FORMAT,
                feDomain,
                examinee.getTest().getId(),
                examinee.getStudent().getId(),
                examinee.getPassword());
    }


}
