package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.account.AccountMapper;
import kr.ac.ajou.da.testhelper.account.AccountService;
import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.course.CourseService;
import kr.ac.ajou.da.testhelper.examinee.Examinee;
import kr.ac.ajou.da.testhelper.examinee.ExamineeService;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import kr.ac.ajou.da.testhelper.test.dto.PostAndPatchTestReqDto;
import kr.ac.ajou.da.testhelper.test.exception.CannotUpdateTestException;
import kr.ac.ajou.da.testhelper.test.exception.TestNotFoundException;
import kr.ac.ajou.da.testhelper.test.invitation.TestInvitationSender;
import kr.ac.ajou.da.testhelper.test.room.TestRoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class TestServiceTest {

    @InjectMocks
    private TestService testService;

    @Mock
    private TestRepository testRepository;

    @Mock
    private TestRoomService testRoomService;

    @Mock
    private AccountMapper accountMapper;

    @Mock
    private CourseService courseService;

    @Mock
    private AccountService accountService;


    @Mock
    private ExamineeService examineeService;

    @Mock
    private TestInvitationSender testInvitationSender;

    @BeforeEach
    private void init() {
        testRepository = mock(TestRepository.class);
        testRoomService = mock(TestRoomService.class);
        accountMapper = mock(AccountMapper.class);
        courseService = mock(CourseService.class);
        accountService = mock(AccountService.class);
        examineeService = mock(ExamineeService.class);
        testInvitationSender = mock(TestInvitationSender.class);

        testService = new TestService(testRepository,
                testRoomService,
                accountMapper,
                courseService,
                accountService,
                examineeService,
                testInvitationSender);
    }

    @Test
    void getTest_success() {
        //given
        kr.ac.ajou.da.testhelper.test.Test expectedTest = DummyFactory.createTest();

        when(testRepository.findById(anyLong())).thenReturn(Optional.of(expectedTest));

        //when
        kr.ac.ajou.da.testhelper.test.Test actualTest = testService.getTest(expectedTest.getId());

        //then
        assertEquals(expectedTest, actualTest);
    }

    @Test
    void getTest_notFound_thenThrow_TestNotFoundException() {
        //given
        kr.ac.ajou.da.testhelper.test.Test expectedTest = DummyFactory.createTest();

        when(testRepository.findById(anyLong())).thenReturn(Optional.empty());

        //when
        assertThrows(TestNotFoundException.class, () -> {
            kr.ac.ajou.da.testhelper.test.Test test = testService.getTest(expectedTest.getId());
        });

        //then
    }

    @Test
    void updateStatus_ENDED_success() {
        //given
        Account updatedBy = DummyFactory.createAccount();
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest();

        when(testRepository.findById(anyLong())).thenReturn(Optional.of(test));

        //when
        testService.updateStatus(test.getId(), TestStatus.ENDED, updatedBy);

        //then
        assertEquals(TestStatus.ENDED, test.getStatus());

        verify(testRoomService, times(1)).deleteRoomsForStudents(anyLong(), anyLong());

    }

    @Test
    void createTest_success() {
        //given
        Course course = DummyFactory.createCourse();
        Account professor = course.getProfessor();
        Set<Account> assistants = course.getAssistants();

        PostAndPatchTestReqDto reqDto = new PostAndPatchTestReqDto(TestType.MID,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(2),
                assistants.stream().mapToLong(Account::getId).boxed().collect(Collectors.toList()));

        when(courseService.get(anyLong())).thenReturn(course);
        when(accountService.getByIds(anyList())).thenReturn(new ArrayList<>(assistants));

        //when
        kr.ac.ajou.da.testhelper.test.Test actualTest = testService.createTest(course.getId(), reqDto, professor.getId());

        //then
        assertTestEquals(course, reqDto, actualTest);
        assertEquals(TestStatus.CREATE, actualTest.getStatus());
        assertTrue(course.getTests().contains(actualTest));
        verify(courseService, times(1)).get(anyLong());
        verify(accountService, times(1)).getByIds(anyList());
        verify(testRepository, times(1)).save(any(kr.ac.ajou.da.testhelper.test.Test.class));
    }

    private void assertTestEquals(Course course, PostAndPatchTestReqDto reqDto, kr.ac.ajou.da.testhelper.test.Test actualTest) {
        assertEquals(course, actualTest.getCourse());
        assertTestEquals(reqDto, actualTest);
    }

    private void assertAssistantsEquals(List<Long> expectedAssistants, Set<Account> actualAssistants) {
        assertEquals(expectedAssistants.size(), actualAssistants.size());

        Map actualAssistantMap = actualAssistants.stream().collect(Collectors.toMap(Account::getId, Function.identity()));

        for(Long expectedAssistant : expectedAssistants){
            assertTrue(actualAssistantMap.containsKey(expectedAssistant));
        }
    }

    @Test
    void updateTest_testStatusCREATE_success() {
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest();
        Account professor = test.getCourse().getProfessor();
        List<Account> assistants = Collections.singletonList(DummyFactory.createAssistant());

        PostAndPatchTestReqDto reqDto = new PostAndPatchTestReqDto(TestType.MID,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(2),
                assistants.stream().mapToLong(Account::getId).boxed().collect(Collectors.toList()));

        when(testRepository.getById(anyLong())).thenReturn(test);
        when(accountService.getByIds(anyList())).thenReturn(assistants);

        //when
        kr.ac.ajou.da.testhelper.test.Test actualTest = testService.updateTest(test.getId(), reqDto, professor.getId());

        //then
        assertTestEquals(reqDto, actualTest);
        verify(accountService, times(1)).getByIds(anyList());
        verify(testRepository, times(1)).getById(anyLong());
    }

    private void assertTestEquals(PostAndPatchTestReqDto reqDto, kr.ac.ajou.da.testhelper.test.Test actualTest) {
        assertAll(
                ()-> assertEquals(reqDto.getType(), actualTest.getTestType()),
                ()-> assertEquals(reqDto.getStartTime(), actualTest.getStartTime()),
                ()-> assertEquals(reqDto.getEndTime(), actualTest.getEndTime()),
                ()-> assertAssistantsEquals(reqDto.getAssistants(), actualTest.getAssistants())
        );
    }

    @Test
    void updateTest_testStatusINVITED_success_sendUpdateEmail() {
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest();
        Account professor = test.getCourse().getProfessor();
        List<Account> assistants = Collections.singletonList(DummyFactory.createAssistant());

        PostAndPatchTestReqDto reqDto = new PostAndPatchTestReqDto(TestType.MID,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(2),
                assistants.stream().mapToLong(Account::getId).boxed().collect(Collectors.toList()));

        when(testRepository.getById(anyLong())).thenReturn(test);
        when(accountService.getByIds(anyList())).thenReturn(assistants);

        //when
        kr.ac.ajou.da.testhelper.test.Test actualTest = testService.updateTest(test.getId(), reqDto, professor.getId());

        //then
        verify(testInvitationSender, times(1)).sendUpdates(any(kr.ac.ajou.da.testhelper.test.Test.class));
    }

    @Test
    void updateTest_testStatusINPROGRESS_thenThrow_CannotUpdateTestException() {
        //given
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest();
        test.updateStatus(TestStatus.IN_PROGRESS);
        Account professor = test.getCourse().getProfessor();
        List<Long> assistantIds = Arrays.asList(1L,2L);

        PostAndPatchTestReqDto reqDto = new PostAndPatchTestReqDto(TestType.MID,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(2),
                assistantIds);

        when(testRepository.getById(anyLong())).thenReturn(test);

        //when

        assertThrows(CannotUpdateTestException.class,
                ()->testService.updateTest(test.getId(), reqDto, professor.getId()));

        //then
    }

    @Test
    void sendTestInvitation_statusCREATE_success() {
        //given
        Student student = DummyFactory.createStudent();
        kr.ac.ajou.da.testhelper.test.Test test = DummyFactory.createTest();
        Long supervisedBy = 1L;
        List<Examinee> examinees = Arrays.asList(new Examinee(1L, student, test, supervisedBy));

        when(testRepository.findById(anyLong())).thenReturn(Optional.of(test));
        when(examineeService.createTestExaminees(any(kr.ac.ajou.da.testhelper.test.Test.class))).thenReturn(examinees);

        //when
        testService.sendTestInvitation(test.getId());

        //then
        assertEquals(TestStatus.INVITED, test.getStatus());
        verify(testRepository, times(1)).findById(anyLong());
        verify(examineeService, times(1)).createTestExaminees(any(kr.ac.ajou.da.testhelper.test.Test.class));
        verify(testInvitationSender, times(1)).sendInvitations(anyList());
    }
}