package kr.ac.ajou.da.testhelper.portal.dto;

import java.util.List;

import kr.ac.ajou.da.testhelper.portal.PortalStudent;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter(value = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class GetPortalCourseReqDto {
	private Long id;
	private String courseCode;
	private String courseName;
	private String professor;
	private String assistant;
	private List<PortalStudent> students;
}
