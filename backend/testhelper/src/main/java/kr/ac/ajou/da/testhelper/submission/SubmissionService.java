package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.file.FileConvertService;
import kr.ac.ajou.da.testhelper.file.FileService;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import kr.ac.ajou.da.testhelper.submission.exception.UploadedFileNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionMapper submissionMapper;
    private final FileService fileService;
    private final FileConvertService fileConvertService;

    @Transactional
    public Submission getByTestIdAndStudentId(Long testId, Long studentId) {

        return submissionRepository.findByTestIdAndStudentId(testId, studentId)
                .orElseThrow(SubmissionNotFoundException::new);

    }

    @Transactional
    public List<Submission> getByTestIdAndSupervisedBy(Long testId, Long supervisedBy) {
        return submissionRepository.findByTestIdAndSupervisedBy(testId, supervisedBy);
    }

    public List<HashMap<String, Object>> getSubmissionStatus(int testId, int studentId) throws SQLException {
        if (studentId == 0) {
            return submissionMapper.getTestSubmissionStatus(testId);
        } else {
            return submissionMapper.getStudentSubmissionStatus(testId, studentId);
        }
    }

    @Transactional
    public String getUploadUrlByTestIdAndStudentIdAndSubmissionType(Long testId, Long studentId, SubmissionType submissionType) {

        Submission submission = this.getByTestIdAndStudentId(testId, studentId);

        return fileService.getUploadUrl(submissionType.resolveSubmissionPath(submission, false));
    }


    @Transactional
    public boolean updateConsentedByTestIdAndStudentId(Long testId, Long studentId, Boolean consented) {
        Submission submission = getByTestIdAndStudentId(testId, studentId);

        submission.updateConsented(consented);

        return true;
    }

    @Transactional
    public boolean updateSubmittedByTestIdAndStudentId(Long testId, Long studentId, String submitted) {
        Submission submission = getByTestIdAndStudentId(testId, studentId);

        submission.updateSubmitted(submitted);

        return true;
    }


    @Transactional
    public void uploadSubmission(Long testId, Long studentId, SubmissionType submissionType) {

        Submission submission = this.getByTestIdAndStudentId(testId, studentId);

        convertFileIfVideo(submission, submissionType);


    }

    private void convertFileIfVideo(Submission submission, SubmissionType submissionType) {
        if(!submissionType.isVideo()) return;

        if(!fileService.exist(submissionType.resolveSubmissionPath(submission, false))){
            throw new UploadedFileNotFoundException();
        }

        fileConvertService.convertToMp4(submission, submissionType);
    }
}
