package com.xiaolu.recharge;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // 加载后直接跳转到回血清单页面
    bridge.getWebView().loadUrl(bridge.getUrl() + "toolbox/recharge?solo=1");
  }
}
