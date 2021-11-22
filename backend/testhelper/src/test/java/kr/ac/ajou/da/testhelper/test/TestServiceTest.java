package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.AccountMapper;
import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.exception.TestNotFoundException;
import kr.ac.ajou.da.testhelper.test.room.TestRoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class TestServiceTest {

    @InjectMocks
    private TestService testService;

    @Mock
    private TestRepository testRepository;

    @Mock
    private TestRoomService testRoomService;

    @Mock
    private TestsMapper testsMapper;

    @Mock
    private AccountMapper accountMapper;

    @BeforeEach
    private void init() {
        testRepository = mock(TestRepository.class);
        testRoomService = mock(TestRoomService.class);
        testsMapper = mock(TestsMapper.class);
        accountMapper = mock(AccountMapper.class);

        testService = new TestService(testRepository, testRoomService, testsMapper, accountMapper);
    }

    @Test
    void getTest_success() {
        //given
        kr.ac.ajou.da.testhelper.test.Test expectedTest = DummyFactory.createTest();

        when(testRepository.findById(anyLong())).thenReturn(Optional.of(expectedTest));

        //when
        kr.ac.ajou.da.testhelper.test.Test actualTest = testService.getTest(expectedTest.getId());

        //then
        assertEquals(expectedTest, actualTest);
    }

    @Test
    void getTest_notFound_thenThrow_TestNotFoundException() {
        //given
        kr.ac.ajou.da.testhelper.test.Test expectedTest = DummyFactory.createTest();

        when(testRepository.findById(anyLong())).thenReturn(Optional.empty());

        //when
        assertThrows(TestNotFoundException.class, () -> {
            kr.ac.ajou.da.testhelper.test.Test test = testService.getTest(expectedTest.getId());
        });

        //then
    }

    @Test
    void updateStatus_ENDED_success() {
        //given
        Account updatedBy = DummyFactory.createAccount();
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest();

        when(testRepository.findById(anyLong())).thenReturn(Optional.of(test));

        //when
        testService.updateStatus(test.getId(), TestStatus.ENDED, updatedBy);

        //then
        assertEquals(TestStatus.ENDED, test.getStatus());

        verify(testRoomService, times(1)).deleteRoomsForStudents(anyLong(), anyLong());

    }
}