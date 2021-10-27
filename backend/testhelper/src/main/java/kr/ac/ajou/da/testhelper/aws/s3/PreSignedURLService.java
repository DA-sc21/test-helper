package kr.ac.ajou.da.testhelper.aws.s3;

import java.net.URL;
import java.util.Date;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Service;

import com.amazonaws.HttpMethod;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PreSignedURLService {
	private AmazonS3 s3Client;
	
	@PostConstruct
	public void initAWSS3Client() {
		log.info("initAWSS3Client");
		s3Client = AmazonS3ClientBuilder.standard()
				.withRegion(Regions.US_EAST_2)
				.build();
	}

	public String getPreSignedURL(String objectKey, long expirationTime, String bucketName, HttpMethod method) {
		log.info(objectKey);		
	    GeneratePresignedUrlRequest generatePresignedUrlRequest = 
	    		new GeneratePresignedUrlRequest(bucketName, objectKey)
						.withMethod(method)
						.withExpiration(this.getExpiration(expirationTime));

	    URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
	    log.info(url.toString());
	    return url.toString();
	}
	
	private Date getExpiration(long expirationAsMilliseconds) {
		Date expiration = new Date();
		long expTimeMillis = expiration.getTime();
		expTimeMillis += expirationAsMilliseconds;
		expiration.setTime(expTimeMillis);
		return expiration;
	}

}
