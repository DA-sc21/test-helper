package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;
import kr.ac.ajou.da.testhelper.submission.dto.GetSubmissionUploadUrlResDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SubmissionControllerTest {

    @InjectMocks
    private SubmissionController submissionController;
    @Mock
    private SubmissionService submissionService;

    private final Long testId = 1L;
    private final Long studentId = 1L;
    private final String url = "url";

    @BeforeEach
    void init(){
        submissionService = mock(SubmissionService.class);
        submissionController = new SubmissionController(submissionService);
    }

    @Test
    void getSubmissionUploadUrl_success() {
        //given
        when(submissionService.getUploadUrlByTestIdAndStudentIdAndSubmissionType(anyLong(), anyLong(), any(SubmissionType.class))).thenReturn(url);

        //when
        GetSubmissionUploadUrlResDto submissionUploadUrl = submissionController.getSubmissionUploadUrl(testId, studentId, SubmissionType.SCREEN_SHARE_VIDEO).getBody();

        //then
        assertEquals(url, submissionUploadUrl.getUploadUrl());

    }
}