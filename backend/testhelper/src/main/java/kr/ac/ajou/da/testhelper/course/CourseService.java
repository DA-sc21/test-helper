package kr.ac.ajou.da.testhelper.course;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.AccountService;
import kr.ac.ajou.da.testhelper.course.exception.CourseNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final AccountService accountService;

    @Transactional
    public Course get(Long id){
        return courseRepository.findById(id)
                .orElseThrow(CourseNotFoundException::new);
    }

    @Transactional
    public List<Course> getByProfessorId(Long professorId) {
        return courseRepository.findAllByProfessorId(professorId);
    }

    @Transactional
    public void updateCourseAssistants(Long courseId, List<Long> assistantIds) {
        Course course = this.get(courseId);
        List<Account> assistants = accountService.getByIds(assistantIds);

        course.updateAssistants(assistants);
    }

    public Set<Account> getCourseAssistantsById(Long courseId) {
        Course course = this.get(courseId);

        return course.getAssistants();
    }
}
