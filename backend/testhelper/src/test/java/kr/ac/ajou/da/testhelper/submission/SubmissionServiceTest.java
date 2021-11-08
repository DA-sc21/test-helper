package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.file.FileService;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.LocalDateTime;
import java.util.LinkedList;
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
    private SubmissionMapper submissionMapper;


    private final Course course = new Course(1L, "name");
    private final kr.ac.ajou.da.testhelper.test.Test test = new kr.ac.ajou.da.testhelper.test.Test(1L,
            TestType.MID,
            LocalDateTime.now(),
            LocalDateTime.now(),
            course);
    private final Student student = new Student(1L, "name", "201820000", "email@ajou.ac.kr");
    private final long supervisedBy = 1L;
    private final Submission submission = new Submission(1L, student, test, supervisedBy);
    private final List<Submission> submissions = new LinkedList<>();

    private final SubmissionType submissionType = SubmissionType.SCREEN_SHARE_VIDEO;

    private final String uploadUrl = "uploadUrl";
    private FileService fileService;

    @BeforeEach
    void init() {
        submissionRepository = mock(SubmissionRepository.class);
        fileService = mock(FileService.class);
        submissionMapper = mock(SubmissionMapper.class);
        submissionService = new SubmissionService(submissionRepository, submissionMapper, fileService);

        submissions.add(new Submission(1L, student, test, supervisedBy));
    }

    @Test
    void getByTestIDAndStudentID_success() {
        //given
        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.of(submission));

        //when
        Submission submission = submissionService.getByTestIdAndStudentId(test.getId(), student.getId());

        //then
        verify(submissionRepository, times(1)).findByTestIdAndStudentId(anyLong(), anyLong());

        assertEquals(this.submission, submission);
    }

    @Test
    void getByTestIDAndStudentID_notFound_thenThrow_SubmissionNotFoundException() {
        //given
        when(submissionRepository.findByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(Optional.empty());

        //when
        assertThrows(SubmissionNotFoundException.class, () -> {
            Submission submission = submissionService.getByTestIdAndStudentId(test.getId(), student.getId());
        });

        //then
        verify(submissionRepository, times(1)).findByTestIdAndStudentId(anyLong(), anyLong());

    }

    @Test
    void getByTestIDAndSupervisedBy_success() {
        //given

        when(submissionRepository.findByTestIdAndSupervisedBy(anyLong(), anyLong())).thenReturn(submissions);

        //when
        List<Submission> res = submissionService.getByTestIdAndSupervisedBy(test.getId(), supervisedBy);

        //then
        verify(submissionRepository, times(1)).findByTestIdAndSupervisedBy(anyLong(), anyLong());

        assertEquals(submissions, res);
    }

    @Test
    void getUploadUrlByTestIdAndStudentIdAndSubmissionType_success() {
        //given
        when(submissionRepository.existsByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(true);
        when(fileService.getUploadUrl(anyString())).thenReturn(this.uploadUrl);

        //when
        String uploadUrl = submissionService.getUploadUrlByTestIdAndStudentIdAndSubmissionType(test.getId(), student.getId(), submissionType);

        //then
        verify(submissionRepository, times(1)).existsByTestIdAndStudentId(anyLong(), anyLong());
        // TODO : final object의 메소드가 호출되었는지 확인하는 방법 검토
        // verify(submissionType, times(1)).resolveSubmissionPath(anyLong(), anyLong());
        verify(fileService, times(1)).getUploadUrl(anyString());

        assertEquals(this.uploadUrl, uploadUrl);
    }

    @Test
    void getUploadUrlByTestIdAndStudentIdAndSubmissionType_submissionNotFound_thenThrow_SubmissionNotFoundException() {
        //given
        when(submissionRepository.existsByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(false);

        //when
        assertThrows(SubmissionNotFoundException.class, () -> {
            submissionService.getUploadUrlByTestIdAndStudentIdAndSubmissionType(test.getId(), student.getId(), submissionType);
        });

        //then
        verify(submissionRepository, times(1)).existsByTestIdAndStudentId(anyLong(), anyLong());
        verify(fileService, never()).getUploadUrl(anyString());
    }
}