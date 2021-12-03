package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TestResultService {

    private final TestService testService;

    @Transactional
    public void grade(Long testId) {
        Test test = testService.getTest(testId);

        test.resolveResult();
    }
}
