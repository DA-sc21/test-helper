package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.AccountMapper;
import kr.ac.ajou.da.testhelper.account.AccountService;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.course.CourseService;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.dto.PostAndPatchTestReqDto;
import kr.ac.ajou.da.testhelper.test.exception.TestNotFoundException;
import kr.ac.ajou.da.testhelper.test.room.TestRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepository;
    private final TestRoomService testRoomService;
    private final TestsMapper testsMapper;
    private final AccountMapper accountMapper;
    private final CourseService courseService;
    private final AccountService accountService;

    @Transactional
    public Test getTest(Long testId) {
        return testRepository.findById(testId)
                .orElseThrow(TestNotFoundException::new);
    }

    @Transactional
    public void updateStatus(Long testId, TestStatus status, Account updatedBy) {

        Test test = this.getTest(testId);

        test.updateStatus(status);

        if (TestStatus.ENDED.equals(status)) {
            testRoomService.deleteRoomsForStudents(testId, updatedBy.getId());
        }

    }

    public List<HashMap<String, Object>> getTests(Long accountId) throws SQLException {
        String role = getAccountRole(accountId);

        if (role.equals("PROFESSOR")) {
            return testsMapper.getTestListOfProfessor(accountId);
        } else if (role.equals("ASSISTANT")) {
            return testsMapper.getTestListOfAssistant(accountId);
        }

        return null;
    }

    private String getAccountRole(Long accountId) throws SQLException {
        return accountMapper.getAccountRole(accountId);
    }

    @Transactional
    public Test createTest(Long courseId, PostAndPatchTestReqDto reqDto, Long createdBy) {
        Course course = courseService.get(courseId);

        List<Account> assistants = accountService.getByIds(reqDto.getAssistants());

        Test test = reqDto.createTest(course, createdBy);
        test.updateAssistants(assistants);

        testRepository.save(test);

        return test;
    }

    @Transactional
    public Test updateTest(Long testId, PostAndPatchTestReqDto reqDto, Long updatedBy) {
        Test test = testRepository.getById(testId);

        reqDto.updateTest(test,updatedBy);

        if(test.canUpdateAssistant()){
            List<Account> assistants = accountService.getByIds(reqDto.getAssistants());

            test.updateAssistants(assistants);
        }

        return test;
    }

    @Transactional
    public void sendTestInvitation(Long testId) {

    }
}
