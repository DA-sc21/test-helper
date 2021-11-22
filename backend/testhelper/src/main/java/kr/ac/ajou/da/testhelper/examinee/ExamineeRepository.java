package kr.ac.ajou.da.testhelper.examinee;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExamineeRepository extends JpaRepository<Examinee, Long> {
    Optional<Examinee> findByTestIdAndStudentId(Long testId, Long studentId);
}
