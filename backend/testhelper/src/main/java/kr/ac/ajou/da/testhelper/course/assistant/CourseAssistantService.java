package kr.ac.ajou.da.testhelper.course.assistant;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseAssistantService {
	private final CourseAssistantRepository courseAssistantRepository;
	private final CourseAssistantMapper courseAssistantMapper;

	public void createCourseAssistant(Long accountId, Long courseId) {
		courseAssistantMapper.createCourseAssistant(accountId, courseId);
	}
	
}
