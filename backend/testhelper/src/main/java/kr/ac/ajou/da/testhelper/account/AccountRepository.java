package kr.ac.ajou.da.testhelper.account;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByEmail(String email);

    @Query("SELECT a FROM Account a WHERE a.role = kr.ac.ajou.da.testhelper.account.definition.AccountRole.ASSISTANT " +
            "AND a.email LIKE :email||'%'")
    List<Account> findAllAssistantsByEmailStartingWith(String email);
}
