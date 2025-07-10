import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 300,
});

let navigationCount = 0;

export const startLoading = () => {
  if (navigationCount === 0) {
    NProgress.start();
  }
  navigationCount++;
};

export const stopLoading = () => {
  navigationCount--;
  if (navigationCount <= 0) {
    navigationCount = 0;
    NProgress.done();
  }
};

export const resetLoading = () => {
  navigationCount = 0;
  NProgress.done();
};