package kr.ac.ajou.da.testhelper.tests;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

@Mapper
@Repository
public interface TestsMapper {
	@Select("SELECT COURSE.name, TEST.id, TEST.test_type, TEST.start_time, TEST.end_time, TEST.test_status \n"
			+ "FROM TEST \n"
			+ "JOIN COURSE \n"
			+ "ON TEST.course_id = COURSE.id \n"
			+ "WHERE COURSE.professor_id = ${accountId}")
	List<HashMap<String, Object>> getTestListOfProfessor(@Param("accountId") Long accountId) throws SQLException;

	@Select("SELECT COURSE.name, TEST.id, TEST.test_type, TEST.start_time, TEST.end_time, TEST.test_status \n"
			+ "FROM TEST_ASSISTANT \n"
			+ "JOIN TEST \n"
			+ "ON TEST.id = TEST_ASSISTANT.test_id \n"
			+ "JOIN COURSE \n"
			+ "ON COURSE.id = TEST.course_id \n"
			+ "WHERE TEST_ASSISTANT.account_id = ${accountId}")
	List<HashMap<String, Object>> getTestListOfAssistant(@Param("accountId") Long accountId) throws SQLException;
}
