package kr.ac.ajou.da.testhelper.portal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortalRepository extends JpaRepository<PortalCourse, Long> {


}
