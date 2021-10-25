package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;

    @Transactional
    public Submission getByTestIDAndStudentID(Long testID, Long studentID) {

        return submissionRepository.findByTestIdAndStudentId(testID, studentID)
                .orElseThrow(SubmissionNotFoundException::new);

    }

    @Transactional
    public List<Submission> getByTestIDAndSupervisedBy(Long testId, Long supervisedBy) {
        return submissionRepository.findByTestIdAndSupervisedBy(testId, supervisedBy);
    }
}
