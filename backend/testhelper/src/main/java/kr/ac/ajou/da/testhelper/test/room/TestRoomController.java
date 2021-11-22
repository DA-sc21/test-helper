package kr.ac.ajou.da.testhelper.test.room;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.aws.credentials.AWSTemporaryCredentialService;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessExaminee;
import kr.ac.ajou.da.testhelper.common.security.authority.IsProctor;
import kr.ac.ajou.da.testhelper.definition.DeviceType;
import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.TestService;
import kr.ac.ajou.da.testhelper.test.room.dto.GetTestStudentRoomResDto;
import kr.ac.ajou.da.testhelper.test.room.dto.PostTestStudentRoomResDto;
import kr.ac.ajou.da.testhelper.test.room.dto.RoomDto;
import kr.ac.ajou.da.testhelper.test.room.dto.StudentRoomDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mobile.device.Device;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TestRoomController {

    private final AWSTemporaryCredentialService temporaryCredentialService;
    private final TestRoomService testRoomService;
    private final TestService testService;

    // 감독관 시험 실시 준비
    // POST /tests/{testId}/room를 변경
    @PostMapping("/tests/{testId}/students/room")
    @IsProctor
    public ResponseEntity<PostTestStudentRoomResDto> postTestStudentRoom(@PathVariable Long testId,
                                                                         @AuthenticationPrincipal @ApiIgnore Account account) {

        Test test = testService.getTest(testId);
        List<StudentRoomDto> studentRooms = testRoomService.createRoomsForStudents(test.getId(), account.getId());

        return ResponseEntity.ok(new PostTestStudentRoomResDto(
                temporaryCredentialService.createTemporaryCredential(),
                test,
                studentRooms
        ));
    }

    //대학생 시험 대기실 입장
    // GET /tests/{testID}/rooms을 변경
    @GetMapping("/tests/{testID}/students/{studentID}/room")
    @AccessExaminee
    public ResponseEntity<GetTestStudentRoomResDto> getTestStudentRoom(@PathVariable Long testID,
                                                                       @PathVariable Long studentID,
                                                                       @ApiIgnore Device device) {

        RoomDto room = testRoomService.getRoom(testID, studentID, DeviceType.of(device));

        return ResponseEntity.ok(new GetTestStudentRoomResDto(
                temporaryCredentialService.createTemporaryCredential()
                , room));

    }
}
