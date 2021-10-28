package kr.ac.ajou.da.testhelper.definition;

import org.springframework.mobile.device.Device;

public enum DeviceType {
    PC,
    MO;

    public static DeviceType of(Device device) {
        return device.isMobile() || device.isTablet()
                ? MO
                : PC;
    }
}
