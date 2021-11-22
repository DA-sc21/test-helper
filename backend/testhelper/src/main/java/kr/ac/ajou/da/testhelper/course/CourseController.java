package kr.ac.ajou.da.testhelper.course;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.common.security.authority.IsProfessor;
import kr.ac.ajou.da.testhelper.course.dto.GetCourseResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CourseController {

    @GetMapping("/courses")
    @IsProfessor
    public ResponseEntity<Object> getCourses(@AuthenticationPrincipal @ApiIgnore Account account){

        List<GetCourseResDto> courses = new ArrayList<>();
        courses.add(new GetCourseResDto(1L, "name"));

        return ResponseEntity.ok().body(courses);
    }
}