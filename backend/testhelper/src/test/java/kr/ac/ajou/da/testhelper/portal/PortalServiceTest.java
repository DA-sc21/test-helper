package kr.ac.ajou.da.testhelper.portal;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Sort;

import kr.ac.ajou.da.testhelper.account.definition.AccountRole;
import kr.ac.ajou.da.testhelper.definition.PortalStatus;

class PortalServiceTest {
	@InjectMocks
	private PortalService portalService;
	@Mock
	private PortalRepository portalRepository;
	
	@BeforeEach
	void init() {
		portalRepository = mock(PortalRepository.class);
		portalService = new PortalService(portalRepository);
	}
	
	@Test
	void getAll_success() {
		//given
		List<PortalCourse> expectedList = new ArrayList<>();
		
		when(portalRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))).thenReturn(expectedList);
		
		//when
		List<PortalCourse> actualList = portalService.getAll();
		
		//then
		verify(portalRepository, times(1)).findAll(Sort.by(Sort.Direction.ASC, "name"));
		assertEquals(expectedList, actualList);
	}
	
	@Test
	void getCourseById_success() {
		//given
		Long courseId = 1L;
		String code = "code";
		
		String name = "name";
		String email = "email";
		AccountRole role = AccountRole.PROFESSOR;
		PortalAccount professor = new PortalAccount(name, email, role);
		
		List<PortalAssistant> assistants = new ArrayList<>();
		PortalStatus registered = PortalStatus.DONE;
		List<PortalStudent> students = new ArrayList<>();
		
		PortalCourse expectedCourses = new PortalCourse(courseId, code, name, professor, assistants, registered, students);
		
		when(portalRepository.findById(anyLong())).thenReturn(Optional.of(expectedCourses));

		//when
		PortalCourse actualCourses = portalService.getCourseById(courseId);
		
		//then
		verify(portalRepository, times(1)).findById(anyLong());
		assertEquals(expectedCourses, actualCourses);
	}
}
