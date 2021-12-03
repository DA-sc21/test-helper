package kr.ac.ajou.da.testhelper.answer;

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
@Table(name = "ANSWER")
@Getter
@Setter(value = AccessLevel.PRIVATE)
public class Answer {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long testId;
    
    private String file;
    
    public Answer(Long id, Long testId, String file) {
    	this.id = id;
    	this.testId = testId;
    	this.file = file;
    }
    
    public Answer(Long testId, String file) {
    	this.testId = testId;
    	this.file = file;
    }
}
