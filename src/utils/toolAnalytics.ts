type Tool = 'case-converter' | 'date-calculator' | 'pdf-compress' | 'word-counter' | 'zodiac-finder';
type EventName = 'tool_start' | 'tool_complete' | 'tool_error' | 'result_copy' | 'download_click';
type Details = {
  error_type?: 'clipboard_unavailable' | 'pdf_processing';
  size_change?: 'smaller' | 'same' | 'larger';
};

declare global {
  interface Window {
    gtag?: (command: 'event', name: EventName, params: object) => void;
  }
}

// Call with stable operation identifiers only. User text, dates and file metadata stay local.
export function toolAnalytics(tool: Tool) {
  return (name: EventName, operation: string, details?: Details) => {
    window.gtag?.('event', name, {
      tool_slug: tool,
      page_language: document.documentElement.lang.startsWith('zh') ? 'zh' : 'en',
      operation,
      ...details,
    });
  };
}
