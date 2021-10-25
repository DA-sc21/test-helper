package kr.ac.ajou.da.testhelper.test.proctor.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class StudentRoomDto {
    private final StudentDto student;
    private final String roomID;
}
