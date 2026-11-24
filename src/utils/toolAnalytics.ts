export type SearchSurface = 'home' | 'header';
type SearchEvent = 'tool_search' | 'search_result_select';
type EventName = 'tool_start' | 'tool_complete' | 'tool_error' | 'result_copy' | 'download_click';
type Details = {
  error_type?: 'clipboard_unavailable' | 'image_processing' | 'pdf_processing';
  size_change?: 'smaller' | 'same' | 'larger';
};

declare global {
  interface Window {
    toolSearchSurface?: SearchSurface;
    gtag?: (command: 'event', name: EventName | SearchEvent | 'home_feature_select', params: object) => void;
  }
}

export function emitSearch(name: SearchEvent, params: {
  page_language: string; search_surface: SearchSurface; tool_slug?: string; result_count?: number;
}) {
  window.gtag?.('event', name, params);
}

// Call with stable operation identifiers only. User text, dates and file metadata stay local.
export function toolAnalytics(tool: string) {
  return (name: EventName, operation: string, details?: Details) => {
    window.gtag?.('event', name, {
      tool_slug: tool,
      page_language: document.documentElement.lang.startsWith('zh') ? 'zh' : 'en',
      operation,
      ...(window.toolSearchSurface && { search_surface: window.toolSearchSurface }),
      ...details,
    });
  };
}
