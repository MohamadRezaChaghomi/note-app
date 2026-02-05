import nodemailer from 'nodemailer';

/**
 * Mail Service for handling email operations
 */
class MailService {
  constructor() {
    // Create reusable transporter object using SMTP transport
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
    } catch (error) {
      // SMTP connection verification failed - will use simulated mode
    }
  }

  /**
   * Send verification code email
   */
  async sendVerificationCode(email, code, name = null) {
    const mailOptions = {
      from: `"Web Notes" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@webnotes.com'}>`,
      to: email,
      subject: 'کد تایید حساب Web Notes',
      text: this.generateVerificationText(code, name),
      html: this.generateVerificationHtml(code, name),
    };

    return await this.send(mailOptions);
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email, resetLink, name = null) {
    const mailOptions = {
      from: `"Web Notes" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@webnotes.com'}>`,
      to: email,
      subject: 'بازنشانی رمز عبور Web Notes',
      text: this.generateResetText(resetLink, name),
      html: this.generateResetHtml(resetLink, name),
    };

    return await this.send(mailOptions);
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: `"Web Notes" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@webnotes.com'}>`,
      to: email,
      subject: 'خوش آمدید به Web Notes!',
      text: this.generateWelcomeText(name),
      html: this.generateWelcomeHtml(name),
    };

    return await this.send(mailOptions);
  }

  /**
   * Send account security alert
   */
  async sendSecurityAlert(email, action, deviceInfo = null) {
    const mailOptions = {
      from: `"Web Notes Security" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@webnotes.com'}>`,
      to: email,
      subject: 'هشدار امنیتی حساب Web Notes',
      text: this.generateSecurityAlertText(action, deviceInfo),
      html: this.generateSecurityAlertHtml(action, deviceInfo),
    };

    return await this.send(mailOptions);
  }

  /**
   * Generic email sending method
   */
  async send(mailOptions) {
    // In development mode without SMTP, simulate email sending
    if (process.env.NODE_ENV === 'development' && (!process.env.SMTP_HOST || !process.env.SMTP_USER)) {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        messageId: 'simulated-' + Date.now(),
        accepted: [mailOptions.to],
        rejected: [],
        envelopeTime: 100,
        messageTime: 200,
        response: '250 2.0.0 OK - Email simulated in development'
      };
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      // If SMTP fails in production, throw the error
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Failed to send email');
      }
      
      // In development, simulate success if SMTP fails
      return {
        messageId: 'simulated-' + Date.now(),
        accepted: [mailOptions.to],
        rejected: [],
        envelopeTime: 100,
        messageTime: 200,
        response: '250 2.0.0 OK - Email simulated due to SMTP failure'
      };
    }
  }

  /**
   * Generate verification email text content
   */
  generateVerificationText(code, name = null) {
    const greeting = name ? `سلام ${name} عزیز،` : 'سلام،';
    
    return `
${greeting}

برای تکمیل فرآیند ثبت‌نام یا ورود به حساب Web Notes، کد تایید زیر را وارد کنید:

🔐 کد تایید: ${code}

⚠️ توجه: این کد تنها ۱۰ دقیقه اعتبار دارد.
🔒 لطفاً این کد را با هیچکس به اشتراک نگذارید.

اگر شما درخواست این کد را نداده‌اید، لطفاً این ایمیل را نادیده بگیرید.

با تشکر،
تیم پشتیبانی Web Notes
    `.trim();
  }

  /**
   * Generate verification email HTML content
   */
  generateVerificationHtml(code, name = null) {
    const greeting = name ? `سلام ${name} عزیز،` : 'سلام،';
    
    return `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>کد تایید Web Notes</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        .code {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            font-size: 32px;
            font-weight: bold;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            letter-spacing: 8px;
            margin: 30px 0;
            direction: ltr;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Web Notes</h1>
            <p>کد تایید حساب کاربری</p>
        </div>
        <div class="content">
            <h2>${greeting}</h2>
            <p>برای تکمیل فرآیند ثبت‌نام یا ورود به حساب Web Notes، کد تایید زیر را وارد کنید:</p>
            
            <div class="code">${code}</div>
            
            <div class="warning">
                <strong>⚠️ توجه:</strong>
                <ul>
                    <li>این کد تنها ۱۰ دقیقه اعتبار دارد</li>
                    <li>لطفاً این کد را با هیچکس به اشتراک نگذارید</li>
                </ul>
            </div>
            
            <p>اگر شما درخواست این کد را نداده‌اید، لطفاً این ایمیل را نادیده بگیرید.</p>
        </div>
        <div class="footer">
            <p>با تشکر،<br>تیم پشتیبانی Web Notes</p>
            <p>© ${new Date().getFullYear()} Web Notes. تمام حقوق محفوظ است.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate password reset email text content
   */
  generateResetText(resetLink, name = null) {
    const greeting = name ? `سلام ${name} عزیز،` : 'سلام،';
    
    return `
${greeting}

برای بازنشانی رمز عبور حساب Web Notes خود، روی لینک زیر کلیک کنید:

🔗 لینک بازنشانی: ${resetLink}

⚠️ توجه: این لینک تنها ۱ ساعت اعتبار دارد.
🔒 اگر شما درخواست بازنشانی رمز عبور نداده‌اید، لطفاً این ایمیل را نادیده بگیرید.

با تشکر،
تیم پشتیبانی Web Notes
    `.trim();
  }

  /**
   * Generate password reset email HTML content
   */
  generateResetHtml(resetLink, name = null) {
    const greeting = name ? `سلام ${name} عزیز،` : 'سلام،';
    
    return `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بازنشانی رمز عبور Web Notes</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
            font-size: 18px;
        }
        .link {
            word-break: break-all;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            direction: ltr;
            text-align: left;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Web Notes</h1>
            <p>بازنشانی رمز عبور</p>
        </div>
        <div class="content">
            <h2>${greeting}</h2>
            <p>برای بازنشانی رمز عبور حساب Web Notes خود، روی دکمه زیر کلیک کنید:</p>
            
            <div style="text-align: center;">
                <a href="${resetLink}" class="button">بازنشانی رمز عبور</a>
            </div>
            
            <p>یا لینک زیر را در مرورگر خود کپی کنید:</p>
            <div class="link">${resetLink}</div>
            
            <div class="warning">
                <strong>⚠️ توجه:</strong>
                <ul>
                    <li>این لینک تنها ۱ ساعت اعتبار دارد</li>
                    <li>اگر شما درخواست بازنشانی رمز عبور نداده‌اید، لطفاً این ایمیل را نادیده بگیرید</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>با تشکر،<br>تیم پشتیبانی Web Notes</p>
            <p>© ${new Date().getFullYear()} Web Notes. تمام حقوق محفوظ است.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate welcome email text content
   */
  generateWelcomeText(name) {
    return `
سلام ${name} عزیز،

به Web Notes خوش آمدید! 🎉

ما خوشحالیم که شما به جامعه کاربران Web Notes پیوسته‌اید. اکنون می‌توانید:

📝 یادداشت‌های خود را ایجاد و سازماندهی کنید
🔒 اطلاعات خود را با امنیت بالا ذخیره کنید
📱 از هر دستگاهی به یادداشت‌های خود دسترسی داشته باشید
🤝 یادداشت‌ها را با دیگران به اشتراک بگذارید

اگر سوالی دارید یا به کمک نیاز دارید، تیم پشتیبانی ما همیشه آماده کمک است.

شروع کنید:
۱. اولین یادداشت خود را ایجاد کنید
۲. پوشه‌ها و برچسب‌های خود را سازماندهی کنید
۳. تنظیمات حساب خود را شخصی‌سازی کنید

با تشکر برای انتخاب Web Notes،

با احترام،
تیم Web Notes
    `.trim();
  }

  /**
   * Generate welcome email HTML content
   */
  generateWelcomeHtml(name) {
    return `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>خوش آمدید به Web Notes!</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 30px 0;
        }
        .feature {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 خوش آمدید!</h1>
            <p>به Web Notes خوش آمدید ${name} عزیز</p>
        </div>
        <div class="content">
            <h2>سلام ${name}،</h2>
            <p>ما خوشحالیم که شما به جامعه کاربران Web Notes پیوسته‌اید. اکنون می‌توانید:</p>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">📝</div>
                    <p>یادداشت‌های خود را ایجاد و سازماندهی کنید</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <p>اطلاعات خود را با امنیت بالا ذخیره کنید</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">📱</div>
                    <p>از هر دستگاهی به یادداشت‌های خود دسترسی داشته باشید</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🤝</div>
                    <p>یادداشت‌ها را با دیگران به اشتراک بگذارید</p>
                </div>
            </div>
            
            <h3>شروع کنید:</h3>
            <ol>
                <li>اولین یادداشت خود را ایجاد کنید</li>
                <li>پوشه‌ها و برچسب‌های خود را سازماندهی کنید</li>
                <li>تنظیمات حساب خود را شخصی‌سازی کنید</li>
            </ol>
            
            <p>اگر سوالی دارید یا به کمک نیاز دارید، تیم پشتیبانی ما همیشه آماده کمک است.</p>
        </div>
        <div class="footer">
            <p>با تشکر برای انتخاب Web Notes،</p>
            <p>با احترام،<br>تیم Web Notes</p>
            <p>© ${new Date().getFullYear()} Web Notes. تمام حقوق محفوظ است.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate security alert email text content
   */
  generateSecurityAlertText(action, deviceInfo = null) {
    const actionText = {
      'login': 'ورود جدید به حساب',
      'password_change': 'تغییر رمز عبور',
      'email_change': 'تغییر ایمیل',
      '2fa_enabled': 'فعال‌سازی تأیید دو مرحله‌ای',
      '2fa_disabled': 'غیرفعال‌سازی تأیید دو مرحله‌ای',
    }[action] || action;

    let deviceText = '';
    if (deviceInfo) {
      deviceText = `
📱 دستگاه: ${deviceInfo.browser || 'نامشخص'} - ${deviceInfo.os || 'نامشخص'}
📍 موقعیت: ${deviceInfo.location || 'نامشخص'}
🕐 زمان: ${new Date().toLocaleString('fa-IR')}
      `;
    }

    return `
هشدار امنیتی حساب Web Notes

یک فعالیت جدید در حساب شما شناسایی شد:

⚠️ فعالیت: ${actionText}
${deviceText}

اگر این فعالیت توسط شما انجام نشده است، لطفاً فوراً:
۱. رمز عبور خود را تغییر دهید
۲. حساب خود را از دستگاه‌های ناشناس خارج کنید
۳. با پشتیبانی تماس بگیرید

اگر این فعالیت توسط شما انجام شده است، می‌توانید این ایمیل را نادیده بگیرید.

با احترام،
تیم امنیتی Web Notes
    `.trim();
  }

  /**
   * Generate security alert email HTML content
   */
  generateSecurityAlertHtml(action, deviceInfo = null) {
    const actionText = {
      'login': 'ورود جدید به حساب',
      'password_change': 'تغییر رمز عبور',
      'email_change': 'تغییر ایمیل',
      '2fa_enabled': 'فعال‌سازی تأیید دو مرحله‌ای',
      '2fa_disabled': 'غیرفعال‌سازی تأیید دو مرحله‌ای',
    }[action] || action;

    let deviceHtml = '';
    if (deviceInfo) {
      deviceHtml = `
        <div class="info-item">
            <strong>📱 دستگاه:</strong> ${deviceInfo.browser || 'نامشخص'} - ${deviceInfo.os || 'نامشخص'}
        </div>
        <div class="info-item">
            <strong>📍 موقعیت:</strong> ${deviceInfo.location || 'نامشخص'}
        </div>
        <div class="info-item">
            <strong>🕐 زمان:</strong> ${new Date().toLocaleString('fa-IR')}
        </div>
      `;
    }

    return `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>هشدار امنیتی Web Notes</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        .alert {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            color: #856404;
        }
        .info-item {
            margin: 10px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .actions {
            background: #f8d7da;
            border: 2px solid #f5c6cb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            color: #721c24;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 هشدار امنیتی</h1>
            <p>فعالیت جدید در حساب Web Notes شما</p>
        </div>
        <div class="content">
            <h2>یک فعالیت جدید در حساب شما شناسایی شد:</h2>
            
            <div class="alert">
                <strong>⚠️ فعالیت:</strong> ${actionText}
            </div>
            
            ${deviceHtml}
            
            <div class="actions">
                <h3>اگر این فعالیت توسط شما انجام نشده است:</h3>
                <ol>
                    <li>رمز عبور خود را فوراً تغییر دهید</li>
                    <li>حساب خود را از دستگاه‌های ناشناس خارج کنید</li>
                    <li>با پشتیبانی تماس بگیرید</li>
                </ol>
            </div>
            
            <p>اگر این فعالیت توسط شما انجام شده است، می‌توانید این ایمیل را نادیده بگیرید.</p>
        </div>
        <div class="footer">
            <p>با احترام،<br>تیم امنیتی Web Notes</p>
            <p>© ${new Date().getFullYear()} Web Notes. تمام حقوق محفوظ است.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }
}

// Create and export a singleton instance
const mailService = new MailService();

// Export individual functions for backward compatibility
export const sendMail = async (options) => {
  return await mailService.send(options);
};

export const sendVerificationCode = async (email, code, name) => {
  return await mailService.sendVerificationCode(email, code, name);
};

export const sendPasswordReset = async (email, resetLink, name) => {
  return await mailService.sendPasswordReset(email, resetLink, name);
};

export const sendWelcomeEmail = async (email, name) => {
  return await mailService.sendWelcomeEmail(email, name);
};

export const sendSecurityAlert = async (email, action, deviceInfo) => {
  return await mailService.sendSecurityAlert(email, action, deviceInfo);
};

// Export the service instance as default
export default mailService;