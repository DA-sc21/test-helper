package kr.ac.ajou.da.testhelper.student;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class Student {
    private final Long id;
    private final String name;
    private final String studentNumber;
    private final String email;
}
