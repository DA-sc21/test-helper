package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.file.FileConvertService;
import kr.ac.ajou.da.testhelper.file.FileService;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionStatus;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;
import kr.ac.ajou.da.testhelper.submission.dto.GetDetailedSubmissionResDto;
import kr.ac.ajou.da.testhelper.submission.dto.GetSubmissionResDto;
import kr.ac.ajou.da.testhelper.submission.exception.CannotSubmitWhenTestNotInProgressException;
import kr.ac.ajou.da.testhelper.submission.exception.CannotViewNotSubmittedSubmissionException;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import kr.ac.ajou.da.testhelper.submission.exception.UploadedFileNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
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

    @Transactional
    public List<GetSubmissionResDto> getByTestIdAndStudentNumber(Long testId, String studentNumber) {
        return submissionRepository.findAllByTestIdAndStartWithStudentNumber(testId, studentNumber);
    }

    @Transactional
    public String getUploadUrlByTestIdAndStudentIdAndSubmissionType(Long testId, Long studentId, SubmissionType submissionType) {

        Submission submission = this.getByTestIdAndStudentId(testId, studentId);

        if (!submission.getTest().isInProgress()) {
            throw new CannotSubmitWhenTestNotInProgressException();
        }

        return fileService.getUploadUrl(submissionType.resolveSubmissionPath(submission));
    }

    @Transactional
    public GetDetailedSubmissionResDto getDetailedByTestIdAndStudentId(Long testId, Long studentId) {

        Submission submission = this.getByTestIdAndStudentId(testId, studentId);

        if (!submission.isSubmitted()) {
            throw new CannotViewNotSubmittedSubmissionException();
        }

        return new GetDetailedSubmissionResDto(submission,
                fileService.getDownloadUrl(SubmissionType.CAPTURE.resolveSubmissionPath(submission)),
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
    public boolean updateSubmittedByTestIdAndStudentId(Long testId, Long studentId, SubmissionStatus submitted) {
        Submission submission = getByTestIdAndStudentId(testId, studentId);

        if (!submission.getTest().isInProgress()) {
            throw new CannotSubmitWhenTestNotInProgressException();
        }

        submission.updateSubmitted(submitted);

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
}
