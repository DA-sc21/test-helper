package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    @Query("SELECT t FROM Test t INNER JOIN t.course c INNER JOIN c.professor p " +
            "WHERE p.id = :professorId AND t.status IN :allowedStatus")
    List<Test> findAllByProfessorIdAndTestStatus(@Param("professorId") Long professorId,
                                                 @Param("testStatus") List<TestStatus> allowedStatus) throws SQLException;

    @Query("SELECT t FROM Test t LEFT JOIN t.assistants a " +
            "WHERE a.id = :accountId AND t.status IN :allowedStatus")
    List<Test> findAllByAssistantIdAndTestStatus(@Param("accountId") Long accountId,
                                                 @Param("testStatus") List<TestStatus> allowedStatus) throws SQLException;
}
