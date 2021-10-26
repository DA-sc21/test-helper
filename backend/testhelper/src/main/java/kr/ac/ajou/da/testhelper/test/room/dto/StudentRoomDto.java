package kr.ac.ajou.da.testhelper.test.room.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class StudentRoomDto {
    private final String roomId;
    private final StudentDto student;
}
