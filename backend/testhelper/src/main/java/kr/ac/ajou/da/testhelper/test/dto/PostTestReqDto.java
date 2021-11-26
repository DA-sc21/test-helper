package kr.ac.ajou.da.testhelper.test.dto;

import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@RequiredArgsConstructor
public class PostTestReqDto {
    private final TestType type;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
    private final LocalDateTime startTime;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
    private final LocalDateTime endTime;
    private final List<Long> assistants;

    public Test createTest(Course course, Long createdBy) {
        Test test = new Test(type, startTime, endTime, course, createdBy);
        course.addTest(test);
        return test;
    }
}
