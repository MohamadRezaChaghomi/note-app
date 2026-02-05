/**
 * Generate a simple CAPTCHA challenge
 * This is a placeholder for captcha generation
 */
export function generateCaptcha() {
  // Generate random captcha code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return {
    code,
    id: Math.random().toString(36).substring(2, 15)
  };
}

/**
 * Verify a CAPTCHA response
 */
export function verifyCaptcha(code, userInput) {
  return code?.toUpperCase() === userInput?.toUpperCase();
}
