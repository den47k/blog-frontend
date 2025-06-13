import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 300,
});

let navigationCount = 0;

export const startNavigationProgress = () => {
  if (navigationCount === 0) {
    NProgress.start();
  }
  navigationCount++;
};

export const stopNavigationProgress = () => {
  navigationCount--;
  if (navigationCount <= 0) {
    navigationCount = 0;
    NProgress.done();
  }
};

export const resetNavigationProgress = () => {
  navigationCount = 0;
  NProgress.done();
};