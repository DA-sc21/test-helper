package kr.ac.ajou.da.testhelper.problem;

import kr.ac.ajou.da.testhelper.problem.dto.TestProblemReqDto;
import kr.ac.ajou.da.testhelper.test.Test;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter(AccessLevel.PRIVATE)
@Table(name = "PROBLEM")
@NoArgsConstructor
@Entity
public class Problem {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(nullable = false)
	private Long problemNum;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false)
    private Test test;
	
	@Column(nullable = false)
    private String question;
	
	@Column(nullable = false)
	private Long point;
	
    private String attachedFile;
	
	public Problem(Long id, Long problemNum, Test test, String question, Long point, String attachedFile) {
        this.id = id;
        this.problemNum = problemNum;
        this.test = test;
        this.question = question;
        this.point = point;
        this.attachedFile = attachedFile;
    }
	
	public Problem(Long problemNum, Test test, String question, Long point, String attachedFile) {
        this.problemNum = problemNum;
        this.test = test;
        this.question = question;
        this.point = point;
        this.attachedFile = attachedFile;
    }

	public void updateTestProblem(TestProblemReqDto reqDto) {
		this.setQuestion(reqDto.getQuestion());
		this.setPoint(reqDto.getPoint());
		this.setAttachedFile(reqDto.getAttachedFile());
	}
	
}
