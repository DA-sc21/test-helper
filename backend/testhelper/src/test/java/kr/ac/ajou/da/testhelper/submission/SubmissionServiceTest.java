package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SubmissionServiceTest {

    @InjectMocks
    private SubmissionService submissionService;

    @Mock
    private SubmissionRepository submissionRepository;

    private Long testId = 1L;
    private Long studentId = 1L;
    private Submission submission = new Submission(1L, studentId, testId);


    @BeforeEach
    void init(){
        submissionRepository = mock(SubmissionRepository.class);
        submissionService = new SubmissionService(submissionRepository);
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
        assertThrows(SubmissionNotFoundException.class, ()->{
            Submission submission = submissionService.getByTestIDAndStudentID(testId, studentId);
        });

        //then

    }
}