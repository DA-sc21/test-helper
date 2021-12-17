package kr.ac.ajou.da.testhelper.test.definition;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum TestType {
    MID("중간고사"),
    FINAL("기말고사"),
    QUIZ("퀴즈");

    private final String name;
}
