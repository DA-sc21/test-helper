package kr.ac.ajou.da.testhelper.submission.dto;

import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionStatus;
import kr.ac.ajou.da.testhelper.test.room.dto.StudentDto;
import lombok.Getter;

@Getter
public class GetSubmissionResDto {
    private final Long id;
    private final StudentDto student;
    private final Long supervised_by;
    private final SubmissionStatus submitted;

    public GetSubmissionResDto(Submission submission) {
        this.id = submission.getId();
        this.student = new StudentDto(submission.getStudent());
        this.supervised_by = submission.getSupervisedBy();
        this.submitted = submission.getStatus();
    }
}
