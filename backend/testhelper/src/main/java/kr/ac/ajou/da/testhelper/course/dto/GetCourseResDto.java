package kr.ac.ajou.da.testhelper.course.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class GetCourseResDto {
    private final Long id;
    private final String name;
}
