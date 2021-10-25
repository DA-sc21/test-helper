package kr.ac.ajou.da.testhelper.test.proctor;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.aws.credentials.AWSTemporaryCredentialService;
import kr.ac.ajou.da.testhelper.test.proctor.dto.PostTestStudentRoomResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestProctorController {

    private final AWSTemporaryCredentialService awsTemporaryCredentialService;
    private final TestProctorService testProctorService;

    // 시험 실시 준비
    // POST /tests/{testID}/room를 변경
    @PostMapping("/tests/{testID}/students/room")
    public ResponseEntity<PostTestStudentRoomResDto> postTestStudentRoom(@PathVariable Long testID) {

        return ResponseEntity.ok(new PostTestStudentRoomResDto(
                awsTemporaryCredentialService.createTemporaryCredential(),
                testProctorService.createRoomsForStudents(testID, new Account(1L))
        ));
    }
}
