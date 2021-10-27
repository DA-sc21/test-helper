package kr.ac.ajou.da.testhelper.test.room;

import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.definition.DeviceType;
import kr.ac.ajou.da.testhelper.definition.VerificationStatus;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import kr.ac.ajou.da.testhelper.test.room.dto.RoomDto;
import kr.ac.ajou.da.testhelper.test.room.exception.RoomNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


class TestRoomServiceTest {

    @InjectMocks
    private TestRoomService testRoomService;
    @Mock
    private SubmissionService submissionService;

    private final Course course = new Course(1L, "name");
    private final Student student = new Student(1L, "name", "201820000", "email@ajou.ac.kr");
    private final kr.ac.ajou.da.testhelper.test.Test test = new kr.ac.ajou.da.testhelper.test.Test(1L,
            TestType.MID,
            LocalDateTime.now(),
            LocalDateTime.now(),
            course);
    private final Long supervisedBy = 1L;
    private final Submission submission = new Submission(1L, student, test, VerificationStatus.PENDING, supervisedBy);

    @BeforeEach
    void init() {
        this.submissionService = mock(SubmissionService.class);
        this.testRoomService = new TestRoomService(submissionService);
    }

    @Test
    void getRoom_success() {
        when(submissionService.getByTestIDAndStudentID(anyLong(), anyLong())).thenReturn(submission);

        //when
        RoomDto room = this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.PC);

        //then
        assertEquals(submission.getId().toString(), room.getId());
        assertEquals(DeviceType.PC, room.getDevice());

        assertAll("Student Info Correct",
                () -> assertEquals(student.getId(), room.getStudent().getId()),
                () -> assertEquals(student.getName(), room.getStudent().getName()),
                () -> assertEquals(student.getStudentNumber(), room.getStudent().getStudentNumber())
        );

        assertAll("Test Info Correct",
                () -> assertEquals(test.getId(), room.getTest().getId()),
                () -> assertEquals(test.resolveName(), room.getTest().getName()),
                () -> assertEquals(test.getStartTime(), room.getTest().getStartTime()),
                () -> assertEquals(test.getEndTime(), room.getTest().getEndTime())
        );
    }

    @Test
    void getRoom_isPC_success() {
        //given

        when(submissionService.getByTestIDAndStudentID(anyLong(), anyLong())).thenReturn(submission);

        //when
        RoomDto room = this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.PC);

        //then
        assertEquals(DeviceType.PC, room.getDevice());

    }

    @Test
    void getRoom_isMobile_success() {
        //given

        when(submissionService.getByTestIDAndStudentID(anyLong(), anyLong())).thenReturn(submission);

        //when
        RoomDto room = this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.MO);

        //then
        assertEquals(DeviceType.MO, room.getDevice());

    }

    @Test
    void getRoom_roomNotFoundForTestIDAndStudent_then_throwRoomNotFoundException() {
        //given

        when(submissionService.getByTestIDAndStudentID(anyLong(), anyLong())).thenThrow(new SubmissionNotFoundException());

        //when
        assertThrows(RoomNotFoundException.class, () -> {
            RoomDto room = this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.PC);
        });

        //then

    }
}