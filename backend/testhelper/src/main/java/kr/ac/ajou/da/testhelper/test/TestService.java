package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.exception.TestNotFoundException;
import kr.ac.ajou.da.testhelper.test.room.TestRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepository;
    private final TestRoomService testRoomService;

    @Transactional
    public Test getTest(Long testId) {
        return testRepository.findById(testId)
                .orElseThrow(TestNotFoundException::new);
    }

    @Transactional
    public void updateStatus(Long testId, TestStatus status, Account updatedBy) {

        Test test = this.getTest(testId);

        test.updateStatus(status);

        if(TestStatus.ENDED.equals(status)){
            testRoomService.deleteRoomsForStudents(testId, updatedBy.getId());
        }

    }
}
