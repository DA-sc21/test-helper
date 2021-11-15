package kr.ac.ajou.da.testhelper.test.verification;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.definition.VerificationStatus;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.test.verification.dto.GetTestStudentVerificationResDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class TestStudentVerificationServiceTest {

    @InjectMocks
    private TestStudentVerificationService testStudentVerificationService;
    @Mock
    private SubmissionService submissionService;

    private final kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest();
    private final Student student = DummyFactory.createStudent();
    private final long supervisedBy = DummyFactory.createAssistant().getId();
    private final Submission submission = DummyFactory.createSubmission();
    private final List<Submission> submissions = DummyFactory.createSubmissions();

    @BeforeEach
    void init() {
        submissionService = mock(SubmissionService.class);
        testStudentVerificationService = new TestStudentVerificationService(submissionService);
    }

    @Test
    void getList_success() {
        //given
        when(submissionService.getByTestIdAndSupervisedBy(anyLong(), anyLong())).thenReturn(submissions);

        //when
        List<GetTestStudentVerificationResDto> res = testStudentVerificationService.getList(test.getId(), supervisedBy);

        //then
        assertEquals(submissions.size(), res.size());

        if (submissions.size() > 0) {
            assertAll("Submission Info Correct",
                    () -> assertEquals(submissions.get(0).getId(), res.get(0).getSubmissionId()),
                    () -> assertEquals(submissions.get(0).getVerified(), res.get(0).getVerified())
            );
        }

    }

    @Test
    void update_verifiedTrue_success() {
        //given
        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(submission);

        //when
        testStudentVerificationService.update(test.getId(), student.getId(), true);

        //then
        verify(submissionService, times(1)).getByTestIdAndStudentId(anyLong(), anyLong());

        assertEquals(VerificationStatus.SUCCESS, submission.getVerified());

    }

    @Test
    void update_verifiedFalse_success() {
        //given
        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(submission);

        //when
        testStudentVerificationService.update(test.getId(), student.getId(), false);

        //then
        verify(submissionService, times(1)).getByTestIdAndStudentId(anyLong(), anyLong());

        assertEquals(VerificationStatus.REJECTED, submission.getVerified());

    }
}