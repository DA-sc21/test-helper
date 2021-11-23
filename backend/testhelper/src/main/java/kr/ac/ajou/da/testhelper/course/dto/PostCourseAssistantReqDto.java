package kr.ac.ajou.da.testhelper.course.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PostCourseAssistantReqDto {
    private final Long[] assistants;
}
