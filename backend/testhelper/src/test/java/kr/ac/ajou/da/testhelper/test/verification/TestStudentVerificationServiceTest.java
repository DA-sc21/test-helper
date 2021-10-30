package kr.ac.ajou.da.testhelper.test.verification;

import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.definition.VerificationStatus;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import kr.ac.ajou.da.testhelper.test.verification.dto.GetTestStudentVerificationResDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TestStudentVerificationServiceTest {

    @InjectMocks
    private TestStudentVerificationService testStudentVerificationService;
    @Mock
    private SubmissionService submissionService;

    private final Course course = new Course(1L, "name");
    private final Student student = new Student(1L, "name", "201820000", "email@ajou.ac.kr");
    private final kr.ac.ajou.da.testhelper.test.Test test = new kr.ac.ajou.da.testhelper.test.Test(1L,
            TestType.MID,
            LocalDateTime.now(),
            LocalDateTime.now(),
            course);
    private final Long supervisedBy = 1L;
    private final Submission submission = new Submission(1L, student, test, VerificationStatus.PENDING, supervisedBy);
    private final List<Submission> submissions = new ArrayList<>();

    @BeforeEach
    void init() {
        submissionService = mock(SubmissionService.class);
        testStudentVerificationService = new TestStudentVerificationService(submissionService);

        submissions.add(new Submission(1L, student, test, VerificationStatus.PENDING, supervisedBy));
    }

    @Test
    void getList_success() {
        //given
        when(submissionService.getByTestIdAndSupervisedBy(anyLong(), anyLong())).thenReturn(submissions);

        //when
        List<GetTestStudentVerificationResDto> res = testStudentVerificationService.getList(test.getId(), supervisedBy);

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
        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(submission);

        //when
        testStudentVerificationService.update(test.getId(), student.getId(), true);

        //then
        assertEquals(VerificationStatus.SUCCESS, submission.getVerified());

    }

    @Test
    void update_verifiedFalse_success() {
        //given
        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(submission);

        //when
        testStudentVerificationService.update(test.getId(), student.getId(), false);

        //then
        assertEquals(VerificationStatus.REJECTED, submission.getVerified());

    }
}