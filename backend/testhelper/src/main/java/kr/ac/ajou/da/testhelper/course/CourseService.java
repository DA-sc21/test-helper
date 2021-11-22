package kr.ac.ajou.da.testhelper.course;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public List<Course> getByProfessorId(Long professorId) {
        return courseRepository.findAllByProfessorId(professorId);
    }
}
