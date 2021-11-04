package kr.ac.ajou.da.testhelper.submission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    Optional<Submission> findByTestIdAndStudentId(Long testId, Long studentId);

    List<Submission> findByTestIdAndSupervisedBy(Long testId, Long supervisedBy);

    boolean existsByTestIdAndStudentId(Long testId, Long studentId);
}
