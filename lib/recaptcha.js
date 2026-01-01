/**
 * reCAPTCHA Verification Service
 */

class RecaptchaService {
  constructor() {
    this.secretKey = process.env.RECAPTCHA_SECRET_KEY;
    this.minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE) || 0.5;
    this.enabled = process.env.ENABLE_RECAPTCHA !== "false";
  }

  async verify(token, expectedAction = null) {
    // Skip verification in development if not forced
    if (process.env.NODE_ENV === "development" && process.env.FORCE_RECAPTCHA !== "true") {
      console.warn("reCAPTCHA verification skipped in development mode");
      return {
        success: true,
        score: 0.9,
        action: expectedAction || "development",
        timestamp: new Date().toISOString(),
        isDevelopment: true,
      };
    }

    // Check if reCAPTCHA is enabled
    if (!this.enabled) {
      return {
        success: true,
        score: 1.0,
        action: expectedAction || "disabled",
        timestamp: new Date().toISOString(),
        isDisabled: true,
      };
    }

    // Validate token
    if (!token || token === "development_token") {
      return {
        success: false,
        error: "No reCAPTCHA token provided",
        score: 0,
      };
    }

    // Validate secret key
    if (!this.secretKey) {
      console.error("RECAPTCHA_SECRET_KEY is not configured");
      return {
        success: false,
        error: "Server configuration error",
        score: 0,
      };
    }

    try {
      const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: this.secretKey,
          response: token,
        }),
      });

      const data = await response.json();

      // Check for errors
      if (data["error-codes"]?.length > 0) {
        console.error("reCAPTCHA errors:", data["error-codes"]);
        return {
          success: false,
          score: data.score || 0,
          error: "Verification failed",
          errorCodes: data["error-codes"],
          timestamp: data.challenge_ts,
        };
      }

      // Verify action (if expected action provided)
      if (expectedAction && data.action !== expectedAction) {
        console.warn(`reCAPTCHA action mismatch: expected ${expectedAction}, got ${data.action}`);
        return {
          success: false,
          score: data.score,
          action: data.action,
          expectedAction,
          error: "Action mismatch",
          timestamp: data.challenge_ts,
        };
      }

      // Verify score threshold
      const isHuman = data.success && data.score >= this.minScore;

      return {
        success: isHuman,
        score: data.score || 0,
        action: data.action,
        hostname: data.hostname,
        timestamp: data.challenge_ts,
        threshold: this.minScore,
        isAboveThreshold: data.score >= this.minScore,
      };

    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      return {
        success: false,
        error: "Verification service unavailable",
        details: error.message,
        score: 0,
      };
    }
  }

  isConfigured() {
    return !!this.secretKey && this.enabled;
  }

  getConfig() {
    return {
      enabled: this.enabled,
      configured: !!this.secretKey,
      minScore: this.minScore,
      environment: process.env.NODE_ENV,
    };
  }
}

const recaptchaService = new RecaptchaService();
export { RecaptchaService, recaptchaService };
export default recaptchaService;