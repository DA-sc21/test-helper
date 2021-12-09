package kr.ac.ajou.da.testhelper.course;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.AccountService;
import kr.ac.ajou.da.testhelper.aws.s3.PreSignedURLService;
import kr.ac.ajou.da.testhelper.course.assistant.CourseAssistant;
import kr.ac.ajou.da.testhelper.course.assistant.CourseAssistantService;
import kr.ac.ajou.da.testhelper.course.exception.CourseNotFoundException;
import kr.ac.ajou.da.testhelper.definition.PortalStatus;
import kr.ac.ajou.da.testhelper.portal.PortalAssistant;
import kr.ac.ajou.da.testhelper.portal.PortalCourse;
import kr.ac.ajou.da.testhelper.portal.PortalService;
import kr.ac.ajou.da.testhelper.portal.PortalStudent;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.student.StudentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {

    private final CourseRepository courseRepository;
    private final AccountService accountService;
    private final PortalService portalService;
    private final CourseAssistantService courseAssistantService;
    private final CourseMapper courseMapper;
    private final StudentService studentService;

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
    
    @Transactional
    public PortalCourse getPortalCourseById(Long id) {
    	return portalService.getCourseById(id);
	}
    
    @Transactional
    public Account getAccountByEmail(String email) {
		return accountService.getByEmail(email);
	}
    
    @Transactional
    public Course getCourseByCode(String code) {
    	return courseRepository.getByCode(code);
	}
    
    @Transactional
    public void updatePortalRegistered(PortalCourse portal) {
    	portalService.updatePortalRegistered(portal);
	}

    @Transactional
    public void createCourse(Long id) {
    	PortalCourse portal = getPortalCourseById(id);
    	Account professor = getAccountByEmail(portal.getProfessor().getEmail());
    	
    	courseMapper.createCourse(portal.getCode(), portal.getName(), professor.getId());
    	Course course = getCourseByCode(portal.getCode());

    	for(PortalAssistant portalAssistant : portal.getAssistants()) {
    		Account assistant = getAccountByEmail(portalAssistant.getAssistant().getEmail());
    		courseAssistantService.createCourseAssistant(assistant.getId(), course.getId());
    	}
    	
    	for(PortalStudent portalStudent : portal.getStudents()) {
    		studentService.createStudent(portalStudent.getName(), portalStudent.getStudentNum(), portalStudent.getEmail(), course.getId());
    	}
    	
    	updatePortalRegistered(portal);
	}
	
}
