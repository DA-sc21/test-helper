package kr.ac.ajou.da.testhelper.course;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.IsProfessor;
import kr.ac.ajou.da.testhelper.course.dto.GetCourseResDto;
import kr.ac.ajou.da.testhelper.course.dto.PutCourseAssistantReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/courses")
    @IsProfessor
    public ResponseEntity<List<GetCourseResDto>> getCourses(@AuthenticationPrincipal @ApiIgnore Account account) {

        List<Course> courses = courseService.getByProfessorId(account.getId());

        return ResponseEntity.ok().body(courses.stream().map(GetCourseResDto::new).collect(Collectors.toList()));
    }

    @PutMapping("/courses/{courseId}/assistants")
    public ResponseEntity<BooleanResponse> putCourseAssistant(@PathVariable Long courseId,
                                                              PutCourseAssistantReqDto reqDto) {

        courseService.updateCourseAssistants(courseId, reqDto.getAssistants());

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }
}