package kr.ac.ajou.da.testhelper.submission.dto;

import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionStatus;
import lombok.Getter;

@Getter
public class GetSubmissionResDto {
    private final Long id;
    private final Long student_id;
    private final Long test_id;
    private final Long supervised_by;
    private final SubmissionStatus submitted;

    public GetSubmissionResDto(Submission submission) {
        this.id = submission.getId();
        this.test_id = submission.getTest().getId();
        this.student_id = submission.getStudent().getId();
        this.supervised_by = submission.getSupervisedBy();
        this.submitted = submission.getSubmitted();
    }
}
