import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  /**
   * Popup specifies whether or not the Error Boundary is being rendered in
   * the popup controller.
   */
  popup?: boolean;

  /**
   * If `popup` is true, then onCancel should also be provided.
   */
  onCancel?(): void;
}

const defaultState = {
  // Entries must be immutable
  error: null as null | Error,
  errorInfo: null as null | React.ErrorInfo,
};

export class ErrorBoundary extends React.Component<Props, typeof defaultState> {
  constructor(props: Props) {
    super(props);
    this.state = defaultState;
  }

  public componentDidCatch = (error: Error, errorInfo: React.ErrorInfo) => {
    this.setState({
      error,
      errorInfo,
    });
  };

  public onClose = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.setState({
      error: null,
      errorInfo: null,
    });
  };

  /**
   * The main render function.
   *
   * @dev Should have minimal computation, loops and anonymous functions.
   */
  public render() {
    const { children, popup, className, defaultValue, ...props } = this.props;

    if (this.state.errorInfo) {
      // Error path
      return (
        <div defaultValue={defaultValue as string[]} {...props}>
          <br />
          <div className="error-boundary--header">
            <h2>Something went wrong.</h2>
          </div>
          <div className="summary-content">
            <pre>
              <code>{this.state.error && String(this.state.error)}</code>
            </pre>
            <details>
              <summary>Stack trace</summary>
              <br />
              <pre>
                <code>{this.state.errorInfo.componentStack}</code>
              </pre>
            </details>
          </div>
        </div>
      );
    }
    // Normally, just render children
    return children;
  }
}
