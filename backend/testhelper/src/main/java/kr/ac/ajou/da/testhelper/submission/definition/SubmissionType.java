package kr.ac.ajou.da.testhelper.submission.definition;

public enum SubmissionType {
    SCREEN_SHARE_VIDEO,
    ROOM_VIDEO;

    public String resolveSubmissionPath(Long testId, Long studentId) {
        return "";
    }
}