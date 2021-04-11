import React, { Component, ErrorInfo, ReactNode } from 'react';

type State = {
  error: Error | null;
};

type Props = {
  children: ReactNode;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return <h1>Something went wrong: {this.state.error.message}.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
