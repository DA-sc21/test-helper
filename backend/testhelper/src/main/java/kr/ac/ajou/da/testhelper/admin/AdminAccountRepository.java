package kr.ac.ajou.da.testhelper.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminAccountRepository extends JpaRepository<AdminAccount, Long> {
    Optional<UserDetails> findByEmail(String email);
}
