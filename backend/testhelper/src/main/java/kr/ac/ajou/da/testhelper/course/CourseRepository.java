package kr.ac.ajou.da.testhelper.course;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllByProfessorId(Long professorId);

	Optional<Course> getByCode(String code);
}
