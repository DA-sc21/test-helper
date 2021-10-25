package kr.ac.ajou.da.testhelper.test.student;

import kr.ac.ajou.da.testhelper.definition.DeviceType;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import kr.ac.ajou.da.testhelper.test.student.dto.RoomDto;
import kr.ac.ajou.da.testhelper.test.student.exception.RoomNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TestStudentService {

    private final SubmissionService submissionService;

    public RoomDto getRoom(Long testID, Long studentId, DeviceType deviceType) {

        Submission submission;

        try {
            submission = submissionService.getByTestIDAndStudentID(testID, studentId);
        } catch (SubmissionNotFoundException exception) {
            throw new RoomNotFoundException();
        }

        return new RoomDto(submission.getId(), deviceType);
    }
}
