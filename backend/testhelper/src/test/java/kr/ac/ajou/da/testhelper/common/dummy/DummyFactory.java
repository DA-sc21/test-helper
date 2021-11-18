package kr.ac.ajou.da.testhelper.common.dummy;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.definition.TestType;

import java.time.LocalDateTime;

public class DummyFactory {

    public static Account createAccount(){
        return new Account(1L);
    }

    public static Course createCourse() {
        return new Course(1L, "name");
    }

    public static Test createTest() {
        Course course = createCourse();
        return new Test(1L, TestType.MID, LocalDateTime.now(), LocalDateTime.now(), course);
    }
}
