package kr.ac.ajou.da.testhelper.answer;

import java.sql.SQLException;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.ac.ajou.da.testhelper.answer.dto.ProblemWithAnswer;

@Mapper
public interface AnswerMapper {
	@Select("SELECT a.test_id AS testId, a.problem_num AS problemNum, b.problem_id AS problemId, b.file "
			+ "FROM PROBLEM AS a "
			+ "INNER JOIN ANSWER AS b "
			+ "ON a.id = b.problem_id "
			+ "WHERE a.test_id = ${testId} AND a.problem_num = ${problemNum}")
	List<ProblemWithAnswer> getAnswerByTestIdAndProblemNum(@Param("testId") Long testId, @Param("problemNum") Long problemNum) throws SQLException;
}
