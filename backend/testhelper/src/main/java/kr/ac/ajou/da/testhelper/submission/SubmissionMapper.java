package kr.ac.ajou.da.testhelper.submission;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import kr.ac.ajou.da.testhelper.submission.dto.GetSubmissionStatusResDto;

@Mapper
@Repository
public interface SubmissionMapper {
	@Select("SELECT verified, consented FROM SUBMISSION WHERE test_id = ${testId} AND student_id = ${studentId}")
    Optional<GetSubmissionStatusResDto> findVerifiedAndConsented(@Param("testId") Long testId, @Param("studentId") Long studentId);
}
