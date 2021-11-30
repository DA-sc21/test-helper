package kr.ac.ajou.da.testhelper.portal;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PortalService {
	@Autowired
	private PortalRepository portalRepository;
	
	@Transactional
	public List<PortalCourse> getAll() {
		return portalRepository.findAll(Sort.by(Sort.Direction.ASC, "courseName"));
	}

}
