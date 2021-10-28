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
import kr.ac.ajou.da.testhelper.test.room.dto.StudentRoomDto;
import kr.ac.ajou.da.testhelper.test.room.exception.RoomNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;


class TestRoomServiceTest {

    @InjectMocks
    private TestRoomService testRoomService;
    @Mock
    private SubmissionService submissionService;
    @Mock
    private TestRoomManagingService testRoomManagingService;

    private final Course course = new Course(1L, "name");
    private final Student student = new Student(1L, "name", "201820000", "email@ajou.ac.kr");
    private final kr.ac.ajou.da.testhelper.test.Test test = new kr.ac.ajou.da.testhelper.test.Test(1L,
            TestType.MID,
            LocalDateTime.now(),
            LocalDateTime.now(),
            course);
    private final Long supervisedBy = 1L;
    private final Submission submission = new Submission(1L, student, test, VerificationStatus.PENDING, supervisedBy);
    private final List<Submission> submissions = new ArrayList<>();

    @BeforeEach
    void init() {
        this.submissionService = mock(SubmissionService.class);
        this.testRoomManagingService = mock(TestRoomManagingService.class);
        this.testRoomService = new TestRoomService(submissionService, testRoomManagingService);

        this.submissions.add(new Submission(1L, student, test, VerificationStatus.PENDING, supervisedBy));
        this.submissions.add(new Submission(2L, student, test, VerificationStatus.PENDING, supervisedBy));
        this.submissions.add(new Submission(3L, student, test, VerificationStatus.PENDING, supervisedBy));
    }

    @Test
    void getRoom_success() {
        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(submission);

        //when
        RoomDto room = this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.PC);

        //then
        assertEquals(submission.resolveRoomId(), room.getId());
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

        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(submission);

        //when
        RoomDto room = this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.PC);

        //then
        assertEquals(DeviceType.PC, room.getDevice());

    }

    @Test
    void getRoom_isMobile_success() {
        //given

        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(submission);

        //when
        RoomDto room = this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.MO);

        //then
        assertEquals(DeviceType.MO, room.getDevice());

    }

    @Test
    void getRoom_roomNotFoundForTestIDAndStudent_then_throwRoomNotFoundException() {
        //given

        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenThrow(new SubmissionNotFoundException());

        //when
        assertThrows(RoomNotFoundException.class, () -> {
            RoomDto room = this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.PC);
        });

        //then

    }

    @Test
    void createRoomsForStudents_success() {
        //given
        when(submissionService.getByTestIdAndSupervisedBy(anyLong(), anyLong())).thenReturn(submissions);

        //when
        List<StudentRoomDto> rooms = testRoomService.createRoomsForStudents(test.getId(), supervisedBy);

        //then
        assertEquals(submissions.size(), rooms.size());

        verify(testRoomManagingService, times(submissions.size())).createRoom(anyString());

        if(rooms.size() > 0){
            Submission submission = submissions.get(0);
            StudentRoomDto room = rooms.get(0);
            assertEquals(submission.resolveRoomId(), room.getRoomId());
            assertAll("Student Info Correct",
                    () -> assertEquals(student.getId(), room.getStudent().getId()),
                    () -> assertEquals(student.getName(), room.getStudent().getName()),
                    () -> assertEquals(student.getStudentNumber(), room.getStudent().getStudentNumber())
            );
        }
    }
}