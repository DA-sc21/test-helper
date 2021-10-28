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
			+ "WHERE test_id = ${testId} AND student_id = (SELECT id FROM STUDENT WHERE student_num = ${studentId})")
	void insertToSubmission(@Param("testId") String testId, @Param("studentId") String studentId, @Param("result") String result) throws SQLException;
}
