package kr.ac.ajou.da.testhelper.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class BooleanResponse {
    @JsonIgnore
    public static final BooleanResponse TRUE = new BooleanResponse(true);
    @JsonIgnore
    public static final BooleanResponse FALSE = new BooleanResponse(false);

    private final Boolean result;

    public static BooleanResponse of(boolean result){
        if(result) return TRUE;
        else return FALSE;
    }
}
