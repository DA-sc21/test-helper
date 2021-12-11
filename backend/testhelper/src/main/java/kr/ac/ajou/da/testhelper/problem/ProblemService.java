package kr.ac.ajou.da.testhelper.problem;

import kr.ac.ajou.da.testhelper.problem.dto.TestProblemReqDto;
import kr.ac.ajou.da.testhelper.problem.exception.ProblemNotFoundException;
import kr.ac.ajou.da.testhelper.test.Test;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemService {

	private final ProblemRepository problemRepository;

	private final ProblemMapper problemMapper;

	@Transactional
    public List<Problem> getByTestId(Long testId) {

        return problemRepository.findByTestId(testId);

    }
	
	@Transactional
	public Problem getByTestIdAndProblemNum(Long testId, Long problemNum) {
		return problemRepository.findByTestIdAndProblemNum(testId, problemNum)
				.orElseThrow(ProblemNotFoundException::new);
	}

	private boolean existsByTestIdAndProblemNum(Long testId, Long problemNum) {
		return problemRepository.existsByTestIdAndProblemNum(testId, problemNum);
	}
	
	@Transactional
	public void createProblem(Problem problem) {
		problemRepository.save(problem);
	}

	@Transactional
	public boolean postTestProblem(Test test, TestProblemReqDto reqDto) {

		if(existsByTestIdAndProblemNum(test.getId(), reqDto.getProblemNum())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "문제가 이미 존재합니다.");
		}
		Problem problem = new Problem(reqDto.getProblemNum(), test, reqDto.getQuestion(), reqDto.getPoint(), reqDto.getAttachedFile());
		createProblem(problem);
		return true;
	}

	@Transactional
	public boolean putTestProblem(Long testId, TestProblemReqDto reqDto) {
		Problem problem = getByTestIdAndProblemNum(testId, reqDto.getProblemNum());

		problem.updateTestProblem(reqDto);

		return true;
	}

    public int getCountByTestId(Long testId) {
		return problemRepository.countByTestId(testId);
    }
    
    @Transactional
    public void deleteProblem(Problem problem) {
    	problemRepository.delete(problem);
	}
    
    @Transactional
    public void updateProblemNum(Long testId, Long problemNum) {
    	problemMapper.updateProblemNum(testId, problemNum);
	}

    @Transactional
	public boolean deleteTestProblem(Long testId, Long problemNum) {
    	Problem problem = getByTestIdAndProblemNum(testId, problemNum);
    	deleteProblem(problem);
    	updateProblemNum(testId, problemNum);
		return true;
	}

}
