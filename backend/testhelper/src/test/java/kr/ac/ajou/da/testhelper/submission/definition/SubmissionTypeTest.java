package kr.ac.ajou.da.testhelper.submission.definition;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.submission.Submission;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SubmissionTypeTest {

    @Test
    void resolveSubmissionPath_SubmissionTypeScreenShareVideo() {
        //given
        Submission submission = DummyFactory.createSubmission();
        SubmissionType submissionType = SubmissionType.SCREEN_SHARE_VIDEO;

        //when
        String path = submissionType.resolveSubmissionPath(submission);

        //then
        assertEquals(
                String.format("test/%05d/submission/%s/screen_share_video.mp4",
                        submission.getTest().getId(), submission.getStudent().getStudentNumber()),
                path);
    }

    @Test
    void resolveSubmissionPath_SubmissionTypeRoomVideo() {
        //given
        Submission submission = DummyFactory.createSubmission();
        SubmissionType submissionType = SubmissionType.ROOM_VIDEO;

        //when
        String path = submissionType.resolveSubmissionPath(submission);

        //then
        assertEquals(
                String.format("test/%05d/submission/%s/mobile_cam_video.mp4",
                        submission.getTest().getId(), submission.getStudent().getStudentNumber()),
                path);
    }

}