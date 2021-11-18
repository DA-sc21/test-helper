package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.exception.TestNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepository;

    @Transactional
    public Test getTest(Long testId) {
        return testRepository.findById(testId)
                .orElseThrow(TestNotFoundException::new);
    }

    @Transactional
    public void updateStatus(Long testId, TestStatus status) {

        Test test = this.getTest(testId);

        test.updateStatus(status);

    }
}
