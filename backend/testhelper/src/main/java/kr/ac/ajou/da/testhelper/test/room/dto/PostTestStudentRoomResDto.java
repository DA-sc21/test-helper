package kr.ac.ajou.da.testhelper.test.room.dto;

import com.amazonaws.services.securitytoken.model.Credentials;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
@Getter
public class PostTestStudentRoomResDto {

    private final Credentials credentials;
    private final List<StudentRoomDto> students;

}
