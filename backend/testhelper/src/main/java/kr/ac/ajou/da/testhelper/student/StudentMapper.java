package kr.ac.ajou.da.testhelper.student;

import java.sql.SQLException;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface StudentMapper {
	@Select("SELECT student_num FROM STUDENT WHERE id = ${studentId}")
	String getStudentNum(@Param("studentId") int studentId) throws SQLException;
}
