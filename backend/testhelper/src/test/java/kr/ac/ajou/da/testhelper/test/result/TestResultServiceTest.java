package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.test.TestService;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.result.exception.CannotGradeTestIfTestIsNotMarkedException;
import kr.ac.ajou.da.testhelper.test.result.exception.CannotResendTestGradeException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class TestResultServiceTest {

    @InjectMocks
    private TestResultService testResultService;

    @Mock
    private TestService testService;

    @Mock
    private TestResultRepository testResultRepository;

    @Mock
    private TestGradeSender testGradeSender;

    @Mock
    private TestResultWorkbookResolver testResultWorkbookResolver;

    @BeforeEach
    void init() {
        testService = mock(TestService.class);
        testResultRepository = mock(TestResultRepository.class);
        testGradeSender = mock(TestGradeSender.class);
        testResultWorkbookResolver = mock(TestResultWorkbookResolver.class);
        testResultService = new TestResultService(testService, testResultRepository, testGradeSender, testResultWorkbookResolver);
    }

    @Test
    void updateTestResult_success() {
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest(TestStatus.MARK);

        when(testService.getTest(anyLong())).thenReturn(test);

        //when
        testResultService.updateTestResult(test.getId());

        //then
        verify(testService, times(1)).getTest(anyLong());

    }

    @Test
    void gradeTest_statusMARK_success() {
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest(TestStatus.MARK);

        when(testService.getTest(anyLong())).thenReturn(test);

        //when
        testResultService.gradeTest(test.getId());

        //then
        verify(testService, times(1)).getTest(anyLong());
        verify(testGradeSender, times(1)).sendGrade(anyList());
    }

    @Test
    void gradeTest_statusGRADED_thenThrow_CannotResendTestGradeException() {
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest(TestStatus.GRADED);

        when(testService.getTest(anyLong())).thenReturn(test);

        //when
        assertThrows(CannotResendTestGradeException.class,
                () -> testResultService.gradeTest(test.getId()));

        //then
    }

    @Test
    void gradeTest_statusENDED_thenThrow_CannotGradeTestIfTestIsNotMarkedException() {
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest(TestStatus.ENDED);

        when(testService.getTest(anyLong())).thenReturn(test);

        //when
        assertThrows(CannotGradeTestIfTestIsNotMarkedException.class,
                () -> testResultService.gradeTest(test.getId()));

        //then
    }
}