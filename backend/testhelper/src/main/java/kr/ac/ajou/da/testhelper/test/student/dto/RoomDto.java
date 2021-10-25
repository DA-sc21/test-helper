package kr.ac.ajou.da.testhelper.test.student.dto;

import kr.ac.ajou.da.testhelper.definition.DeviceType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class RoomDto {
    //channelName
    private final String name;
    //clientID
    private final DeviceType deviceType;

    public RoomDto(Long submissionID, DeviceType deviceType) {
        this.name = submissionID.toString();
        this.deviceType = deviceType;
    }
}
