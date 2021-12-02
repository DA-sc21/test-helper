package kr.ac.ajou.da.testhelper.test.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import kr.ac.ajou.da.testhelper.account.dto.AssistantDto;
import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class GetDetailedTestResDto {

    private final Long id;

    private final TestType type;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private final LocalDateTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private final LocalDateTime endTime;

    private final List<AssistantDto> assistants;

    public GetDetailedTestResDto(Test test) {
        this.id = test.getId();
        this.type = test.getTestType();
        this.startTime = test.getStartTime();
        this.endTime = test.getEndTime();
        this.assistants = test.getAssistants().stream().map(AssistantDto::new).collect(Collectors.toList());
    }
}
