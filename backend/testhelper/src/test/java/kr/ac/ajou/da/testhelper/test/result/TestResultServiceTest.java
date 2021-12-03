package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.test.TestService;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class TestResultServiceTest {

    @InjectMocks
    private TestResultService testResultService;

    @Mock
    private TestService testService;

    @BeforeEach
    void init() {
        testService = mock(TestService.class);
        testResultService = new TestResultService(testService);
    }

    @Test
    void grade_success() {
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest(TestStatus.MARK);

        when(testService.getTest(anyLong())).thenReturn(test);

        //when
        testResultService.grade(test.getId());

        //then
        verify(testService, times(1)).getTest(anyLong());

    }
}