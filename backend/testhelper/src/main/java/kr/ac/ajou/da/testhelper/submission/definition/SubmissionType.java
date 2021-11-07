package kr.ac.ajou.da.testhelper.submission.definition;

import kr.ac.ajou.da.testhelper.submission.Submission;

public enum SubmissionType {
    SCREEN_SHARE_VIDEO("screen_share_video.mov"),
    ROOM_VIDEO("mobile_cam_video.mov");

    private static final String pathFormat = "test/%05d/submission/%s/%s";

    private final String fileName;

    SubmissionType(String fileName) {
        this.fileName = fileName;
    }

    //TODO : 이거에 대한 test code를 작성하는 방법 찾아보기
    public String resolveSubmissionPath(Submission submission){
        return String.format(pathFormat, submission.getTest().getId(), submission.getStudent().getStudentNumber(), fileName);
    }
}
