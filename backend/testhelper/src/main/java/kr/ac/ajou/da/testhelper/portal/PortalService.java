package kr.ac.ajou.da.testhelper.portal;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import kr.ac.ajou.da.testhelper.definition.PortalStatus;
import kr.ac.ajou.da.testhelper.portal.exception.PortalCourseNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PortalService {
	@Autowired
	private PortalRepository portalRepository;
	
	@Transactional
	public List<PortalCourse> getAll() {
		return portalRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
	}

	@Transactional
	public PortalCourse getCourseById(Long id) {
		return portalRepository.findById(id)
				.orElseThrow(PortalCourseNotFoundException::new);
	}

	@Transactional
	public void updatePortalRegistered(PortalCourse portal) {
		portal.updateRegistered(PortalStatus.DONE);
	}

}
