package kr.ac.ajou.da.testhelper.portal;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import kr.ac.ajou.da.testhelper.definition.PortalCourseStatus;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter(AccessLevel.PRIVATE)
@Table(name = "PORTAL_COURSE")
@NoArgsConstructor
@Entity
public class PortalCourse {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(nullable = false)
	private String courseCode;
	
	@Column(nullable = false)
	private String courseName;
	
	@Column(nullable = false)
	private String professor;
	
	private String assistant;
	
	@Enumerated(EnumType.STRING)
	private PortalCourseStatus registered;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "PORTAL_STUDENT",
		    joinColumns = @JoinColumn(name="courseId"),
		    inverseJoinColumns = @JoinColumn(name="id"))
    private List<PortalStudent> students = new ArrayList<>();
	
	public PortalCourse(Long id, String courseCode, String courseName, String professor, String assistant, PortalCourseStatus registered, List<PortalStudent> students) {
		this.id = id;
		this.courseCode = courseCode;
		this.courseName = courseName;
		this.professor = professor;
		this.assistant = assistant;
		this.registered = registered;
		this.students = students;
	}
}
