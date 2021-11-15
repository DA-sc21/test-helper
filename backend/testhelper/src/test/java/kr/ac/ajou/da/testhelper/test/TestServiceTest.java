package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.test.exception.TestNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TestServiceTest {

    @InjectMocks
    private TestService testService;

    @Mock
    private TestRepository testRepository;

    private final kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest();

    @BeforeEach
    private void init() {
        testRepository = mock(TestRepository.class);
        testService = new TestService(testRepository);
    }

    @Test
    void getTest_success() {
        //given
        when(testRepository.findById(anyLong())).thenReturn(Optional.of(test));

        //when
        kr.ac.ajou.da.testhelper.test.Test test = testService.getTest(this.test.getId());

        //then
        assertEquals(this.test, test);
    }

    @Test
    void getTest_notFound_thenThrow_TestNotFoundException() {
        //given
        when(testRepository.findById(anyLong())).thenReturn(Optional.empty());

        //when
        assertThrows(TestNotFoundException.class, () -> {
            kr.ac.ajou.da.testhelper.test.Test test = testService.getTest(this.test.getId());
        });

        //then
    }
}