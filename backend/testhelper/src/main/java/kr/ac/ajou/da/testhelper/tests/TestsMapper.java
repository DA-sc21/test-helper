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
	@Select("SELECT * FROM COURSE JOIN TEST ON COURSE.id = TEST.course_id WHERE COURSE.professor_id = ${accountId} AND TEST.test_status = ${testStatus}")
	List<HashMap<String, Object>> getTestList(@Param("accountId") int accountId,@Param("accountRole") String accountRole,@Param("testStatus") String testStatus) throws SQLException;
}
