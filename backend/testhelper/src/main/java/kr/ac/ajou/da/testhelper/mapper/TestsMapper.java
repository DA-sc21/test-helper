package kr.ac.ajou.da.testhelper.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface TestsMapper {
	List<HashMap<String, Object>> selectTests();
}
