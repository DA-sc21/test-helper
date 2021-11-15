package kr.ac.ajou.da.testhelper.common.dummy;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.definition.AccountRole;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.definition.TestType;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

public class DummyFactory {
    private static final Account PROFESSOR = new Account(1L, "name", "email@ajou.ac.kr","password", AccountRole.PROFESSOR);
    private static final Account ASSISTANT = new Account(2L, "name", "email@ajou.ac.kr","password", AccountRole.ASSISTANT);
    private static final Course COURSE = new Course(1L, "name");
    private static final kr.ac.ajou.da.testhelper.test.Test TEST = new kr.ac.ajou.da.testhelper.test.Test(1L,
            TestType.MID,
            LocalDateTime.now(),
            LocalDateTime.now(),
            COURSE);
    private static final Student STUDENT = new Student(1L, "name", "201820000", "email@ajou.ac.kr");
    private static final Submission SUBMISSION = new Submission(1L, STUDENT, TEST, ASSISTANT.getId());
    private static final List<Submission> SUBMISSIONS = Arrays.asList(new Submission(1L, STUDENT, TEST, ASSISTANT.getId()), new Submission(2L, STUDENT, TEST, ASSISTANT.getId()), new Submission(3L, STUDENT, TEST, ASSISTANT.getId()));

    public static Account createProfessor() {
        return PROFESSOR;
    }

    public static Account createAssistant() {
        return ASSISTANT;
    }

    public static Course createCourse() {
        return COURSE;
    }

    public static Test createTest() {
        return TEST;
    }

    public static Student createStudent() {
        return STUDENT;
    }

    public static Submission createSubmission() {
        return SUBMISSION;
    }

    public static List<Submission> createSubmissions() {
        return SUBMISSIONS;
    }
}
