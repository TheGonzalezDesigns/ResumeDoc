type HTML = string;

/**
 * Report interface to hold the HTML snippet and its types.
 */
export interface Report {
  HTML_snippet: HTML;
  types: HTML_Type[];
}

/**
 * Enumeration for HTML types.
 */
export enum HTML_Type {
  Legal = 0,
  Personal = 1,
  Basic = 2,
  Generated = 3,
}

/**
 * Function to analyze the HTML snippet and identify its types.
 * @param {HTML} HTML_snippet - The HTML snippet to analyze.
 * @returns {Report} - The report containing the original HTML snippet and identified types.
 */
export const HTML_assistant = (HTML_snippet: HTML): Report => {
  let report: Report = {
    HTML_snippet,
    types: [],
  };

  const legalPattern = /<input type="(?:radio|checkbox)">/g;
  const basicPattern = /<input type="(?:email|tel|url|time)">/g;
  const personalPattern = /<input type="text">/g;
  const generatedPattern = /<input type="(?:week|month|date|datetime-local)">/g;

  if (legalPattern.test(HTML_snippet)) {
    report.types.push(HTML_Type.Legal);
  }
  if (basicPattern.test(HTML_snippet)) {
    report.types.push(HTML_Type.Basic);
  }
  if (personalPattern.test(HTML_snippet)) {
    report.types.push(HTML_Type.Personal);
  }
  if (generatedPattern.test(HTML_snippet)) {
    report.types.push(HTML_Type.Generated);
  }

  return report;
};
