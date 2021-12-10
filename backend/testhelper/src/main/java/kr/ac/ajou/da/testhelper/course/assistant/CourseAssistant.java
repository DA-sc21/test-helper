package kr.ac.ajou.da.testhelper.course.assistant;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Table(name = "COURSE_ASSISTANT")
@Getter
@Setter(value = AccessLevel.PRIVATE)
public class CourseAssistant {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
//	@Column(nullable = false)
//	private Long accountId;
	
//	@Column(nullable = false)
//	private Long courseId;
	
	public CourseAssistant(Long accountId, Long courseId) {
//		this.accountId = accountId;
//		this.courseId = courseId;
	}
}
