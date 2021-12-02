package kr.ac.ajou.da.testhelper.course.dto;

import kr.ac.ajou.da.testhelper.account.dto.AssistantDto;
import kr.ac.ajou.da.testhelper.course.Course;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@RequiredArgsConstructor
public class GetDetailedCourseResDto {
    private final Long id;
    private final String name;
    private final List<AssistantDto> assistants;

    public GetDetailedCourseResDto(Course course) {
        this.id = course.getId();
        this.name = course.getName();
        this.assistants = course.getAssistants().stream().map(AssistantDto::new).collect(Collectors.toList());
    }
}
