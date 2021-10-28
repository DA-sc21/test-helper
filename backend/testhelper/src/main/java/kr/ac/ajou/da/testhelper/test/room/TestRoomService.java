package kr.ac.ajou.da.testhelper.test.room;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.definition.DeviceType;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import kr.ac.ajou.da.testhelper.test.room.dto.RoomDto;
import kr.ac.ajou.da.testhelper.test.room.dto.StudentDto;
import kr.ac.ajou.da.testhelper.test.room.dto.StudentRoomDto;
import kr.ac.ajou.da.testhelper.test.room.exception.RoomNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.LinkedList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TestRoomService {

    private final SubmissionService submissionService;

    @Transactional
    public RoomDto getRoom(Long testID, Long studentId, DeviceType deviceType) {

        Submission submission;

        try {
            submission = submissionService.getByTestIDAndStudentID(testID, studentId);
        } catch (SubmissionNotFoundException exception) {
            throw new RoomNotFoundException();
        }

        return new RoomDto(submission, deviceType);
    }

    public List<StudentRoomDto> createRoomsForStudents(Long testID, Account supevisedBy) {

        /**
         *  1. 시험 감독할 대학생 목록 조회
         *  2. 각 대학생을 위한 VideoStream Channel 생성
         *  3. 시험 감독 접속을 위한 정보 반환
         */

        List<StudentRoomDto> studentRooms = new LinkedList<>();
        studentRooms.add(new StudentRoomDto(new StudentDto(1L, "name", "201820000"), "room"));

        return studentRooms;
    }
}
