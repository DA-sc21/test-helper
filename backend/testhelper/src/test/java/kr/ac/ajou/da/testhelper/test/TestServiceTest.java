package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import kr.ac.ajou.da.testhelper.test.exception.TestNotFoundException;
import kr.ac.ajou.da.testhelper.test.room.TestRoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.LocalDateTime;
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

    private Course course = new Course(1L, "name");
    private kr.ac.ajou.da.testhelper.test.Test test = new kr.ac.ajou.da.testhelper.test.Test(
            1L,
            TestType.MID,
            LocalDateTime.of(2021, 1, 1, 0, 0),
            LocalDateTime.of(2021, 1, 1, 12, 0),
            course
    );

    @BeforeEach
    private void init() {
        testRepository = mock(TestRepository.class);
        testRoomService = mock(TestRoomService.class);
        testService = new TestService(testRepository, testRoomService);
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

    @Test
    void updateStatus_ENDED_success() {
        //given
        Account updatedBy = DummyFactory.createAccount();

        when(testRepository.findById(anyLong())).thenReturn(Optional.of(test));

        //when
        testService.updateStatus(this.test.getId(), TestStatus.ENDED, updatedBy);

        //then
        assertEquals(TestStatus.ENDED, this.test.getStatus());

        verify(testRoomService, times(1)).deleteRoomsForStudents(anyLong(), anyLong());

    }
}