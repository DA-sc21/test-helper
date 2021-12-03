package kr.ac.ajou.da.testhelper.answer;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.ac.ajou.da.testhelper.answer.dto.PostAnswerReqDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnswerService {
	private final AnswerRepository answerRepository;
	
	@Transactional
	public boolean postAnswer(PostAnswerReqDto reqDto) {
		Answer answer = new Answer(reqDto.getProblemId(), reqDto.getFile());
		answerRepository.save(answer);
		return true;
	}
}
