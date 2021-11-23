package kr.ac.ajou.da.testhelper.course;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.AccountService;
import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.course.exception.CourseNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @BeforeEach
    void init() {
        courseRepository = mock(CourseRepository.class);
        accountService = mock(AccountService.class);
        courseService = new CourseService(courseRepository, accountService);
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
}