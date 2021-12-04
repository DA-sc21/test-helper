package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.Submission;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;

@SpringBootTest
@Disabled
class TestGradeSenderIntegrationTest {

    @Autowired
    private TestGradeSender testGradeSender;

    @Test
    void sendGrade_success() {
        //given
        String email = "jmchoi1225@ajou.ac.kr";
        Submission submission = createSubmission(email);

        //when
        testGradeSender.sendGrade(Arrays.asList(submission));

        //then
    }

    private Submission createSubmission(String email) {
        Course course = DummyFactory.createCourse();
        Student student = new Student(1L, "name", "201820000", email, course);
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest();
        test.setResult(new TestResult(1L, 10, 30, 20.0));

        Submission submission = new Submission(1L, student, test, null);
        submission.updateScore(20);

        return submission;
    }
}