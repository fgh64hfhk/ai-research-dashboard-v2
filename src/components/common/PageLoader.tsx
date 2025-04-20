import React from "react";

interface PageLoaderProps {
  isLoading: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  isLoading,
  fallback,
  children,
}) => {
  return <>{isLoading ? fallback : children}</>;
};
