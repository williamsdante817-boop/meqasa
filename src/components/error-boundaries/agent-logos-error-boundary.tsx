"use client";

import React, { Component } from "react";
import { AlertCard } from "@/components/common/alert-card";
import { AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { logError } from "@/lib/logger";

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
    logError("Agent Logos Error Boundary caught an error", error, {
      component: "AgentLogosErrorBoundary",
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mt-[180px] hidden justify-center lg:flex">
          <AlertCard variant="destructive">
            <div className="flex flex-col items-center space-y-2 text-center">
              <AlertTitle className="text-brand-accent text-lg">
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
