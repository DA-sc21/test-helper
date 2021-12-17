package kr.ac.ajou.da.testhelper.test.dto;

import kr.ac.ajou.da.testhelper.test.definition.TestType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Getter
@RequiredArgsConstructor
public class PostAndPatchTestReqDto {

    private final String type;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
    private final LocalDateTime startTime;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
    private final LocalDateTime endTime;

    private final List<Long> assistants;

    public CreateTestReqDto toCreateDto() {
        return new CreateTestReqDto(TestType.valueOf(type),
                startTime,
                endTime,
                Objects.isNull(assistants) ? List.of() : assistants);
    }
}
