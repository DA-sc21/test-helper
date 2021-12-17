package kr.ac.ajou.da.testhelper.file;

import org.springframework.stereotype.Service;

@Service
public interface FileService {
    String getUploadUrl(String path);

    String getDownloadUrl(String path);

    boolean exist(String path);
}
