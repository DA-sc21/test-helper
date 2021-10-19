package kr.ac.ajou.da.testhelper.test.student;

import kr.ac.ajou.da.testhelper.aws.credentials.AWSTemporaryCredentialService;
import kr.ac.ajou.da.testhelper.definition.Device;
import kr.ac.ajou.da.testhelper.test.student.dto.GetTestStudentRoomResDto;
import kr.ac.ajou.da.testhelper.student.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestStudentController {

    private final AWSTemporaryCredentialService temporaryCredentialService;
    private final TestStudentService testStudentService;

    // GET /tests/{testID}/rooms을 변경
    @GetMapping("/tests/{testID}/students/{studentID}/room")
    public ResponseEntity<GetTestStudentRoomResDto> getTestStudentRoom(@PathVariable Long testID,
                                                                       @PathVariable Long studentID) {

        //TODO : 로그인 기능 추가 후 해당 대학생이 맞는 지 validation 필요

        return ResponseEntity.ok(new GetTestStudentRoomResDto(
                temporaryCredentialService.createTemporaryCredential()
                ,testStudentService.getRoom(
                        testID,
                        new Student(1L, "test","201820000", "email@ajou.ac.kr"),
                        Device.PC)));

    }
}
