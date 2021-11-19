package kr.ac.ajou.da.testhelper.message;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Component;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MessageCache {

    private Cache<UUID, MessageDto> chatHistoryCache;
    
    @PostConstruct
    public void initCache() {
    	log.info("initCache");
    	chatHistoryCache = CacheBuilder
                .newBuilder().maximumSize(100).expireAfterWrite(30, TimeUnit.MINUTES) // 30분
                .build();
    }

    public void save(MessageDto chatObj) {
    	log.info(chatObj.toString());
        this.chatHistoryCache.put(UUID.randomUUID(), chatObj); //uuid 중복될 확률 아주 아주 희박
    }

    public List<MessageDto> get(String testId, String studentId) {
        return chatHistoryCache.asMap().values().stream()
        		.filter(t->t.getTestId().equals(testId) && t.getStudentId().equals(studentId))
                .sorted(Comparator.comparing(MessageDto::getTimeStamp))
                .collect(Collectors.toList());
    }

}
