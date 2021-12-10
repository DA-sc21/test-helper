package kr.ac.ajou.da.testhelper.course;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.dto.AssistantDto;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessCourseByProfessor;
import kr.ac.ajou.da.testhelper.common.security.authority.IsProfessor;
import kr.ac.ajou.da.testhelper.course.dto.GetCourseResDto;
import kr.ac.ajou.da.testhelper.course.dto.GetDetailedCourseResDto;
import kr.ac.ajou.da.testhelper.course.dto.PutCourseAssistantReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;
import java.util.Set;
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

    @GetMapping("/courses/{courseId}")
    @AccessCourseByProfessor
    public ResponseEntity<GetDetailedCourseResDto> getCourse(@PathVariable Long courseId){

        Course course = courseService.get(courseId);

        return ResponseEntity.ok().body(new GetDetailedCourseResDto(course));
    }

    @PutMapping("/courses/{courseId}/assistants")
    @AccessCourseByProfessor
    public ResponseEntity<BooleanResponse> putCourseAssistant(@PathVariable Long courseId,
                                                              PutCourseAssistantReqDto reqDto) {

        courseService.updateCourseAssistants(courseId, reqDto.getAssistants());

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }

    @GetMapping("/courses/{courseId}/assistants")
    @AccessCourseByProfessor
    public ResponseEntity<List<AssistantDto>> getCourseAssistant(@PathVariable Long courseId) {

        Set<Account> assistants = courseService.getCourseAssistantsById(courseId);

        return ResponseEntity.ok().body(assistants.stream().map(AssistantDto::new).collect(Collectors.toList()));
    }
    
    @PostMapping("/admin/classes/{courseId}")
    public ResponseEntity<BooleanResponse> postCourse(@PathVariable Long courseId) {
    	courseService.createCourse(courseId);
    	return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }
    
    @DeleteMapping("/admin/classes/{courseId}")
    public ResponseEntity<BooleanResponse> deleteCourse(@PathVariable Long courseId) {
    	courseService.deleteCourse(courseId);
    	return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }
}