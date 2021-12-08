package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.TestService;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.result.exception.CannotGradeTestIfTestIsNotMarkedException;
import kr.ac.ajou.da.testhelper.test.result.exception.CannotResendTestGradeException;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.module.Configuration;

@Service
@RequiredArgsConstructor
public class TestResultService {

    private final TestService testService;
    private final TestResultRepository testResultRepository;
    private final TestGradeSender testGradeSender;
    private final TestResultWorkbookResolver testResultWorkbookResolver;

    @Transactional
    public void updateTestResult(Long testId) {
        Test test = testService.getTest(testId);

        test.resolveResult();

        testResultRepository.save(test.getResult());
    }

    @Transactional
    public void gradeTest(Long testId) {
        Test test = testService.getTest(testId);

        if(test.isGraded()){
            throw new CannotResendTestGradeException();
        }

        if(!test.isMarked()){
            throw new CannotGradeTestIfTestIsNotMarkedException();
        }

        testGradeSender.sendGrade(test.getSubmissions());

        test.updateStatus(TestStatus.GRADED);

    }

    @Transactional
    public TestResult get(Long testId) {
        Test test = testService.getTest(testId);

        if(!test.doesResultExist()){
            throw new TestResultNotFoundException();
        }

        return test.getResult();
    }

    public Workbook createTestResultWorkbook(Long testId) {

        Test test = testService.getTest(testId);

        return testResultWorkbookResolver.resolve(test);

    }
}
