package kr.ac.ajou.da.testhelper.problem;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import kr.ac.ajou.da.testhelper.problem.dto.TestProblemReqDto;
import kr.ac.ajou.da.testhelper.test.Test;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

	@Column(nullable = false)
    private Long testId;
	
	@Column(nullable = false)
    private String question;
	
	@Column(nullable = false)
	private Long point;
	
    private String attachedFile;
	
	public Problem(Long id, Long problemNum, Long testId, String question, Long point, String attachedFile) {
        this.id = id;
        this.problemNum = problemNum;
        this.testId = testId;
        this.question = question;
        this.point = point;
        this.attachedFile = attachedFile;
    }
	
	public Problem(Long problemNum, Long testId, String question, Long point, String attachedFile) {
        this.problemNum = problemNum;
        this.testId = testId;
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
