package kr.ac.ajou.da.testhelper.test.room;

import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.definition.DeviceType;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.room.dto.RoomDto;
import kr.ac.ajou.da.testhelper.test.room.dto.StudentRoomDto;
import kr.ac.ajou.da.testhelper.test.room.exception.CannotStartTestException;
import kr.ac.ajou.da.testhelper.test.room.exception.RoomNotFoundException;
import kr.ac.ajou.da.testhelper.test.room.exception.TestNotInProgressException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

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

    @BeforeEach
    void init() {
        this.submissionService = mock(SubmissionService.class);
        this.testRoomManagingService = mock(TestRoomManagingService.class);
        this.testRoomService = new TestRoomService(submissionService, testRoomManagingService);
    }

    @Test
    void getRoom_success() {

        //given
        Submission submission = DummyFactory.createSubmission();
        kr.ac.ajou.da.testhelper.test.Test test = submission.getTest();
        Student student = submission.getStudent();

        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(submission);

        //when
        RoomDto room = this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.PC);

        //then
        verify(submissionService, times(1)).getByTestIdAndStudentId(anyLong(), anyLong());

        assertEquals(submission.resolveRoomId(), room.getId());
        assertEquals(DeviceType.PC, room.getDevice());
        assertEquals(submission.getConsented(), room.getConsented());

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
        Submission submission = DummyFactory.createSubmission();
        kr.ac.ajou.da.testhelper.test.Test test = submission.getTest();
        Student student = submission.getStudent();

        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(submission);

        //when
        RoomDto room = this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.PC);

        //then
        assertEquals(DeviceType.PC, room.getDevice());

    }

    @Test
    void getRoom_isMobile_success() {
        //given
        Submission submission = DummyFactory.createSubmission();
        kr.ac.ajou.da.testhelper.test.Test test = submission.getTest();
        Student student = submission.getStudent();

        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(submission);

        //when
        RoomDto room = this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.MO);

        //then
        assertEquals(DeviceType.MO, room.getDevice());

    }

    @Test
    void getRoom_roomNotFoundForTestIDAndStudent_then_throwRoomNotFoundException() {
        //given

        Long testId = 1L;
        Long studentId = 1L;

        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenThrow(new SubmissionNotFoundException());

        //when
        assertThrows(RoomNotFoundException.class, () -> {
            RoomDto room = this.testRoomService.getRoom(testId, studentId, DeviceType.PC);
        });

        //then
        verify(submissionService, times(1)).getByTestIdAndStudentId(anyLong(), anyLong());

    }

    @Test
    void getRoom_testStatusINVITED_thenThrow_TestNotInProgressException() {
        //given
        Submission submission = DummyFactory.createSubmission(TestStatus.INVITED);
        kr.ac.ajou.da.testhelper.test.Test test = submission.getTest();
        Student student = submission.getStudent();

        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(submission);

        //when
        assertThrows(TestNotInProgressException.class, () -> this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.PC));

        //then
    }

    @Test
    void getRoom_testStatusENDED_thenThrow_TestNotInProgressException() {
        //given
        Submission submission = DummyFactory.createSubmission(TestStatus.ENDED);
        kr.ac.ajou.da.testhelper.test.Test test = submission.getTest();
        Student student = submission.getStudent();

        when(submissionService.getByTestIdAndStudentId(anyLong(), anyLong())).thenReturn(submission);

        //when
        assertThrows(TestNotInProgressException.class, () -> this.testRoomService.getRoom(test.getId(), student.getId(), DeviceType.PC));

        //then
    }

    @Test
    void createRoomsForStudents_success() {
        //given
        Submission submission = DummyFactory.createSubmission();
        kr.ac.ajou.da.testhelper.test.Test test = submission.getTest();
        Student student = submission.getStudent();
        List<Submission> submissions = new ArrayList<>();
        submissions.add(submission);

        when(submissionService.getByTestIdAndSupervisedBy(anyLong(), anyLong())).thenReturn(submissions);

        //when
        List<StudentRoomDto> rooms = testRoomService.createRoomsForStudents(test, submission.getSupervisedBy());

        //then
        verify(submissionService, times(1)).getByTestIdAndSupervisedBy(anyLong(), anyLong());
        verify(testRoomManagingService, times(submissions.size())).createRoom(anyString());

        assertEquals(submissions.size(), rooms.size());

        StudentRoomDto room = rooms.get(0);
        assertEquals(submission.resolveRoomId(), room.getRoomId());
        assertAll("Student Info Correct",
                () -> assertEquals(student.getId(), room.getStudent().getId()),
                () -> assertEquals(student.getName(), room.getStudent().getName()),
                () -> assertEquals(student.getStudentNumber(), room.getStudent().getStudentNumber())
        );

    }

    @Test
    void createRoomsForStudents_testStatusCREATE_thenThrow_CannotStartTestException() {
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest(TestStatus.CREATE);
        Long supervisedBy = 1L;

        //when
        assertThrows(CannotStartTestException.class, ()->testRoomService.createRoomsForStudents(test, supervisedBy));

        //then
        verify(submissionService, never()).getByTestIdAndSupervisedBy(anyLong(), anyLong());
        verify(testRoomManagingService, never()).createRoom(anyString());
    }

    @Test
    void createRoomsForStudents_testStatusENDED_thenThrow_CannotStartTestException() {
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest(TestStatus.ENDED);
        Long supervisedBy = 1L;

        //when
        assertThrows(CannotStartTestException.class, ()->testRoomService.createRoomsForStudents(test, supervisedBy));

        //then
        verify(submissionService, never()).getByTestIdAndSupervisedBy(anyLong(), anyLong());
        verify(testRoomManagingService, never()).createRoom(anyString());
    }

    @Test
    void deleteRoomsForStudents_success() {

        Submission submission = DummyFactory.createSubmission();
        kr.ac.ajou.da.testhelper.test.Test test = submission.getTest();
        Student student = submission.getStudent();
        List<Submission> submissions = new ArrayList<>();
        submissions.add(submission);

        //given
        when(submissionService.getByTestIdAndSupervisedBy(anyLong(), anyLong())).thenReturn(submissions);

        //when
        testRoomService.deleteRoomsForStudents(test.getId(), submission.getSupervisedBy());

        //then
        verify(submissionService, times(1)).getByTestIdAndSupervisedBy(anyLong(), anyLong());
        verify(testRoomManagingService, times(submissions.size())).deleteRoom(anyString());

    }
}