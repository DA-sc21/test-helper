package kr.ac.ajou.da.testhelper.student;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {
	
	private final StudentMapper studentMapper;
	
	public void createStudent(String name, String studentNum, String email, Long courseId) {
		studentMapper.createStudent(name, studentNum, email, courseId);
	}

	public void deleteByCourseId(Long courseId) {
		studentMapper.deleteStudentByCourseId(courseId);
	}

}
