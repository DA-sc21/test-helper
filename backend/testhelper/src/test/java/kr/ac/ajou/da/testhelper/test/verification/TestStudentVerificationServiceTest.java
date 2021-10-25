package kr.ac.ajou.da.testhelper.test.verification;

import kr.ac.ajou.da.testhelper.definition.VerificationStatus;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.test.verification.dto.GetTestStudentVerificationResDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.LinkedList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TestStudentVerificationServiceTest {

    private final Long testId = 1L;
    private final Long supervisedBy = 1L;
    private final Long studentId = 1L;
    private final List<Submission> submissions = new LinkedList<>();
    @InjectMocks
    private TestStudentVerificationService testStudentVerificationService;
    @Mock
    private SubmissionService submissionService;
    private Submission submission;

    @BeforeEach
    void init() {
        submissionService = mock(SubmissionService.class);
        testStudentVerificationService = new TestStudentVerificationService(submissionService);

        submissions.add(new Submission(1L, 1L, testId, VerificationStatus.PENDING, supervisedBy));
        submission = new Submission(1L, studentId, testId, VerificationStatus.PENDING, 1L);
    }

    @Test
    void getList_success() {
        //given
        when(submissionService.getByTestIDAndSupervisedBy(anyLong(), anyLong())).thenReturn(submissions);

        //when
        List<GetTestStudentVerificationResDto> res = testStudentVerificationService.getList(testId, supervisedBy);

        //then
        assertEquals(submissions.size(), res.size());

        //TODO : 이거 더 깔끔하게 작성하는 방법 찾아보기

        if (submissions.size() > 0) {
            assertEquals(submissions.get(0).getId(), res.get(0).getSubmissionId());
            assertEquals(submissions.get(0).getVerified(), res.get(0).getVerified());
        }

    }

    @Test
    void update_verifiedTrue_success() {
        //given
        when(submissionService.getByTestIDAndStudentID(anyLong(), anyLong())).thenReturn(submission);

        //when
        testStudentVerificationService.update(testId, studentId, true);

        //then
        assertEquals(VerificationStatus.SUCCESS, submission.getVerified());

    }

    @Test
    void update_verifiedFalse_success() {
        //given
        when(submissionService.getByTestIDAndStudentID(anyLong(), anyLong())).thenReturn(submission);

        //when
        testStudentVerificationService.update(testId, studentId, false);

        //then
        assertEquals(VerificationStatus.REJECTED, submission.getVerified());

    }
}