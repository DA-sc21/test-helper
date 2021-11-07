package kr.ac.ajou.da.testhelper.submission;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface SubmissionMapper {
	@Select("SELECT id, student_id, test_id, supervised_by, submitted "
			+ "FROM SUBMISSION "
			+ "WHERE test_id = ${testId}")
	List<HashMap<String, Object>> getTestSubmissionStatus(@Param("testId") int testId) throws SQLException;

	@Select("SELECT id, student_id, test_id, supervised_by, submitted "
			+ "FROM SUBMISSION "
			+ "WHERE test_id = ${testId} AND student_id = ${studentId}")
	List<HashMap<String, Object>> getStudentSubmissionStatus(@Param("testId") int testId, @Param("studentId") int studentId) throws SQLException;
}