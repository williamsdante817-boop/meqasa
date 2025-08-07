"use client";

import React, { Component } from "react";
import { AlertCard } from "@/components/alert-card";
import { AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AgentLogosErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      "Agent Logos Error Boundary caught an error:",
      error,
      errorInfo,
    );
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mt-[180px] hidden lg:flex justify-center">
          <AlertCard variant="destructive">
            <div className="flex flex-col items-center space-y-2 text-center">
              <AlertTitle className="text-lg text-brand-accent">
                Partner Logos Loading Error
              </AlertTitle>
              <AlertDescription className="text-brand-muted">
                Unable to load partner logos. Please try again later.
              </AlertDescription>
              <Button
                onClick={this.handleRetry}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </AlertCard>
        </div>
      );
    }

    return this.props.children;
  }
}
