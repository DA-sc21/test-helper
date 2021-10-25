package kr.ac.ajou.da.testhelper.test.student;

import kr.ac.ajou.da.testhelper.definition.DeviceType;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import kr.ac.ajou.da.testhelper.test.student.dto.RoomDto;
import kr.ac.ajou.da.testhelper.test.student.exception.RoomNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


class TestStudentServiceTest {

    @InjectMocks
    private TestStudentService testStudentService;

    @Mock
    private SubmissionService submissionService;

    private Student student;

    private Submission submission;

    private Long testId = 1L;

    @BeforeEach
    void init(){
        this.submissionService = mock(SubmissionService.class);
        this.testStudentService = new TestStudentService(submissionService);

        this.student = new Student(1L, "test", "201820000", "email@ajou.ac.kr");
        this.submission = new Submission(1L, student.getId(), testId);
    }

    @Test
    void getRoom_isPC_success() {
        //given

        when(submissionService.getByTestIDAndStudentID(anyLong(), anyLong())).thenReturn(submission);

        //when
        RoomDto room = this.testStudentService.getRoom(testId, student.getId(), DeviceType.PC);

        //then
        assertEquals(DeviceType.PC, room.getDeviceType());
        assertEquals(submission.getId().toString(),room.getName());

    }

    @Test
    void getRoom_isMobile_success() {
        //given

        when(submissionService.getByTestIDAndStudentID(anyLong(), anyLong())).thenReturn(submission);

        //when
        RoomDto room = this.testStudentService.getRoom(testId, student.getId(), DeviceType.MO);

        //then
        assertEquals(DeviceType.MO, room.getDeviceType());
        assertEquals(submission.getId().toString(),room.getName());

    }

    @Test
    void getRoom_roomNotFoundForTestIDAndStudent_then_throwRoomNotFoundException() {
        //given

        when(submissionService.getByTestIDAndStudentID(anyLong(), anyLong())).thenThrow(new SubmissionNotFoundException());

        //when
        assertThrows(RoomNotFoundException.class, ()->{
            RoomDto room = this.testStudentService.getRoom(testId, student.getId(), DeviceType.PC);
        });

        //then

    }
}