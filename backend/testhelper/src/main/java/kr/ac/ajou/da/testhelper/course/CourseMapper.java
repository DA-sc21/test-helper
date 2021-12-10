package kr.ac.ajou.da.testhelper.course;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface CourseMapper {
	@Insert("INSERT INTO COURSE (code, name, professor_id) VALUES ('${code}', '${name}', ${professorId})")
	void createCourse(@Param("code") String code, @Param("name") String name, @Param("professorId") Long professorId);

}
