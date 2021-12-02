package kr.ac.ajou.da.testhelper.test.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class GetTestsResDto {
    private final Long id;
    private final String name;
    private final TestType test_type;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private final LocalDateTime start_time;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private final LocalDateTime end_time;
    private final TestStatus test_status;

    public GetTestsResDto(Test test) {
        this.id = test.getId();
        this.name = test.resolveName();
        this.test_type = test.getTestType();
        this.start_time = test.getStartTime();
        this.end_time = test.getEndTime();
        this.test_status = test.getStatus();
    }
}
