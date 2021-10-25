package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.definition.VerificationStatus;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SubmissionServiceTest {

    @InjectMocks
    private SubmissionService submissionService;

    @Mock
    private SubmissionRepository submissionRepository;

    private final long testId = 1L;
    private final long studentId = 1L;
    private final long supervisedBy = 1L;
    private final Submission submission = new Submission(1L, studentId, testId, VerificationStatus.PENDING, supervisedBy);
    private final List<Submission> submissions = new LinkedList<>();


    @BeforeEach
    void init() {
        submissionRepository = mock(SubmissionRepository.class);
        submissionService = new SubmissionService(submissionRepository);

        submissions.add(new Submission(1L, 1L, testId, VerificationStatus.PENDING, supervisedBy));
    }

    @Test
    void getByTestIDAndStudentID_success() {
        //given
        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.of(submission));

        //when
        Submission submission = submissionService.getByTestIDAndStudentID(testId, studentId);

        //then

        assertEquals(this.submission, submission);
    }

    @Test
    void getByTestIDAndStudentID_notFound_thenThrow_SubmissionNotFoundException() {
        //given
        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.empty());

        //when
        assertThrows(SubmissionNotFoundException.class, () -> {
            Submission submission = submissionService.getByTestIDAndStudentID(testId, studentId);
        });

        //then

    }

    @Test
    void getByTestIDAndSupervisedBy_success() {
        //given

        when(submissionRepository.findByTestIdAndSupervisedBy(anyLong(), anyLong())).thenReturn(submissions);

        //when
        List<Submission> res = submissionService.getByTestIDAndSupervisedBy(testId, supervisedBy);

        //then
        assertEquals(submissions, res);
    }
}