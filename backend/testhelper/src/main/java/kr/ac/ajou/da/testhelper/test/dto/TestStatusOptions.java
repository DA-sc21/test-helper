package kr.ac.ajou.da.testhelper.test.dto;

import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Getter
public enum TestStatusOptions {
    ALL(Arrays.asList(TestStatus.values())),
    CREATE(Arrays.asList(TestStatus.CREATE, TestStatus.INVITED)),
    IN_PROGRESS(Arrays.asList(TestStatus.IN_PROGRESS)),
    MARK(Arrays.asList(TestStatus.ENDED, TestStatus.MARK)),
    GRADED(Arrays.asList(TestStatus.GRADED));

    private final List<TestStatus> testStatus;
}
