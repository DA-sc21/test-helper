package kr.ac.ajou.da.testhelper.message;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MessageCache {

    private final Cache<UUID, MessageDto> chatHistoryCache = CacheBuilder
            .newBuilder().maximumSize(100).expireAfterWrite(30, TimeUnit.MINUTES) // 10분
            .build();

    public void save(MessageDto chatObj) {
    	log.info(chatObj.toString());
        this.chatHistoryCache.put(UUID.randomUUID(), chatObj); //uuid 중복될 확률 아주 아주 희박
    }


}
