package kr.ac.ajou.da.testhelper.test.invitation;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.examinee.Examinee;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
//@Disabled
class TestInvitationSenderIntegrationTest {

    @Autowired
    private TestInvitationSender testInvitationSender;

    @Test
    void sendInvitations_success() {
        //given
        String email = "jmchoi1225@ajou.ac.kr";
        Examinee examinee = createExaminee(email);

        //when
        testInvitationSender.sendInvitations(List.of(examinee));

        //then
    }

    private Examinee createExaminee(String email) {
        Course course = DummyFactory.createCourse();
        Student student = new Student(1L, "name", "201820000", email, course);
        kr.ac.ajou.da.testhelper.test.Test test = new kr.ac.ajou.da.testhelper.test.Test(1L,
                TestType.MID,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(2),
                course
        );

        return Examinee.create(student, test, DummyFactory.createAccount());
    }
}