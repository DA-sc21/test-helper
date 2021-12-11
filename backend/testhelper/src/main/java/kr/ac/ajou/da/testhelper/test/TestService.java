package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.AccountService;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.course.CourseService;
import kr.ac.ajou.da.testhelper.examinee.Examinee;
import kr.ac.ajou.da.testhelper.examinee.ExamineeService;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.dto.CreateTestReqDto;
import kr.ac.ajou.da.testhelper.test.exception.CannotDeleteStartedTestException;
import kr.ac.ajou.da.testhelper.test.exception.CannotResendTestInvitationException;
import kr.ac.ajou.da.testhelper.test.exception.TestNotFoundException;
import kr.ac.ajou.da.testhelper.test.invitation.TestInvitationSender;
import kr.ac.ajou.da.testhelper.test.room.TestRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepository;
    private final TestRoomService testRoomService;
    private final CourseService courseService;
    private final AccountService accountService;
    private final ExamineeService examineeService;
    private final TestInvitationSender testInvitationSender;

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

    @Transactional
    public List<Test> getTests(Account account, List<TestStatus> allowedStatus) throws SQLException {

        if (account.isProfessor()) {
            return testRepository.findAllByProfessorIdAndTestStatus(account.getId(), allowedStatus);
        } else if (account.isAssistant()) {
            return testRepository.findAllByAssistantIdAndTestStatus(account.getId(), allowedStatus);
        }

        return null;
    }

    @Transactional
    public Test createTest(Long courseId, CreateTestReqDto reqDto, Long createdBy) {
        Course course = courseService.get(courseId);
        List<Account> assistants = accountService.getByIds(reqDto.getAssistants());

        Test test = reqDto.createTest(course, assistants, createdBy);

        testRepository.save(test);

        return test;
    }

    @Transactional
    public Test updateTest(Long testId, CreateTestReqDto reqDto, Long updatedBy) {
        Test test = testRepository.getById(testId);
        List<Account> assistants = accountService.getByIds(reqDto.getAssistants());

        reqDto.updateTest(test, assistants, updatedBy);

        if(test.hasSentInvitation()){
            testInvitationSender.sendUpdates(test);

            updateTestSupervisor(test, assistants);

        }

        return test;
    }

    private void updateTestSupervisor(Test test, List<Account> assistants) {
        List<Account> supervisor = new LinkedList<>(assistants);
        supervisor.add(test.getCourse().getProfessor());

        for(int i = 0; i< test.getSubmissions().size(); i++){
            test.getSubmissions().get(i).updateSupervisedBy(supervisor.get(i% supervisor.size()).getId());
        }
    }

    @Transactional
    public void deleteTest(Long testId) {
        Test test = testRepository.getById(testId);

        if(test.hasStarted()){
            throw new CannotDeleteStartedTestException();
        }

        if(test.hasSentInvitation()){
            testInvitationSender.sendCancellation(test);
        }

        //TODO : 필요 없는 submission도 지워야함

        testRepository.delete(test);

    }

    @Transactional
    public void sendTestInvitation(Long testId) {
        Test test = getTest(testId);

        if (!test.canSendInvitation()) {
            throw new CannotResendTestInvitationException();
        }

        List<Examinee> examinees = examineeService.createTestExaminees(test);

        testInvitationSender.sendInvitations(examinees);

        test.updateStatus(TestStatus.INVITED);
    }
}
