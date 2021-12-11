package kr.ac.ajou.da.testhelper.test.invitation;

import kr.ac.ajou.da.testhelper.examinee.Examinee;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.invitation.exception.FailedToSendEmailException;
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
    
    private static final String TEST_CANCELLATION_TITLE_FORMAT = "[Test-Helper] %s 시험 취소 안내입니다.";
    private static final String TEST_CANCELLATION_BODY_FORMAT = "<div style='margin:100px;'>\n" +
            "    <h1>%s님, 안녕하세요 Test-Helper 입니다.</h1><br>\n" +
            "    <p><strong>%s</strong> 시험이 취소되었습니다.<p><br>\n" +
            "</div>";

    private static final String TEST_UPDATED_TITLE_FORMAT = "[Test-Helper] %s 시험 변경사항 안내입니다.";
    private static final String TEST_UPDATED_BODY_FORMAT = "<div style='margin:100px;'>\n" +
            "    <h1>%s님, 안녕하세요 Test-Helper 입니다.</h1><br>\n" +
            "    <p><strong>%s</strong> 시험 변경사항 안내입니다.<p><br>\n" +
            "    <p>시험 시작 시간 : <strong>%s</strong><p>\n" +
            "    <p>시험 종료 시간 : <strong>%s</strong><p>\n" +
            "    <br>\n" +
            "    <p><a href=\"%s\">시험 접속 링크</a>입니다.</p>\n" +
            "</div>";

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
                log.error("Failed To Send Invitation Email : email = {} test = {}", examinee.getStudent().getEmail(), examinee.getTest().getId());
                throw new FailedToSendEmailException();
            }
        }
    }

    private MimeMessage createInvitation(Examinee examinee) throws MessagingException {
        log.info("Sending Invitation to : {}", examinee.getStudent().getId());

        MimeMessage message = mailSender.createMimeMessage();
        message.addRecipients(Message.RecipientType.TO, examinee.getEmail());
        message.setSubject(createInvitationTitle(examinee));
        message.setText(createInvitationBody(examinee), "utf-8", "html"); //내용
        message.setFrom(companyEmail); //보내는 사람

        return message;
    }

    private String createInvitationTitle(Examinee examinee) {
        return String.format(TEST_INVITATION_TITLE_FORMAT, examinee.getTest().resolveName());
    }

    private String createInvitationBody(Examinee examinee) {
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

    private String createInvitationLink(Submission submission) {
        return String.format(TEST_INVITATION_LINK_FORMAT,
                feDomain,
                submission.getTest().getId(),
                submission.getStudent().getId(),
                Examinee.resolvePassword(submission.getId(), //TODO : 나중에 수정하기
                        submission.getStudent().getId(),
                        submission.getTest().getId()));
    }

    public void sendCancellation(Test test) {

        for(Submission submission : test.getSubmissions()){

            log.info("Sending Cancellation to : {}", submission.getStudent().getId());

            try {
                mailSender.send(createCancellation(submission));
            } catch (MessagingException | MailSendException e) {
                log.error("Failed To Send Cancellation Email : email = {} test = {}", submission.getStudent().getEmail(), submission.getTest().getId());
                throw new FailedToSendEmailException();
            }
        }

    }

    private MimeMessage createCancellation(Submission submission) throws MessagingException{

        MimeMessage message = mailSender.createMimeMessage();
        message.addRecipients(Message.RecipientType.TO, submission.getStudent().getEmail());
        message.setSubject(createCancellationTitle(submission));
        message.setText(createCancellationBody(submission), "utf-8", "html"); //내용
        message.setFrom(companyEmail); //보내는 사람

        return message;
    }

    private String createCancellationTitle(Submission submission) {
        return String.format(TEST_CANCELLATION_TITLE_FORMAT, submission.getTest().resolveName());
    }

    private String createCancellationBody(Submission submission) {
        return String.format(TEST_CANCELLATION_BODY_FORMAT,
                submission.getStudent().getName(),
                submission.getTest().resolveName()
        );
    }

    public void sendUpdates(Test test) {
        
        for(Submission submission : test.getSubmissions()){

            log.info("Sending Updates to : {}", submission.getStudent().getId());

            try {
                mailSender.send(createUpdates(submission));
            } catch (MessagingException | MailSendException e) {
                log.error("Failed To Send Updates Email : email = {} test = {}", submission.getStudent().getEmail(), submission.getTest().getId());
                throw new FailedToSendEmailException();
            }
        }
    }

    private MimeMessage createUpdates(Submission submission) throws MessagingException{

        MimeMessage message = mailSender.createMimeMessage();
        message.addRecipients(Message.RecipientType.TO, submission.getStudent().getEmail());
        message.setSubject(createUpdatesTitle(submission));
        message.setText(createUpdatesBody(submission), "utf-8", "html"); //내용
        message.setFrom(companyEmail); //보내는 사람

        return message;
    }

    private String createUpdatesTitle(Submission submission) {
        return String.format(TEST_UPDATED_TITLE_FORMAT, submission.getTest().resolveName());
    }

    private String createUpdatesBody(Submission submission) {
        return String.format(TEST_UPDATED_BODY_FORMAT,
                submission.getStudent().getName(),
                submission.getTest().resolveName(),
                submission.getTest().getStartTime().format(dateTimeFormatter),
                submission.getTest().getEndTime().format(dateTimeFormatter),
                createInvitationLink(submission)
        );
    }
}
