import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScreenContainer } from "./screen-container";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches errors in child components and displays a user-friendly error screen
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ScreenContainer className="p-4">
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-5xl mb-4">⚠️</Text>
            <Text className="text-xl font-bold text-foreground text-center">
              حدث خطأ ما
            </Text>
            <Text className="text-sm text-muted text-center mb-4">
              {this.state.error?.message || "حدث خطأ غير متوقع"}
            </Text>

            <TouchableOpacity
              onPress={this.handleReset}
              className="bg-primary px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">حاول مرة أخرى</Text>
            </TouchableOpacity>
          </View>
        </ScreenContainer>
      );
    }

    return this.props.children;
  }
}
