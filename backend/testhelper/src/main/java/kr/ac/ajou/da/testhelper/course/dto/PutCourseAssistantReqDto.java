package kr.ac.ajou.da.testhelper.course.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class PutCourseAssistantReqDto {
    private final List<Long> assistants;
}
