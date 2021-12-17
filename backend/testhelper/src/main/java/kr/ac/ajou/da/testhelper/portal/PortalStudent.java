package kr.ac.ajou.da.testhelper.portal;

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

@Getter
@Setter(AccessLevel.PRIVATE)
@Table(name = "PORTAL_STUDENT")
@NoArgsConstructor
@Entity
public class PortalStudent {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(nullable = false)
	private Long courseId;
	
	@Column(nullable = false)
	private String name;
	
	@Column(nullable = false)
	private String studentNum;
	
	@Column(nullable = false)
	private String email;
	
	public PortalStudent(Long id, Long courseId, String name, String studentNum, String email) {
		this.id = id;
		this.courseId = courseId;
		this.name = name;
		this.studentNum = studentNum;
		this.email = email;
	}
}
