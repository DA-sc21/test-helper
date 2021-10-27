package kr.ac.ajou.da.testhelper.test.room.dto;

import kr.ac.ajou.da.testhelper.definition.DeviceType;
import kr.ac.ajou.da.testhelper.submission.Submission;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class RoomDto {
    //channelName
    private final String id;
    //clientID
    private final DeviceType device;

    private final StudentDto student;

    private final TestDto test;

    public RoomDto(Submission submission, DeviceType device) {
        this.id = submission.getId().toString();
        this.device = device;
        this.student = new StudentDto(submission.getStudent());
        this.test = new TestDto(submission.getTest());
    }
}
