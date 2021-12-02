package kr.ac.ajou.da.testhelper.test.room;

import kr.ac.ajou.da.testhelper.definition.DeviceType;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionNotFoundException;
import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.room.dto.RoomDto;
import kr.ac.ajou.da.testhelper.test.room.dto.StudentRoomDto;
import kr.ac.ajou.da.testhelper.test.room.exception.CannotStartTestException;
import kr.ac.ajou.da.testhelper.test.room.exception.RoomNotFoundException;
import kr.ac.ajou.da.testhelper.test.room.exception.TestNotInProgressException;
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
    public RoomDto getRoom(Long testId, Long studentId, DeviceType deviceType) {

        Submission submission;

        try {
            submission = submissionService.getByTestIdAndStudentId(testId, studentId);
        } catch (SubmissionNotFoundException exception) {
            throw new RoomNotFoundException();
        }

        if(!submission.getTest().isInProgress()){
            throw new TestNotInProgressException();
        };

        return new RoomDto(submission, deviceType);
    }

    @Transactional
    public List<StudentRoomDto> createRoomsForStudents(Test test, Long supervisedBy) {

        if(!test.canStartTest()){
            throw new CannotStartTestException();
        }

        List<Submission> submissions = submissionService.getByTestIdAndSupervisedBy(test.getId(), supervisedBy);

        submissions.forEach(submission -> testRoomManagingService.createRoom(submission.resolveRoomId()));

        test.updateStatus(TestStatus.IN_PROGRESS);

        return submissions.stream()
                .map(StudentRoomDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteRoomsForStudents(Long testId, Long supervisedBy) {

        List<Submission> submissions = submissionService.getByTestIdAndSupervisedBy(testId, supervisedBy);

        submissions.forEach(submission -> testRoomManagingService.deleteRoom(submission.resolveRoomId()));
    }
}
