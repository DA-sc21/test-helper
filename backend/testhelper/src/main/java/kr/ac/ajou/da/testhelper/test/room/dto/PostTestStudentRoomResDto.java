package kr.ac.ajou.da.testhelper.test.room.dto;

import com.amazonaws.services.securitytoken.model.Credentials;
import kr.ac.ajou.da.testhelper.test.Test;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
@Getter
public class PostTestStudentRoomResDto {

    private final Credentials credentials;
    private final TestDto test;
    private final List<StudentRoomDto> students;

    public PostTestStudentRoomResDto(Credentials credentials, Test test, List<StudentRoomDto> students) {
        this.credentials = credentials;
        this.test = new TestDto(test);
        this.students = students;
    }
}
