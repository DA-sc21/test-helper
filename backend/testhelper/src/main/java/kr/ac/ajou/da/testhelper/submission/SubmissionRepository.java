package kr.ac.ajou.da.testhelper.submission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    Optional<Submission> findByTestIdAndStudentId(Long testId, Long studentId);
}
