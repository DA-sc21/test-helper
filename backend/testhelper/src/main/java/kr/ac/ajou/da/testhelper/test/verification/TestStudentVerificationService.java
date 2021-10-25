package kr.ac.ajou.da.testhelper.test.verification;

import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.test.verification.dto.GetTestStudentVerificationResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestStudentVerificationService {

    private final SubmissionService submissionService;

    public List<GetTestStudentVerificationResDto> getList(Long testId, Long proctorId) {

        //TODO : refactor later -> 한방에 갈 수 있도록

        List<Submission> submissions = submissionService.getByTestIDAndSupervisedBy(testId, proctorId);

        return submissions.stream()
                .map(submission -> new GetTestStudentVerificationResDto(
                        submission.getTestId(),
                        submission.getStudentId(),
                        submission.getId(),
                        submission.getVerified()))
                .collect(Collectors.toList());

    }

    @Transactional
    public boolean update(Long testId, Long studentId, Boolean verified) {

        Submission submission = submissionService.getByTestIDAndStudentID(testId, studentId);
        submission.updateVerified(verified);

        return true;
    }
}
