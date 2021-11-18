package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

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
}