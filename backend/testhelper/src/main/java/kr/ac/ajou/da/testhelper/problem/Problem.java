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
	
	private Long problemNum;

    private Long testId;
	
	@Column(nullable = false)
    private String question;
	
	private Long point;
	
	@Column(nullable = false)
    private String attachedFile;
	
	public Problem(Long id, Long problemNum, Long testId, String question, Long point, String attachedFile) {
        this.id = id;
        this.problemNum = problemNum;
        this.testId = testId;
        this.question = question;
        this.point = point;
        this.attachedFile = attachedFile;
    }
	
}
