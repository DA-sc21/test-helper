package kr.ac.ajou.da.testhelper.submission.answer;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SubmissionAnswerRepository extends JpaRepository<SubmissionAnswer, Long> {
    @Query("SELECT sa FROM SubmissionAnswer sa INNER JOIN sa.submission s INNER JOIN sa.problem p " +
            "WHERE s.id = :submissionId AND p.problemNum = :problemNum")
    Optional<SubmissionAnswer> findBySubmissionIdAndProblemNum(@Param("submissionId") Long submissionId, @Param("problemNum") Long problemNum);
}
