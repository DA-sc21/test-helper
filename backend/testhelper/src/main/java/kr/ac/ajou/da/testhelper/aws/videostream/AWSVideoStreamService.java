package kr.ac.ajou.da.testhelper.aws.videostream;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.kinesisvideo.AmazonKinesisVideo;
import com.amazonaws.services.kinesisvideo.AmazonKinesisVideoClient;
import com.amazonaws.services.kinesisvideo.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AWSVideoStreamService {
    private final AmazonKinesisVideo kinesisVideoClient;

    public AWSVideoStreamService() {

        this.kinesisVideoClient = AmazonKinesisVideoClient.builder()
                .withRegion(Regions.US_EAST_2)
                .build();

    }

    public void createSignalingChannel(String channelName) {

        try {

            describeSignalingChannel(channelName);

            log.info("Channel Already Exists : {}", channelName);

            return;

        } catch (ResourceNotFoundException ignore) {}

        CreateSignalingChannelRequest req = new CreateSignalingChannelRequest()
                .withChannelName(channelName)
                .withChannelType(ChannelType.SINGLE_MASTER);

        try {

            CreateSignalingChannelResult res = this.kinesisVideoClient.createSignalingChannel(req);

            log.info("Create Channel : {} {}", channelName, res.getChannelARN());

        } catch (ResourceInUseException ignore) {
            log.error("Channel Already Exists : {}", channelName);
        }

    }

    public void deleteSignalingChannel(String channelName) {

        try {

            ChannelInfo channelInfo = describeSignalingChannel(channelName);

            DeleteSignalingChannelRequest req = new DeleteSignalingChannelRequest()
                    .withChannelARN(channelInfo.getChannelARN())
                    .withCurrentVersion(channelInfo.getVersion());

            this.kinesisVideoClient.deleteSignalingChannel(req);

            log.info("Delete Channel : {} {}", channelName, channelInfo.getChannelARN());

        } catch (ResourceNotFoundException ignored) {
            log.info("Channel Not Found : {}", channelName);
        }

    }

    private ChannelInfo describeSignalingChannel(String channelName) throws ResourceNotFoundException {

        DescribeSignalingChannelRequest req = new DescribeSignalingChannelRequest()
                .withChannelName(channelName);

        return this.kinesisVideoClient.describeSignalingChannel(req).getChannelInfo();
    }
}
