package kr.ac.ajou.da.testhelper.course;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.AccountService;
import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.course.assistant.CourseAssistantService;
import kr.ac.ajou.da.testhelper.course.exception.CourseNotFoundException;
import kr.ac.ajou.da.testhelper.portal.PortalService;
import kr.ac.ajou.da.testhelper.student.StudentService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class CourseServiceTest {

    @InjectMocks
    private CourseService courseService;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private AccountService accountService;
    
    @Mock
    private PortalService portalService;
    
    @Mock
    private CourseAssistantService courseAssistantService;
    
    @Mock
    private CourseMapper courseMapper;
    
    @Mock
    private StudentService studentService;

    @BeforeEach
    void init() {
        courseRepository = mock(CourseRepository.class);
        accountService = mock(AccountService.class);
        portalService = mock(PortalService.class);
        courseAssistantService = mock(CourseAssistantService.class);
        courseMapper = mock(CourseMapper.class);
        studentService = mock(StudentService.class);
        courseService = new CourseService(courseRepository, accountService, portalService, courseAssistantService, courseMapper, studentService);
    }

    @Test
    void getByProfessorId_success() {
        //given
        Long professorId = 1L;
        List<Course> expectedCourses = new ArrayList<>();
        expectedCourses.add(DummyFactory.createCourse());

        when(courseRepository.findAllByProfessorId(anyLong())).thenReturn(expectedCourses);

        //when
        List<Course> actualCourses = courseService.getByProfessorId(professorId);

        //then
        verify(courseRepository, times(1)).findAllByProfessorId(anyLong());
        assertEquals(expectedCourses, actualCourses);
    }

    @Test
    void updateCourseAssistants_success() {
        //given
        Course course = DummyFactory.createCourse();
        List<Account> assistants = new ArrayList<>();
        assistants.add(DummyFactory.createAssistant());

        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(course));
        when(accountService.getByIds(anyList())).thenReturn(assistants);

        //when
        courseService.updateCourseAssistants(course.getId(),
                assistants.stream().mapToLong(Account::getId).boxed().collect(Collectors.toList()));

        //then
        verify(courseRepository, times(1)).findById(anyLong());
        verify(accountService, times(1)).getByIds(anyList());

        assertEquals(assistants.size(), course.getAssistants().size());
        assertTrue(course.getAssistants().contains(assistants.get(0)));
    }

    @Test
    void updateCourseAssistants_courseNotFound_thenThrow_CourseNotFoundException() {
        //given
        Long courseId = 1L;
        List<Long> assistantIds = new ArrayList<>();
        when(courseRepository.findById(anyLong())).thenReturn(Optional.empty());

        //when
        assertThrows(CourseNotFoundException.class, ()->{
            courseService.updateCourseAssistants(courseId, assistantIds);
        });

        //then
    }

    @Test
    void updateCourseAssistants_overlappingCourseAssistants_then_removeOverlapped() {
        //given
        Course course = DummyFactory.createCourse();
        List<Account> assistants = new ArrayList<>();
        Account overlappingAssistant = DummyFactory.createAssistant();
        assistants.add(overlappingAssistant);
        assistants.add(overlappingAssistant);

        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(course));
        when(accountService.getByIds(anyList())).thenReturn(assistants);

        //when
        courseService.updateCourseAssistants(course.getId(),
                assistants.stream().mapToLong(Account::getId).boxed().collect(Collectors.toList()));

        //then
        verify(courseRepository, times(1)).findById(anyLong());
        verify(accountService, times(1)).getByIds(anyList());

        assertEquals(1, course.getAssistants().size());
        assertTrue(course.getAssistants().contains(overlappingAssistant));
    }

    @Test
    void updateCourseAssistants_professorGiven_then_removeProfessor() {
        //given
        Course course = DummyFactory.createCourse();
        List<Account> assistants = new ArrayList<>();
        Account assistant = DummyFactory.createAssistant();
        assistants.add(DummyFactory.createProfessor());
        assistants.add(assistant);

        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(course));
        when(accountService.getByIds(anyList())).thenReturn(assistants);

        //when
        courseService.updateCourseAssistants(course.getId(),
                assistants.stream().mapToLong(Account::getId).boxed().collect(Collectors.toList()));

        //then
        verify(courseRepository, times(1)).findById(anyLong());
        verify(accountService, times(1)).getByIds(anyList());

        assertEquals(1, course.getAssistants().size());
        assertTrue(course.getAssistants().contains(assistant));
    }
    
    @Test
    void getCourseByCode_success() {
    	//given
    	String code = "F000";
    	Course expectedCourse = DummyFactory.createCourse();
    	
    	when(courseRepository.getByCode(anyString())).thenReturn(Optional.of(expectedCourse));

        //when
    	Course actualCourse = courseService.getCourseByCode(code);

        //then
    	verify(courseRepository, times(1)).getByCode(anyString());
    	assertEquals(expectedCourse, actualCourse);
    }
    
    @Test
    void deleteCourse_success() {
    	//given
    	Course course = DummyFactory.createCourse();

    	when(courseRepository.findById(anyLong())).thenReturn(null);

        //when
    	courseService.deleteCourse(course);
    	
        //then
        verify(courseRepository, times(1)).delete(course);
        assertThat(courseRepository.findById(course.getId())).isNull();
    }
    

}