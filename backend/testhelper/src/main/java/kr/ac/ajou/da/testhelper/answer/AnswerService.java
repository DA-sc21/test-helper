package kr.ac.ajou.da.testhelper.answer;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import kr.ac.ajou.da.testhelper.account.exception.AccountNotFoundException;
import kr.ac.ajou.da.testhelper.answer.dto.PostAnswerReqDto;
import kr.ac.ajou.da.testhelper.answer.dto.ProblemWithAnswer;
import kr.ac.ajou.da.testhelper.answer.exception.AnswerNotFoundException;
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

	@Transactional
	public List<Answer> getAnswerByTestId(Long testId) {
		return answerRepository.getAnswerByTestId(testId);
	}
	
	@Transactional
	public Answer getAnswerById(Long answerId) {
		return answerRepository.findById(answerId)
				.orElseThrow(AnswerNotFoundException::new);
	}

	@Transactional
	public boolean deleteAnswer(Long answerId) {
		Answer answer = getAnswerById(answerId);
		answerRepository.delete(answer);
		return true;
	}

}
