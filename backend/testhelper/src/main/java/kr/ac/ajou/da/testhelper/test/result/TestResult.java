package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.submission.Submission;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
public class TestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer minScore;
    private Integer maxScore;
    private Double average;

    public void update(List<Submission> submissions) {
        this.minScore = submissions.stream().mapToInt(Submission::getScore).min().orElse(0);
        this.maxScore = submissions.stream().mapToInt(Submission::getScore).max().orElse(0);
        this.average = submissions.stream().mapToInt(Submission::getScore).average().orElse(0);
    }
}
