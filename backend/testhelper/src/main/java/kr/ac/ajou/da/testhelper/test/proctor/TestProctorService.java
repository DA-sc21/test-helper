package kr.ac.ajou.da.testhelper.test.proctor;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.test.proctor.dto.StudentDto;
import kr.ac.ajou.da.testhelper.test.proctor.dto.StudentRoomDto;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class TestProctorService {
    public List<StudentRoomDto> createRoomsForStudents(Long testID, Account proctor) {

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
