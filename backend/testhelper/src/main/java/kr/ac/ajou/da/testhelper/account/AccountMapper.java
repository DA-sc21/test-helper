package kr.ac.ajou.da.testhelper.account;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;

@Mapper
@Repository
public interface AccountMapper {
	@Select("SELECT role FROM ACCOUNT WHERE id = ${accountId}")
	String getAccountRole(@Param("accountId") Long accountId) throws SQLException;
}
