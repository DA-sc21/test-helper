package kr.ac.ajou.da.testhelper.course;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllByProfessorId(Long professorId);

	Course getByCode(String code);
}
