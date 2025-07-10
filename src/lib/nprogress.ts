// import NProgress from 'nprogress';
// import 'nprogress/nprogress.css';

// NProgress.configure({
//   showSpinner: false,
//   trickleSpeed: 300,
// });

// let navigationCount = 0;

// export const startLoading = () => {
//   if (navigationCount === 0) {
//     NProgress.start();
//   }
//   navigationCount++;
// };

// export const stopLoading = () => {
//   navigationCount--;
//   if (navigationCount <= 0) {
//     navigationCount = 0;
//     NProgress.done();
//   }
// };

// export const resetLoading = () => {
//   navigationCount = 0;
//   NProgress.done();
// };


// lib/nprogress.ts
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 300,
  minimum: 0.3,
});

let loadingCount = 0;
let timeoutId: NodeJS.Timeout | null = null;

export const startLoading = () => {
  if (loadingCount === 0) {
    // Start loading after a tiny delay to prevent flickering
    timeoutId = setTimeout(() => {
      NProgress.start();
    }, 100);
  }
  loadingCount++;
};

export const stopLoading = () => {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount === 0) {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    NProgress.done();
  }
};

export const resetLoading = () => {
  loadingCount = 0;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  NProgress.done();
};