package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionStatus;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.exception.CannotEndTestBeforeEndTimeException;
import kr.ac.ajou.da.testhelper.test.result.exception.CannotResolveTestResultWhenSubmissionsMarkIncompleteException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TestTest {

    @Test
    void updateStatus_ENDED_success() {
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest();

        //when
        test.updateStatus(TestStatus.ENDED);

        //then
        assertEquals(TestStatus.ENDED, test.getStatus());

    }

    @Test
    @Disabled // TODO : LocalDateTime.now()를 mock할 방법 찾기
    void updateStatus_ENDED_nowBeforeEndTime_throw_CannotEndTestBeforeEndTimeException(){
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest();

        //LocalDateTime.now() < test.getEndTime()

        //when
        assertThrows(CannotEndTestBeforeEndTimeException.class, () -> {
            test.updateStatus(TestStatus.ENDED);
        });

        //then
    }

    @Test
    void resolveResult_success(){
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest(TestStatus.ENDED);
        List<Submission> submissions = Arrays.asList(new Submission(1L,null, test, null, SubmissionStatus.MARKED, null, null, 10, null),
                new Submission(2L,null, test, null, SubmissionStatus.MARKED, null, null, 20, null));

        test.setSubmissions(submissions);

        //when
        test.resolveResult();

        //then
        assertAll(
                ()-> assertEquals(10, test.getResult().getMinScore()),
                ()-> assertEquals(20, test.getResult().getMaxScore()),
                ()-> assertEquals(15.0, test.getResult().getAverage())
        );

        assertEquals(TestStatus.MARK, test.getStatus());
    }

    @Test
    void resolveResult_submissionsNotMarked_thenThrow_CannotResolveTestResultWhenSubmissionsMarkIncompleteException(){
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest(TestStatus.ENDED);
        List<Submission> submissions = Arrays.asList(new Submission(1L,null, test, null, SubmissionStatus.DONE, null, null, 10, null));

        test.setSubmissions(submissions);

        //when
        assertThrows(
                CannotResolveTestResultWhenSubmissionsMarkIncompleteException.class,
                () -> test.resolveResult()
        );

        //then
    }
}