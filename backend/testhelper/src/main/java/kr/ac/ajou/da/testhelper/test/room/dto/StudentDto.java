package kr.ac.ajou.da.testhelper.test.room.dto;

import kr.ac.ajou.da.testhelper.student.Student;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class StudentDto {
    private final Long id;
    private final String name;
    private final String studentNumber;

    public StudentDto(Student student) {
        this.id = student.getId();
        this.name = student.getName();
        this.studentNumber = student.getStudentNumber();
    }
}
