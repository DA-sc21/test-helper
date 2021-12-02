package kr.ac.ajou.da.testhelper.submission.answer;

import kr.ac.ajou.da.testhelper.problem.Problem;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.answer.exception.ScoreOutOfRangeException;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Getter
@Setter(value = AccessLevel.PRIVATE)
public class SubmissionAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    public SubmissionAnswer(Submission submission, Problem problem) {
        this.submission = submission;
        this.problem = problem;
    }

    private Integer score;

    public void updateScore(Integer score){

        if(!isScoreInRange(score)){
            throw new ScoreOutOfRangeException();
        }

        setScore(score);
    }

    private boolean isScoreInRange(Integer score) {
        return 0 <= score && score <= problem.getPoint();
    }

}
