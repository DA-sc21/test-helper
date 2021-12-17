package kr.ac.ajou.da.testhelper.aws.s3;

import com.amazonaws.HttpMethod;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import kr.ac.ajou.da.testhelper.file.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.net.URL;
import java.util.Date;

@Service
@Slf4j
@Primary
public class PreSignedURLService implements FileService {

	private static final long EXPIRATION_TIME = 1000 * 60 * 3; // 3분;
	public static final String BUCKET_NAME = "testhelper";

	private AmazonS3 s3Client;
	
	@PostConstruct
	public void initAWSS3Client() {
		log.info("initAWSS3Client");
		s3Client = AmazonS3ClientBuilder.standard()
				.withRegion(Regions.US_EAST_2)
				.build();
	}

	@Override
	public String getUploadUrl(String path) {
		return this.getPreSignedURL(path, EXPIRATION_TIME, BUCKET_NAME, HttpMethod.PUT);
	}

	@Override
	public String getDownloadUrl(String path) {
		return this.getPreSignedURL(path, EXPIRATION_TIME, BUCKET_NAME, HttpMethod.GET);
	}

	@Override
	public boolean exist(String path) {
		return s3Client.doesObjectExist(BUCKET_NAME, path);
	}

	private String getPreSignedURL(String objectKey, long expirationTime, String bucketName, HttpMethod method) {
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
