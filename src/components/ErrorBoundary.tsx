import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Container } from '@material-ui/core';

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

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <Container maxWidth="sm">
          <Alert severity="error">
            <AlertTitle>Something went wrong</AlertTitle>
            {this.state.error.message}
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
