package kr.ac.ajou.da.testhelper.course;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class CourseServiceTest {

    @InjectMocks
    private CourseService courseService;

    @Mock
    private CourseRepository courseRepository;

    @BeforeEach
    void init() {
        courseRepository = mock(CourseRepository.class);
        courseService = new CourseService(courseRepository);
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
}