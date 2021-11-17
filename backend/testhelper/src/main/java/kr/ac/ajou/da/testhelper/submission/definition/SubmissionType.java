package kr.ac.ajou.da.testhelper.submission.definition;

public enum SubmissionType {
    SCREEN_SHARE_VIDEO("screen_share_video.mov"),
    ROOM_VIDEO("mobile_cam_video.mov");

    private static String pathFormat = "test/%d/submission/%d/%s";

    private final String fileName;

    SubmissionType(String fileName) {
        this.fileName = fileName;
    }

    //TODO : 이거에 대한 test code를 작성하는 방법 찾아보기
    public String resolveSubmissionPath(Long testId, Long studentId){
        return String.format(pathFormat, testId, studentId, fileName);
    }
}