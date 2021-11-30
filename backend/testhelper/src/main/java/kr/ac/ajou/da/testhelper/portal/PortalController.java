package kr.ac.ajou.da.testhelper.portal;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class PortalController {
	private final PortalService portalService;
	
	@GetMapping("/admin/university/classes")
	public ResponseEntity<List<PortalCourse>> getPortalCourses() {
		return ResponseEntity.ok().body(portalService.getAll());
	}
}
