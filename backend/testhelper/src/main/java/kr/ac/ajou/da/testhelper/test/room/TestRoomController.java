package kr.ac.ajou.da.testhelper.test.room;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.aws.credentials.AWSTemporaryCredentialService;
import kr.ac.ajou.da.testhelper.definition.DeviceType;
import kr.ac.ajou.da.testhelper.test.room.dto.GetTestStudentRoomResDto;
import kr.ac.ajou.da.testhelper.test.room.dto.PostTestStudentRoomResDto;
import kr.ac.ajou.da.testhelper.test.room.dto.RoomDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mobile.device.Device;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

@RestController
@RequiredArgsConstructor
public class TestRoomController {
    private final AWSTemporaryCredentialService temporaryCredentialService;
    private final TestRoomService testRoomService;

    // 감독관 시험 실시 준비
    // POST /tests/{testID}/room를 변경
    @PostMapping("/tests/{testID}/students/room")
    public ResponseEntity<PostTestStudentRoomResDto> postTestStudentRoom(@PathVariable Long testID) {

        return ResponseEntity.ok(new PostTestStudentRoomResDto(
                temporaryCredentialService.createTemporaryCredential(),
                testRoomService.createRoomsForStudents(testID, new Account(1L))
        ));
    }

    //대학생 시험 대기실 입장
    // GET /tests/{testID}/rooms을 변경
    @GetMapping("/tests/{testID}/students/{studentID}/room")
    public ResponseEntity<GetTestStudentRoomResDto> getTestStudentRoom(@PathVariable Long testID,
                                                                       @PathVariable Long studentID,
                                                                       @ApiIgnore Device device) {

        //TODO : 로그인 기능 추가 후 해당 대학생이 맞는 지 validation 필요

        RoomDto room = testRoomService.getRoom(testID, studentID, DeviceType.of(device));

        return ResponseEntity.ok(new GetTestStudentRoomResDto(
                temporaryCredentialService.createTemporaryCredential()
                , room));

    }
}
