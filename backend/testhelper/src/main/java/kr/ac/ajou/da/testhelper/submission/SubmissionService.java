package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.file.FileService;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
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

        if (!submissionRepository.existsByTestIdAndStudentId(testId, studentId)) {
            throw new SubmissionNotFoundException();
        }

        String submissionPath = submissionType.resolveSubmissionPath(testId, studentId);

        return fileService.getUploadUrl(submissionPath);
    }


    @Transactional
    public boolean updateConsentedByTestIdAndStudentId(Long testId, Long studentId, Boolean consented){
        Submission submission = getByTestIdAndStudentId(testId, studentId);

        submission.updateConsented(consented);

        return true;
    }
}
