package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.exception.CannotEndTestBeforeEndTimeException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

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
}