package kr.ac.ajou.da.testhelper.test.room.dto;

import kr.ac.ajou.da.testhelper.submission.Submission;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class StudentRoomDto {
    private final String roomId;
    private final StudentDto student;

    public StudentRoomDto(Submission submission){
        this.roomId = submission.resolveRoomId();
        this.student = new StudentDto(submission.getStudent());
    }
}
