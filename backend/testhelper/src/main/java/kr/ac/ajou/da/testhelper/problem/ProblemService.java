package kr.ac.ajou.da.testhelper.problem;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import kr.ac.ajou.da.testhelper.problem.dto.TestProblemReqDto;
import kr.ac.ajou.da.testhelper.problem.exception.ProblemNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProblemService {
	
	private final ProblemRepository problemRepository;
	
	@Transactional
    public List<Problem> getByTestId(Long testId) {

        return problemRepository.findByTestId(testId);

    }
	
	@Transactional
	private Problem getByTestIdAndProblemNum(Long testId, Long problemNum) {
		return problemRepository.findByTestIdAndProblemNum(testId, problemNum)
				.orElseThrow(ProblemNotFoundException::new);
	}
	
	@Transactional
	private Optional<Problem> checkVerifyProblemCreation(Long testId, Long problemNum) {
		return problemRepository.findByTestIdAndProblemNum(testId, problemNum);
	}

	@Transactional
	public boolean postTestProblem(Long testId, TestProblemReqDto reqDto) {
		if(!checkVerifyProblemCreation(testId, reqDto.getProblemNum()).isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "문제가 이미 존재합니다.");
		}
		Problem problem = new Problem(reqDto.getProblemNum(), testId, reqDto.getQuestion(), reqDto.getPoint(), reqDto.getAttachedFile());
		problemRepository.save(problem);
		return true;
	}

	@Transactional
	public boolean putTestProblem(Long testId, TestProblemReqDto reqDto) {
		Problem problem = getByTestIdAndProblemNum(testId, reqDto.getProblemNum());
		
		problem.updateTestProblem(reqDto);
		
		return true;
	}

}
