package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;

    public Submission getByTestIDAndStudentID(Long testID, Long studentID) {

        return submissionRepository.findByTestIdAndStudentId(testID, studentID)
                .orElseThrow(SubmissionNotFoundException::new);

    }
}
