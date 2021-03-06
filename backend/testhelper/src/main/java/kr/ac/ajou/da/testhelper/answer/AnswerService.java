package kr.ac.ajou.da.testhelper.answer;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import kr.ac.ajou.da.testhelper.account.exception.AccountNotFoundException;
import kr.ac.ajou.da.testhelper.answer.dto.GetAnswerResDto;
import kr.ac.ajou.da.testhelper.answer.dto.PostAnswerReqDto;
import kr.ac.ajou.da.testhelper.answer.exception.AnswerNotFoundException;
import kr.ac.ajou.da.testhelper.aws.s3.PreSignedURLService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnswerService {
	private final AnswerRepository answerRepository;
	private final AnswerMapper answerMapper;
	private final PreSignedURLService preSignedURLService;
		
	@Transactional
	public boolean postAnswer(Long testId, PostAnswerReqDto reqDto) {
		Answer answer = new Answer(testId, reqDto.getFile());
		answerRepository.save(answer);
		return true;
	}

	@Transactional
	public List<GetAnswerResDto> getAnswerByTestId(Long testId) {
		List<Answer> answers = answerRepository.getAnswerByTestId(testId);
		List<GetAnswerResDto> list = new ArrayList<GetAnswerResDto>();
		for(Answer answer : answers) {
			list.add(new GetAnswerResDto(answer.getId(), answer.getTestId(), preSignedURLService.getDownloadUrl(answer.getFile())));
		}
		return list;
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
