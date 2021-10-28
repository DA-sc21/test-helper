package kr.ac.ajou.da.testhelper.test.room;

import kr.ac.ajou.da.testhelper.definition.DeviceType;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import kr.ac.ajou.da.testhelper.test.room.dto.RoomDto;
import kr.ac.ajou.da.testhelper.test.room.dto.StudentRoomDto;
import kr.ac.ajou.da.testhelper.test.room.exception.RoomNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestRoomService {

    private final SubmissionService submissionService;
    private final TestRoomManagingService testRoomManagingService;

    @Transactional
    public RoomDto getRoom(Long testID, Long studentId, DeviceType deviceType) {

        Submission submission;

        try {
            submission = submissionService.getByTestIdAndStudentId(testID, studentId);
        } catch (SubmissionNotFoundException exception) {
            throw new RoomNotFoundException();
        }

        return new RoomDto(submission, deviceType);
    }

    @Transactional
    public List<StudentRoomDto> createRoomsForStudents(Long testId, Long supevisedBy) {

        List<Submission> submissions = submissionService.getByTestIdAndSupervisedBy(testId, supevisedBy);

        submissions.forEach(submission -> testRoomManagingService.createRoom(submission.resolveRoomId()));

        return submissions.stream()
                .map(StudentRoomDto::new)
                .collect(Collectors.toList());
    }
}
