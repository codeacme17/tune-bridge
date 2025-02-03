import { useEffect } from "react";

interface UseScrollParams {
  element: HTMLElement;
  onScroll?: (event: Event) => void;
}

export const useScroll = (params: UseScrollParams) => {
  const { element, onScroll } = params;

  useEffect(() => {
    if (!element) return;
    scrollToBottom();
  }, [element]);

  const scrollToTop = () => {
    if (!element) return;
    element.scrollTop = 0;
  };

  const scrollToBottom = () => {
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  };

  return { element, scrollToTop, scrollToBottom };
};
