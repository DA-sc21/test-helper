package kr.ac.ajou.da.testhelper.test.room;

import kr.ac.ajou.da.testhelper.aws.videostream.AWSVideoStreamService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Primary
public class AWSTestRoomManagingService implements TestRoomManagingService {

    private final AWSVideoStreamService videoStreamService;

    @Override
    public void createRoom(String roomId) {
        videoStreamService.createSignalingChannel(roomId);
    }

    @Override
    public void deleteRoom(String roomId) {
        videoStreamService.deleteSignalingChannel(roomId);
    }
}
