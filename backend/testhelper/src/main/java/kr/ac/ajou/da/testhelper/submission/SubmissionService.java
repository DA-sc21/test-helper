package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.file.FileService;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;
import kr.ac.ajou.da.testhelper.submission.exception.CannotSubmitWhenTestNotInProgressException;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
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

        if(!submission.getTest().isInProgress()){
            throw new CannotSubmitWhenTestNotInProgressException();
        }

        return fileService.getUploadUrl(submissionType.resolveSubmissionPath(submission));
    }


    @Transactional
    public boolean updateConsentedByTestIdAndStudentId(Long testId, Long studentId, Boolean consented){

        Submission submission = getByTestIdAndStudentId(testId, studentId);

        if(!submission.getTest().isInProgress()){
            throw new CannotSubmitWhenTestNotInProgressException();
        }

        submission.updateConsented(consented);

        return true;
    }

    @Transactional
	public boolean updateSubmittedByTestIdAndStudentId(Long testId, Long studentId, String submitted) {
    	Submission submission = getByTestIdAndStudentId(testId, studentId);

        if(!submission.getTest().isInProgress()){
            throw new CannotSubmitWhenTestNotInProgressException();
        }

        submission.updateSubmitted(submitted);
    	
		return true;
	}
}
