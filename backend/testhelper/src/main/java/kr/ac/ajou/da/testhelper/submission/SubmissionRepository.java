package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.submission.dto.GetSubmissionResDto;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    Optional<Submission> findByTestIdAndStudentId(Long testId, Long studentId);

    List<Submission> findByTestIdAndSupervisedBy(Long testId, Long supervisedBy);

    @Query("SELECT new kr.ac.ajou.da.testhelper.submission.dto.GetSubmissionResDto(s) FROM Submission s " +
            "INNER JOIN s.test t INNER JOIN s.student st WHERE t.id = :testId AND st.studentNumber LIKE :studentNumber||'%' " +
            "ORDER BY st.studentNumber")
    List<GetSubmissionResDto> findAllByTestIdAndStartWithStudentNumber(@Param("testId") Long testId, @Param("studentNumber") String studentNumber);

}
