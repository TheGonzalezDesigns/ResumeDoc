enum HTML_Type {
  Legal = 0,
  Personal = 1,
  Basic = 2,
  Mixed = 3,
}

type HTML = string;

export interface Report {
  HTML_snippet: HTML;
  type: HTML_Type;
}

export const HTML_assistant = (HTML_snippet: HTML): Report => {
  let report: Report = {
    HTML_snippet,
    type: HTML_Type.Mixed,
  };

  const legalPattern = /<input type="(?:radio|checkbox)">/g;
  const basicPattern = /<input type="(?:email|tel|url|time)">/g;
  const personalPattern = /<input type="text">/g;
  const generatedPattern = /<input type="(?:week|month|date|datetime-local)">/g;

  const isLegal = legalPattern.test(HTML_snippet);
  const isBasic = basicPattern.test(HTML_snippet);
  const isPersonal = personalPattern.test(HTML_snippet);
  const isGenerated = generatedPattern.test(HTML_snippet);

  if (isLegal && !isBasic && !isPersonal && !isGenerated) {
    report.type = HTML_Type.Legal;
  } else if (!isLegal && isBasic && !isPersonal && !isGenerated) {
    report.type = HTML_Type.Basic;
  } else if (!isLegal && !isBasic && isPersonal && !isGenerated) {
    report.type = HTML_Type.Personal;
  } else {
    report.type = HTML_Type.Mixed;
  }

  return report;
};
