package kr.ac.ajou.da.testhelper.test.dto;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@RequiredArgsConstructor
public class CreateTestReqDto {

    private final TestType type;

    private final LocalDateTime startTime;

    private final LocalDateTime endTime;

    private final List<Long> assistants;

    public Test createTest(Course course, List<Account> assistants, Long createdBy) {
        Test test = Test.create(type, startTime, endTime, assistants, course, createdBy);
        course.addTest(test);
        return test;
    }

    @Transactional
    public void updateTest(Test test, List<Account> assistants, Long updatedBy) {
        test.update(type, startTime, endTime, assistants, updatedBy);
    }
}
