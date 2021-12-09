package kr.ac.ajou.da.testhelper.student;

import java.sql.SQLException;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface StudentMapper {
	@Select("SELECT student_num FROM STUDENT WHERE id = ${studentId}")
	String getStudentNum(@Param("studentId") int studentId) throws SQLException;

	@Insert("INSERT INTO STUDENT (name, student_num, email, course_id) VALUES ('${name}', '${studentNum}', '${email}', ${courseId})")
	void createStudent(@Param("name") String name, @Param("studentNum") String studentNum, @Param("email") String email, @Param("courseId") Long courseId);

	@Delete("DELETE FROM STUDENT WHERE course_id = ${courseId}")
	void deleteStudentByCourseId(@Param("courseId") Long courseId);

}
