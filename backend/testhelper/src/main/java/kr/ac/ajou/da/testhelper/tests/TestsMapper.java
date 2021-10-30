package kr.ac.ajou.da.testhelper.tests;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface TestsMapper {
	@Select("SELECT COURSE.name, TEST.id, TEST.test_type, TEST.start_time, TEST.end_time, TEST.test_status \n"
			+ "FROM TEST \n"
			+ "JOIN COURSE \n"
			+ "ON TEST.course_id = COURSE.id \n"
			+ "WHERE COURSE.professor_id = ${accountId} AND TEST.test_status = ${testStatus}")
	List<HashMap<String, Object>> getTestListOfProfessor(@Param("accountId") int accountId, @Param("testStatus") String testStatus) throws SQLException;

	@Select("SELECT COURSE.name, TEST.id, TEST.test_type, TEST.start_time, TEST.end_time, TEST.test_status \n"
			+ "FROM TEST_ASSISTANT \n"
			+ "JOIN TEST \n"
			+ "ON TEST.id = TEST_ASSISTANT.test_id \n"
			+ "JOIN COURSE \n"
			+ "ON COURSE.id = TEST.course_id \n"
			+ "WHERE TEST_ASSISTANT.account_id = ${accountId} AND TEST.test_status = ${testStatus}")
	List<HashMap<String, Object>> getTestListOfAssistant(@Param("accountId") int accountId, @Param("testStatus") String testStatus) throws SQLException;
}
