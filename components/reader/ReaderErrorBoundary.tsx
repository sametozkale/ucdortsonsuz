"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ReaderErrorBoundaryProps {
  children: ReactNode;
}

interface ReaderErrorBoundaryState {
  hasError: boolean;
}

/**
 * Okuyucu ağacındaki render hatalarını yakalar; kitap sahnesi dışında aynı boş durum metni.
 */
export class ReaderErrorBoundary extends Component<
  ReaderErrorBoundaryProps,
  ReaderErrorBoundaryState
> {
  state: ReaderErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ReaderErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[reader] render error", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="p-8 text-center text-stone-500">
          Okuyucu yüklenirken bir sorun oluştu. Sayfayı yenileyin.
        </p>
      );
    }

    return this.props.children;
  }
}
