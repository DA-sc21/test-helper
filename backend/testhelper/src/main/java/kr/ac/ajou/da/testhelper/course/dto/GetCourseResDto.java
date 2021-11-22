package kr.ac.ajou.da.testhelper.course.dto;

import kr.ac.ajou.da.testhelper.course.Course;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class GetCourseResDto {
    private final Long id;
    private final String name;

    public GetCourseResDto(Course course) {
        this.id = course.getId();
        this.name = course.getName();
    }
}
