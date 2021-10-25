package kr.ac.ajou.da.testhelper.test.proctor.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class StudentDto {
    private final Long id; //SUBMISSION.id
    private final String name;
    private final String studentNumber;
}
