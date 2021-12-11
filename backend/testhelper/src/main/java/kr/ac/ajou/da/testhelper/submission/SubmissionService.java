package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.file.FileConvertService;
import kr.ac.ajou.da.testhelper.file.FileService;
import kr.ac.ajou.da.testhelper.submission.answer.SubmissionAnswerService;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionStatus;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;
import kr.ac.ajou.da.testhelper.submission.dto.GetDetailedSubmissionResDto;
import kr.ac.ajou.da.testhelper.submission.exception.CannotSubmitWhenTestNotInProgressException;
import kr.ac.ajou.da.testhelper.submission.exception.CannotViewNotSubmittedSubmissionException;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import kr.ac.ajou.da.testhelper.submission.exception.UploadedFileNotFoundException;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final FileService fileService;
    private final FileConvertService fileConvertService;
    private final SubmissionAnswerService submissionAnswerService;

    @Transactional
    public Submission getByTestIdAndStudentId(Long testId, Long studentId) {

        return submissionRepository.findByTestIdAndStudentId(testId, studentId)
                .orElseThrow(SubmissionNotFoundException::new);

    }

    @Transactional
    public List<Submission> getByTestIdAndSupervisedBy(Long testId, Long supervisedBy) {
        return submissionRepository.findByTestIdAndSupervisedBy(testId, supervisedBy);
    }

    @Transactional
    public List<Submission> getByTestIdAndStudentNumber(Long testId, String studentNumber) {
        return submissionRepository.findAllByTestIdAndStartWithStudentNumber(testId, studentNumber);
    }

    @Transactional
    public String getUploadUrlByTestIdAndStudentIdAndSubmissionType(Long testId, Long studentId, SubmissionType submissionType) {

        Submission submission = this.getByTestIdAndStudentId(testId, studentId);

        if (!submission.getTest().isInProgress()) {
            throw new CannotSubmitWhenTestNotInProgressException();
        }

        return fileService.getUploadUrl(submissionType.resolveSubmissionPath(submission, false));
    }

    @Transactional
    public GetDetailedSubmissionResDto getDetailedByTestIdAndStudentId(Long testId, Long studentId, Boolean includeCapture) {

        Submission submission = this.getByTestIdAndStudentId(testId, studentId);

        if (!submission.isSubmitted()) {
            throw new CannotViewNotSubmittedSubmissionException();
        }

        return new GetDetailedSubmissionResDto(submission,
                includeCapture ? fileService.getDownloadUrl(SubmissionType.CAPTURE.resolveSubmissionPath(submission)) : null,
                fileService.getDownloadUrl(SubmissionType.ANSWER.resolveSubmissionPath(submission)));
    }


    @Transactional
    public boolean updateConsentedByTestIdAndStudentId(Long testId, Long studentId, Boolean consented) {

        Submission submission = getByTestIdAndStudentId(testId, studentId);

        if (!submission.getTest().isInProgress()) {
            throw new CannotSubmitWhenTestNotInProgressException();
        }

        submission.updateConsented(consented);

        return true;
    }

    @Transactional
    public void uploadSubmission(Long testId, Long studentId, SubmissionType submissionType) {

        Submission submission = this.getByTestIdAndStudentId(testId, studentId);

        convertFileIfVideo(submission, submissionType);


    }

    private void convertFileIfVideo(Submission submission, SubmissionType submissionType) {
        if (!submissionType.isVideo()) return;

        if (!fileService.exist(submissionType.resolveSubmissionPath(submission, false))) {
            throw new UploadedFileNotFoundException();
        }

        fileConvertService.convertToMp4(submission, submissionType);
    }

    @Transactional
    public Submission getById(Long submissionId) {
        return submissionRepository.findById(submissionId)
                .orElseThrow(SubmissionNotFoundException::new);
    }

    @Transactional
    public void updateStatusByTestIdAndStudentId(Long testId, Long studentId, SubmissionStatus status) {
        Submission submission = getByTestIdAndStudentId(testId, studentId);

        if(SubmissionStatus.MARKED.equals(status)){
            int score = submissionAnswerService.getTotalScoreBySubmission(submission);
            submission.updateScore(score);
        }

        submission.updateStatus(status);
    }

	@Transactional
    public String getDownloadUrlByTestIdAndStudentIdAndSubmissionType(Long testId, Long studentId, SubmissionType submissionType) {

        Submission submission = this.getByTestIdAndStudentId(testId, studentId);
        
        if (submission.getTest().getStatus() == TestStatus.CREATE || 
        		submission.getTest().getStatus() == TestStatus.INVITED ||
        		submission.getTest().getStatus() == TestStatus.IN_PROGRESS) {
        	throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "시험 종료 후 확인 가능 합니다.");
        }

        return fileService.getDownloadUrl(submissionType.resolveSubmissionPath(submission));
    }
}
