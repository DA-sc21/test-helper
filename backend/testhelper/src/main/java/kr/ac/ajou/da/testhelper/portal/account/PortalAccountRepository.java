package kr.ac.ajou.da.testhelper.portal.account;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.ac.ajou.da.testhelper.portal.PortalAccount;

@Repository
public interface PortalAccountRepository extends JpaRepository<PortalAccount, Long> {

	Optional<PortalAccount> findByEmail(String email);

}
