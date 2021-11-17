package kr.ac.ajou.da.testhelper.problem;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProblemService {
	
	private final ProblemRepository problemRepository;
	
	@Transactional
    public List<Problem> getByTestId(Long testId) {

        return problemRepository.findByTestId(testId);

    }

}
