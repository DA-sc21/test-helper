package kr.ac.ajou.da.testhelper.problem;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface ProblemMapper {
	@Update("UPDATE PROBLEM SET problem_num = problem_num - 1 WHERE test_id = ${testId} AND problem_num > ${problemNum}")
	void updateProblemNum(@Param("testId") Long testId, @Param("problemNum") Long problemNum);
}
