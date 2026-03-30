import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "./screen-container";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error) => void;
  level?: "global" | "screen" | "component";
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

/**
 * Advanced Error Boundary Component
 * Catches errors in child components and displays user-friendly error screens
 * Supports retry logic, error tracking, and custom fallback UI
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState((prev) => ({ errorCount: prev.errorCount + 1 }));
    this.props.onError?.(error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <ScreenContainer className="p-4">
          <DefaultErrorFallback error={this.state.error} retry={this.handleReset} />
        </ScreenContainer>
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  const colors = useColors();

  return (
    <ScrollView className="flex-1" contentContainerClassName="flex-1 justify-center">
      <View className="flex-1 items-center justify-center gap-4">
        {/* Error Icon */}
        <View
          className="w-16 h-16 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.error + "20" }}
        >
          <Text className="text-4xl">⚠️</Text>
        </View>

        {/* Error Title */}
        <Text className="text-2xl font-bold text-foreground text-center">حدث خطأ</Text>

        {/* Error Message */}
        <Text className="text-base text-muted text-center leading-relaxed">
          {error.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."}
        </Text>

        {/* Error Details (Development only) */}
        {__DEV__ && (
          <View className="w-full bg-surface rounded-lg p-3 mt-2">
            <Text className="text-xs text-muted font-mono">{error.toString()}</Text>
          </View>
        )}

        {/* Retry Button */}
        <TouchableOpacity
          onPress={retry}
          className="w-full bg-primary rounded-lg py-3 items-center mt-4"
          style={{ opacity: 0.9 }}
        >
          <Text className="text-white font-semibold">حاول مرة أخرى</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
