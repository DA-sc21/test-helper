package kr.ac.ajou.da.testhelper.test.room.dto;

import com.amazonaws.services.securitytoken.model.Credentials;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class GetTestStudentRoomResDto {
    private final Credentials credentials;
    private final RoomDto room;

}
