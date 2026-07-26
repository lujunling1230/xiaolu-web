import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** 自定义错误回退 UI */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — 捕获子组件树渲染异常，防止整页白屏。
 *
 * 用法：
 *   <ErrorBoundary>
 *     <SomePage />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 输出到控制台便于调试
    console.error("[ErrorBoundary] 捕获到渲染异常:", error);
    console.error("[ErrorBoundary] 组件堆栈:", errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // 默认错误回退 UI
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "#F5F3EE",
            fontFamily: "'Noto Serif SC', 'PingFang SC', serif",
            color: "#5A4A3A",
          }}
        >
          <div
            style={{
              maxWidth: 420,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#128064;</div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "2px",
                margin: "0 0 12px",
              }}
            >
              页面开了一个小差
            </h2>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: "#8B7D6B",
                margin: "0 0 24px",
              }}
            >
              可能是网络波动或浏览器兼容问题，刷新一下通常就好了。
            </p>

            {/* 错误详情（可折叠） */}
            <details
              style={{
                textAlign: "left",
                marginBottom: 24,
                background: "rgba(90,74,58,0.04)",
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#8B7D6B",
                  letterSpacing: "1px",
                }}
              >
                查看技术详情
              </summary>
              <pre
                style={{
                  fontSize: 11,
                  color: "#7A7A7A",
                  marginTop: 8,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {this.state.error.message}
                {"\n"}
                {this.state.error.stack?.split("\n").slice(0, 4).join("\n")}
              </pre>
            </details>

            <button
              onClick={() => window.location.reload()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 28px",
                border: "1px solid rgba(90,74,58,0.15)",
                borderRadius: 20,
                background: "#F4D35E",
                color: "#5A4A3A",
                fontSize: 14,
                fontFamily: "inherit",
                letterSpacing: "2px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              重新加载
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
