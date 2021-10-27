package kr.ac.ajou.da.testhelper.test.room.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import kr.ac.ajou.da.testhelper.test.Test;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Getter
public class TestDto {
    private final Long id;
    private final String name;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private final LocalDateTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private final LocalDateTime endTime;

    public TestDto(Test test) {
        this.id = test.getId();
        this.name = test.resolveName();
        this.startTime = test.getStartTime();
        this.endTime = test.getEndTime();
    }
}
