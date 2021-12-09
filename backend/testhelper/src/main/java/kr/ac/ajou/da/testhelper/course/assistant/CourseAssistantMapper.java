package kr.ac.ajou.da.testhelper.course.assistant;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface CourseAssistantMapper {
	@Insert("INSERT INTO COURSE_ASSISTANT (account_id, course_id) VALUES (${accountId}, ${courseId})")
	void createCourseAssistant(@Param("accountId") Long accountId, @Param("courseId") Long courseId);

	@Delete("DELETE FROM COURSE_ASSISTANT WHERE course_id = ${courseId}")
	void deleteByCourseId(@Param("courseId") Long courseId);
}
