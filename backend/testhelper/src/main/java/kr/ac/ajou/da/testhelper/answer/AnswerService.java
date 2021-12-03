package kr.ac.ajou.da.testhelper.answer;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import kr.ac.ajou.da.testhelper.answer.dto.PostAnswerReqDto;
import kr.ac.ajou.da.testhelper.answer.dto.ProblemWithAnswer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnswerService {
	private final AnswerRepository answerRepository;
	private final AnswerMapper answerMapper;
		
	@Transactional
	public boolean postAnswer(Long testId, PostAnswerReqDto reqDto) {
		Answer answer = new Answer(testId, reqDto.getFile());
		answerRepository.save(answer);
		return true;
	}

	public List<Answer> getAnswer(Long testId) {
		return answerRepository.getAnswerByTestId(testId);
	}

}
