package kr.ac.ajou.da.testhelper.submission.dto;

import kr.ac.ajou.da.testhelper.submission.Submission;
import lombok.Getter;

@Getter
public class GetDetailedSubmissionResDto {
    private final Long id;
    private final Long studentId;
    private final Long testId;
    private final String captureSheetDownloadUrl;
    private final String answerSheetDownloadUrl;

    public GetDetailedSubmissionResDto(Submission submission, String captureSheetDownloadUrl, String answerSheetDownloadUrl) {
        this.id = submission.getId();
        this.studentId = submission.getStudent().getId();
        this.testId = submission.getTest().getId();
        this.captureSheetDownloadUrl = captureSheetDownloadUrl;
        this.answerSheetDownloadUrl = answerSheetDownloadUrl;
    }
}
