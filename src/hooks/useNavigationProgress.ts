import { startLoading, stopLoading } from "@/lib/nprogress";

export function withProgress<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return (async (...args: any[]) => {
    startLoading();
    try {
      return await fn(...args);
    } finally {
      stopLoading();
    }
  }) as T;
}
