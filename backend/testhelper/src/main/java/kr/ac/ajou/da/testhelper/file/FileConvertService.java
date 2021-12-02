package kr.ac.ajou.da.testhelper.file;

import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;

public interface FileConvertService {
    void convertToMp4(Submission submission, SubmissionType submissionType);
}
