package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.file.FileConvertService;
import kr.ac.ajou.da.testhelper.file.FileService;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.answer.SubmissionAnswerService;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionStatus;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;
import kr.ac.ajou.da.testhelper.submission.dto.GetDetailedSubmissionResDto;
import kr.ac.ajou.da.testhelper.submission.exception.CannotViewNotSubmittedSubmissionException;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import kr.ac.ajou.da.testhelper.submission.exception.UploadedFileNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class SubmissionServiceTest {

    @InjectMocks
    private SubmissionService submissionService;
    @Mock
    private SubmissionRepository submissionRepository;
    @Mock
    private FileService fileService;
    @Mock
    private FileConvertService fileConvertService;
    @Mock
    private SubmissionAnswerService submissionAnswerService;
    @Mock
    private SubmissionMapper submissionMapper;


    private final String uploadUrl = "uploadUrl";


    @BeforeEach
    void init() {
        submissionRepository = mock(SubmissionRepository.class);
        fileService = mock(FileService.class);
        fileConvertService = mock(FileConvertService.class);
        submissionAnswerService = mock(SubmissionAnswerService.class);
        submissionMapper = mock(SubmissionMapper.class);
        submissionService = new SubmissionService(submissionRepository, fileService, fileConvertService, submissionAnswerService, submissionMapper);
    }

    @Test
    void getByTestIDAndStudentID_success() {
        //given
        Submission expectedSubmission = DummyFactory.createSubmission();
        kr.ac.ajou.da.testhelper.test.Test test = expectedSubmission.getTest();
        Student student = expectedSubmission.getStudent();

        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.of(expectedSubmission));

        //when
        Submission actualSubmission = submissionService.getByTestIdAndStudentId(test.getId(), student.getId());

        //then
        verify(submissionRepository, times(1)).findByTestIdAndStudentId(anyLong(), anyLong());

        assertEquals(expectedSubmission, actualSubmission);
    }

    @Test
    void getByTestIDAndStudentID_notFound_thenThrow_SubmissionNotFoundException() {
        //given

        Long testId = 1L;
        Long studentId = 1L;

        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.empty());

        //when
        assertThrows(SubmissionNotFoundException.class, () -> {
            Submission submission = submissionService.getByTestIdAndStudentId(testId, studentId);
        });

        //then
        verify(submissionRepository, times(1)).findByTestIdAndStudentId(anyLong(), anyLong());

    }

    @Test
    void getByTestIDAndSupervisedBy_success() {
        //given

        Submission submission = DummyFactory.createSubmission();
        kr.ac.ajou.da.testhelper.test.Test test = submission.getTest();
        Student student = submission.getStudent();
        List<Submission> submissions = new ArrayList<>();
        submissions.add(submission);

        when(submissionRepository.findByTestIdAndSupervisedBy(anyLong(), anyLong())).thenReturn(submissions);

        //when
        List<Submission> res = submissionService.getByTestIdAndSupervisedBy(test.getId(), submission.getSupervisedBy());

        //then
        verify(submissionRepository, times(1)).findByTestIdAndSupervisedBy(anyLong(), anyLong());

        assertEquals(submissions, res);
    }

    @Test
    void getUploadUrlByTestIdAndStudentIdAndSubmissionType_success() {
        //given

        Submission submission = DummyFactory.createSubmission();
        kr.ac.ajou.da.testhelper.test.Test test = submission.getTest();
        Student student = submission.getStudent();
        List<Submission> submissions = new ArrayList<>();
        submissions.add(submission);

        SubmissionType submissionType = SubmissionType.SCREEN_SHARE_VIDEO;

        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.of(submission));
        when(fileService.getUploadUrl(anyString())).thenReturn(this.uploadUrl);

        //when
        String uploadUrl = submissionService.getUploadUrlByTestIdAndStudentIdAndSubmissionType(test.getId(), student.getId(), submissionType);

        //then
        verify(submissionRepository, times(1)).findByTestIdAndStudentId(anyLong(), anyLong());
        // TODO : final object의 메소드가 호출되었는지 확인하는 방법 검토
        // verify(submissionType, times(1)).resolveSubmissionPath(anyLong(), anyLong());
        verify(fileService, times(1)).getUploadUrl(anyString());

        assertEquals(this.uploadUrl, uploadUrl);
    }

    @Test
    void getUploadUrlByTestIdAndStudentIdAndSubmissionType_submissionNotFound_thenThrow_SubmissionNotFoundException() {
        //given

        Long testId = 1L;
        Long studentId = 1L;
        SubmissionType submissionType = SubmissionType.SCREEN_SHARE_VIDEO;

        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.empty());

        //when
        assertThrows(SubmissionNotFoundException.class, () -> {
            submissionService.getUploadUrlByTestIdAndStudentIdAndSubmissionType(testId, studentId, submissionType);
        });

        //then
        verify(submissionRepository, times(1)).findByTestIdAndStudentId(anyLong(), anyLong());
        verify(fileService, never()).getUploadUrl(anyString());
    }

    @Test
    @Disabled
    void uploadSubmission_success() {
        //given
        Submission submission = DummyFactory.createSubmission();
        SubmissionType submissionType = SubmissionType.ROOM_VIDEO; //change to not video

        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.of(submission));

        //when
        submissionService.uploadSubmission(submission.getTest().getId(), submission.getStudent().getId(), submissionType);

        //then
        verify(submissionRepository, times(1)).findByTestIdAndStudentId(anyLong(), anyLong());
        verify(fileService, never()).exist(anyString());
        verify(fileConvertService,never()).convertToMp4(any(Submission.class), any(SubmissionType.class));

    }

    @Test
    void uploadSubmission_isVideo_convertToMp4() {
        //given
        Submission submission = DummyFactory.createSubmission();
        SubmissionType submissionType = SubmissionType.ROOM_VIDEO;

        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.of(submission));
        when(fileService.exist(anyString())).thenReturn(true);

        //when
        submissionService.uploadSubmission(submission.getTest().getId(), submission.getStudent().getId(), submissionType);

        //then
        verify(submissionRepository, times(1)).findByTestIdAndStudentId(anyLong(), anyLong());
        verify(fileService, times(1)).exist(anyString());
        verify(fileConvertService,times(1)).convertToMp4(any(Submission.class), any(SubmissionType.class));
    }

    @Test
    void uploadSubmission_fileNotFound_thenThrow_UploadedFileNotFoundException() {
        //given
        Submission submission = DummyFactory.createSubmission();
        SubmissionType submissionType = SubmissionType.ROOM_VIDEO;

        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.of(submission));
        when(fileService.exist(anyString())).thenReturn(false);

        //when
        assertThrows(UploadedFileNotFoundException.class, ()->{
            submissionService.uploadSubmission(submission.getTest().getId(), submission.getStudent().getId(), submissionType);
        });

        //then

    }

    @Test
    void getDetailedByTestIdAndStudentId_SubmissionStatusDone_success() {
        //given
        Submission expectedSubmission = DummyFactory.createSubmission();
        expectedSubmission.updateStatus(SubmissionStatus.DONE);
        kr.ac.ajou.da.testhelper.test.Test test = expectedSubmission.getTest();
        Student student = expectedSubmission.getStudent();
        String downloadUrl = "downloadUrl";

        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.of(expectedSubmission));
        when(fileService.getDownloadUrl(anyString())).thenReturn(downloadUrl);

        //when
        GetDetailedSubmissionResDto actualSubmission = submissionService.getDetailedByTestIdAndStudentId(test.getId(), student.getId(), true);

        //then
        verify(submissionRepository, times(1)).findByTestIdAndStudentId(anyLong(), anyLong());
        verify(fileService, times(2)).getDownloadUrl(anyString());
    }

    @Test
    void getDetailedByTestIdAndStudentId_SubmissionStatusPending_thenThrow_CannotViewNotSubmittedSubmissionException() {
        //given
        Submission expectedSubmission = DummyFactory.createSubmission();
        expectedSubmission.updateStatus(SubmissionStatus.PENDING);
        kr.ac.ajou.da.testhelper.test.Test test = expectedSubmission.getTest();
        Student student = expectedSubmission.getStudent();

        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.of(expectedSubmission));

        //when
        assertThrows(CannotViewNotSubmittedSubmissionException.class, ()-> submissionService.getDetailedByTestIdAndStudentId(test.getId(), student.getId(), true));

        //then
    }
}