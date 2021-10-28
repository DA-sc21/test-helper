package kr.ac.ajou.da.testhelper.aws.videostream;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Disabled
class AWSVideoStreamServiceIntegrationTest {

    @Autowired
    private AWSVideoStreamService awsVideoStreamService;

    @Test
    void createAndDeleteSignalingChannel() {
        //given

        //when
        awsVideoStreamService.createSignalingChannel("TestChannel");
        awsVideoStreamService.deleteSignalingChannel("TestChannel");
        //then
    }
}