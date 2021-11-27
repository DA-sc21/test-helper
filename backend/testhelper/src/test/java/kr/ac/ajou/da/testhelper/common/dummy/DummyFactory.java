package kr.ac.ajou.da.testhelper.common.dummy;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.definition.AccountRole;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.definition.TestType;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class DummyFactory {

    public static Account createAccount() {
        return new Account(1L);
    }

    public static Account createProfessor() {
        return new Account(1L, "name", "email", "password", AccountRole.PROFESSOR);
    }

    public static Account createAssistant() {
        return new Account(1L, "name", "email", "password", AccountRole.ASSISTANT);
    }

    public static Course createCourse() {
        Set<Account> assistants = new HashSet<>();
        assistants.add(createAssistant());
        return new Course(1L, "name", createProfessor(), assistants);
    }

    public static Test createTest() {
        return new Test(1L, TestType.MID, LocalDateTime.now(), LocalDateTime.now(), createCourse());
    }

    public static Student createStudent() {
        return new Student(1L, "name", "201820000", "email@ajou.ac.kr");
    }

    public static Submission createSubmission() {
        return new Submission(1L, createStudent(), createTest(), 1L);
    }
}
