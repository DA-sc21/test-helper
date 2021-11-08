package kr.ac.ajou.da.testhelper.submission.definition;

import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.definition.VerificationStatus;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SubmissionTypeTest {

    private final Course course = new Course(1L, "name");
    private final kr.ac.ajou.da.testhelper.test.Test test = new kr.ac.ajou.da.testhelper.test.Test(1L,
            TestType.MID,
            LocalDateTime.now(),
            LocalDateTime.now(),
            course);
    private final Student student = new Student(1L, "name", "201820000", "email@ajou.ac.kr");
    private final long supervisedBy = 1L;
    private final Submission submission = new Submission(1L, student, test, VerificationStatus.PENDING, supervisedBy);

    @Test
    void resolveSubmissionPath_SubmissionTypeScreenShareVideo() {
        //given
        SubmissionType submissionType = SubmissionType.SCREEN_SHARE_VIDEO;

        //when
        String path = submissionType.resolveSubmissionPath(submission);

        //then
        assertEquals(
                String.format("test/%05d/submission/%s/screen_share_video.mov",
                        submission.getTest().getId(), submission.getStudent().getStudentNumber()),
                path);
    }

    @Test
    void resolveSubmissionPath_SubmissionTypeRoomVideo() {
        //given
        SubmissionType submissionType = SubmissionType.ROOM_VIDEO;

        //when
        String path = submissionType.resolveSubmissionPath(submission);

        //then
        assertEquals(
                String.format("test/%05d/submission/%s/mobile_cam_video.mov",
                        submission.getTest().getId(), submission.getStudent().getStudentNumber()),
                path);
    }

}