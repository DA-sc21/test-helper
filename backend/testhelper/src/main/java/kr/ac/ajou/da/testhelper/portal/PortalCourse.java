package kr.ac.ajou.da.testhelper.portal;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import kr.ac.ajou.da.testhelper.definition.PortalStatus;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter(value = AccessLevel.PRIVATE)
@Table(name = "PORTAL_COURSE")
@NoArgsConstructor
@Entity
public class PortalCourse {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(nullable = false)
	private String code;
	
	@Column(nullable = false)
	private String name;
	
	@ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private PortalAccount professor;

	@OneToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "PORTAL_ASSISTANT",
		    joinColumns = @JoinColumn(name="courseId"),
		    inverseJoinColumns = @JoinColumn(name="id"))
	private List<PortalAssistant> assistants = new ArrayList<>();
	
	@Enumerated(EnumType.STRING)
	private PortalStatus registered;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "PORTAL_STUDENT",
		    joinColumns = @JoinColumn(name="courseId"),
		    inverseJoinColumns = @JoinColumn(name="id"))
    private List<PortalStudent> students = new ArrayList<>();
	
	public PortalCourse(Long id, String code, String name, 
			PortalAccount professor, List<PortalAssistant> assistants, 
			PortalStatus registered, List<PortalStudent> students) {
		this.id = id;
		this.code = code;
		this.name = name;
		this.professor = professor;
		this.assistants = assistants;
		this.registered = registered;
		this.students = students;
	}

	public void updateRegistered(PortalStatus status) {
		this.setRegistered(status);
	}
}
