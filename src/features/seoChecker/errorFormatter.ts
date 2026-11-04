/**
 * Formats any caught error or API failure response into a human-readable, actionable message.
 * Completely prevents "[object Object]" from ever reaching the user.
 */
export function formatAuditErrorMessage(err: unknown): string {
  if (!err) {
    return 'An unexpected error occurred while auditing the website. Please check the address and try again.';
  }

  // 1. Direct string
  if (typeof err === 'string') {
    const trimmed = err.trim();
    if (trimmed && trimmed !== '[object Object]') {
      return mapTechnicalMessageToUserMessage(trimmed);
    }
    return 'The audit service returned an unformatted response. Please verify the website address.';
  }

  // 2. Standard Error instance
  if (err instanceof Error) {
    const msg = err.message ? err.message.trim() : '';
    if (msg && msg !== '[object Object]') {
      return mapTechnicalMessageToUserMessage(msg);
    }
  }

  // 3. Object with error, message, or details properties
  if (typeof err === 'object') {
    const obj = err as Record<string, any>;

    // Handle nested error object e.g. { error: { message: "..." } }
    if (obj.error) {
      if (typeof obj.error === 'string' && obj.error.trim() && obj.error !== '[object Object]') {
        return mapTechnicalMessageToUserMessage(obj.error.trim());
      }
      if (typeof obj.error === 'object' && obj.error !== null) {
        if (typeof obj.error.message === 'string' && obj.error.message.trim()) {
          return mapTechnicalMessageToUserMessage(obj.error.message.trim());
        }
      }
    }

    if (typeof obj.message === 'string' && obj.message.trim() && obj.message !== '[object Object]') {
      return mapTechnicalMessageToUserMessage(obj.message.trim());
    }

    if (typeof obj.details === 'string' && obj.details.trim() && obj.details !== '[object Object]') {
      return mapTechnicalMessageToUserMessage(obj.details.trim());
    }

    if (typeof obj.statusText === 'string' && obj.statusText.trim()) {
      return `Server returned HTTP ${obj.status || ''} ${obj.statusText}. Please verify the website is online.`;
    }
  }

  return 'We could not reach or analyze this website. Please check the address and try again.';
}

/**
 * Maps low-level network/runtime errors to clear, small-business-friendly guidance.
 */
function mapTechnicalMessageToUserMessage(technicalMsg: string): string {
  const lower = technicalMsg.toLowerCase();

  // Failed to fetch / network failure
  if (lower.includes('failed to fetch') || lower.includes('networkerror') || lower.includes('load failed')) {
    return 'Could not connect to the audit service. Please check your internet connection or verify the server is running.';
  }

  // JSON parse / HTML returned instead of JSON
  if (lower.includes('unexpected token') || lower.includes('json') || lower.includes('syntaxerror')) {
    return 'The audit service returned an unexpected response. The service may be restarting or temporarily busy.';
  }

  // SSRF / Restricted IP
  if (lower.includes('restricted') || lower.includes('private') || lower.includes('localhost') || lower.includes('metadata')) {
    return 'Access to private, local, or internal cloud network addresses is restricted for security. Please provide a public domain.';
  }

  // DNS / Resolution failure
  if (lower.includes('could not resolve hostname') || lower.includes('enotfound') || lower.includes('no ip addresses')) {
    return 'We could not find this website domain. Please check for spelling mistakes in the URL.';
  }

  // Timeout
  if (lower.includes('timed out') || lower.includes('timeout') || lower.includes('aborterror')) {
    return 'The website took too long to respond (timed out after 8 seconds). The server might be slow or blocking automated requests.';
  }

  // SSL / Certificate issues
  if (lower.includes('ssl') || lower.includes('cert') || lower.includes('tls') || lower.includes('unable to verify')) {
    return 'A secure SSL/TLS connection could not be established with this website. Check if the site has an active security certificate.';
  }

  // Connection refused / reset
  if (lower.includes('econnrefused') || lower.includes('econnreset') || lower.includes('connection refused')) {
    return 'The web server refused the connection. The website might be offline or undergoing maintenance.';
  }

  // HTTP status codes
  if (lower.includes('403') || lower.includes('forbidden') || lower.includes('cloudflare') || lower.includes('access denied')) {
    return 'Access to this website was blocked by its security firewall or Cloudflare protection.';
  }

  if (lower.includes('404') || lower.includes('not found')) {
    return 'The requested web page was not found (404). Please verify the link.';
  }

  if (lower.includes('500') || lower.includes('internal server error')) {
    return 'The target website server encountered an internal error (500) while processing the request.';
  }

  // Non-HTML content
  if (lower.includes('non-html') || lower.includes('content-type') || lower.includes('supported html')) {
    return 'The website did not return a supported HTML web page. Only public HTML websites can be audited.';
  }

  return technicalMsg;
}
