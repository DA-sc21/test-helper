package kr.ac.ajou.da.testhelper.test.verification;

import java.sql.SQLException;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface TestStudentVerificationMapper {
	@Update("UPDATE SUBMISSION "
			+ "SET verified = \"${result}\" "
			+ "WHERE test_id = ${testId} AND student_id = ${studentId}")
	void insertToSubmission(@Param("testId") int testId, @Param("studentId") int studentId, @Param("result") String result) throws SQLException;
}
