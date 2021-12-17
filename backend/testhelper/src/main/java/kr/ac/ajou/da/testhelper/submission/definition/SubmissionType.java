package kr.ac.ajou.da.testhelper.submission.definition;

import kr.ac.ajou.da.testhelper.submission.Submission;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum SubmissionType {
    SCREEN_SHARE_VIDEO("screen_share_video.webm", "screen_share_video.mp4", true),
    ROOM_VIDEO("mobile_cam_video.webm", "mobile_cam_video.mp4", true),
    CAPTURE("capture_1.jpg", "capture_1.jpg", false),
    ANSWER("answer_1.jpg", "answer_1.jpg", false);

    private static final String pathFormat = "test/%05d/submission/%s/%s";

    private final String beforeConvertedFileName;
    private final String fileName;
    private final boolean isVideo;

    //TODO : 이거에 대한 test code를 작성하는 방법 찾아보기

    public String resolveSubmissionPath(Submission submission){
        return resolveSubmissionPath(submission, true);
    }
    public String resolveSubmissionPath(Submission submission, boolean converted){
        if(!converted) return String.format(pathFormat, submission.getTest().getId(), submission.getStudent().getStudentNumber(), beforeConvertedFileName);
        return String.format(pathFormat, submission.getTest().getId(), submission.getStudent().getStudentNumber(), fileName);
    }

    public boolean isVideo() {
        return isVideo;
    }
}