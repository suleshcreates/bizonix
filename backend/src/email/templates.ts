// ---------------------------------------------------------------------------
// Bizonix Email Templates â€” Premium Enterprise Edition
//
// Rules for email HTML compatibility:
//  â€¢ 100% inline styles only â€” Gmail strips <style> blocks entirely
//  â€¢ No @import, no Google Fonts â€” use system font stack
//  â€¢ Use bgcolor="" attribute on <table>/<td> alongside style="background"
//  â€¢ No CSS classes â€” use only style attributes
//  â€¢ No body padding â€” use wrapper table rows for spacing
//  â€¢ All widths use attributes AND style for Outlook compat
// ---------------------------------------------------------------------------

const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;

// Brand tokens
const C = {
  navy:        '#0B1F3A',
  navyDark:    '#071528',
  blue:        '#2F6BFF',
  blueMid:     '#1B6EF3',
  blueLight:   '#EEF3FF',
  blueBorder:  '#C7D9FF',
  teal:        '#2EC4B6',
  tealLight:   '#E8FAFA',
  tealBorder:  '#A7E8E4',
  green:       '#059669',
  greenLight:  '#ECFDF5',
  greenBorder: '#6EE7B7',
  amber:       '#D97706',
  amberLight:  '#FFFBEB',
  amberBorder: '#FCD34D',
  red:         '#DC2626',
  redLight:    '#FEF2F2',
  redBorder:   '#FECACA',
  bg:          '#F0F4F8',
  bgAlt:       '#F8FAFC',
  white:       '#FFFFFF',
  border:      '#E1E8F0',
  textPri:     '#0D1B2E',
  textSec:     '#4A5568',
  textMuted:   '#8896A8',
  footerBg:    '#F8FAFC',
};

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

function htmlDoc(body: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
  <title>Bizonix</title>
</head>
<body style="margin:0;padding:0;background-color:${C.bg};" bgcolor="${C.bg}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.bg};" bgcolor="${C.bg}">
    <tr><td style="padding:40px 16px;" align="center">

      <!-- Email Card -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
        style="max-width:600px;width:100%;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(11,31,58,0.14);">

        ${body}

      </table>
      <!-- /Email Card -->

    </td></tr>
  </table>
</body>
</html>`;
}

/** Top header bar with logo + optional subtitle */
function header(subtitle?: string): string {
  return `
  <!-- HEADER -->
  <tr>
    <td bgcolor="${C.navy}" style="background:linear-gradient(145deg,#0B1F3A 0%,#102d52 100%);padding:32px 40px;" align="left">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="vertical-align:middle;" width="48">
            <div style="width:44px;height:44px;background:linear-gradient(135deg,${C.blue} 0%,${C.teal} 100%);
              border-radius:12px;font-family:${FONT};font-size:24px;font-weight:900;color:#fff;
              text-align:center;line-height:44px;letter-spacing:-1px;">B</div>
          </td>
          <td style="vertical-align:middle;padding-left:14px;">
            <span style="font-family:${FONT};font-size:24px;font-weight:800;color:#FFFFFF;letter-spacing:-0.8px;display:block;line-height:1.1;">bizonix</span>
            ${subtitle ? `<span style="font-family:${FONT};font-size:11px;color:#8BAFC5;letter-spacing:1.5px;text-transform:uppercase;display:block;margin-top:2px;">${subtitle}</span>` : ''}
          </td>
          <td style="vertical-align:middle;text-align:right;">
            <span style="font-family:${FONT};font-size:10px;color:#4D7A9C;letter-spacing:1.2px;text-transform:uppercase;">OPERATIONS OS</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

/** Footer */
function footer(): string {
  const year = new Date().getFullYear();
  return `
  <!-- FOOTER -->
  <tr>
    <td bgcolor="${C.footerBg}" style="background-color:${C.footerBg};border-top:1px solid ${C.border};padding:28px 40px;" align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 16px auto;">
        <tr>
          <td>
            <div style="width:28px;height:28px;background:${C.navy};border-radius:8px;
              font-family:${FONT};font-size:14px;font-weight:900;color:#fff;
              text-align:center;line-height:28px;">B</div>
          </td>
        </tr>
      </table>
      <p style="font-family:${FONT};font-size:12px;color:${C.textMuted};margin:0 0 6px 0;line-height:1.6;font-weight:500;">
        &copy; ${year} Bizonix &middot; Fibonce Pvt. Ltd. &middot; Bengaluru, India
      </p>
      <p style="font-family:${FONT};font-size:11px;color:#B0BEC5;margin:0 0 14px 0;line-height:1.6;">
        This email was sent by the Bizonix team &middot; Please do not reply to this address
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="padding:0 10px;">
            <a href="https://bizonix.com" style="font-family:${FONT};font-size:11px;color:${C.blue};text-decoration:none;font-weight:600;">bizonix.com</a>
          </td>
          <td style="padding:0 10px;border-left:1px solid ${C.border};">
            <a href="mailto:sales@bizonix.com" style="font-family:${FONT};font-size:11px;color:${C.blue};text-decoration:none;font-weight:600;">sales@bizonix.com</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

/** Section divider */
function divider(): string {
  return `<tr><td style="padding:0 40px;"><div style="height:1px;background-color:${C.border};"></div></td></tr>`;
}

/** Data row for tables */
function dataRow(label: string, value: string): string {
  return `
  <tr>
    <td style="font-family:${FONT};font-size:11px;font-weight:700;color:${C.textMuted};
      padding:10px 0;border-bottom:1px solid ${C.border};width:36%;vertical-align:top;
      text-transform:uppercase;letter-spacing:0.6px;">${label}</td>
    <td style="font-family:${FONT};font-size:13px;font-weight:500;color:${C.textPri};
      padding:10px 0 10px 20px;border-bottom:1px solid ${C.border};vertical-align:top;line-height:1.5;">${value}</td>
  </tr>`;
}

/** Blue gradient CTA button */
function ctaButton(text: string, href: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
    <tr>
      <td bgcolor="${C.blue}" style="background:linear-gradient(135deg,${C.blue} 0%,#1a57e8 100%);border-radius:12px;" align="center">
        <a href="${href}" target="_blank"
          style="display:inline-block;padding:15px 40px;font-family:${FONT};
          font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;
          letter-spacing:0.3px;">${text} &nbsp;&rarr;</a>
      </td>
    </tr>
  </table>`;
}

/** Numbered step item */
function step(num: string, text: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;width:100%;">
    <tr>
      <td style="vertical-align:top;width:40px;">
        <div style="width:30px;height:30px;background:linear-gradient(135deg,${C.blue} 0%,${C.teal} 100%);border-radius:50%;
          font-family:${FONT};font-size:13px;font-weight:800;color:#fff;
          text-align:center;line-height:30px;">${num}</div>
      </td>
      <td style="vertical-align:middle;padding-left:12px;">
        <span style="font-family:${FONT};font-size:13px;color:${C.textSec};line-height:1.7;">${text}</span>
      </td>
    </tr>
  </table>`;
}

// ---------------------------------------------------------------------------
// Template 1 â€” Prospect Confirmation Email
// Sent to prospect immediately after form submission
// ---------------------------------------------------------------------------
export function buildConfirmationEmail(name: string, company: string): string {
  const body = `
  ${header('ERP &amp; Retail Solutions')}

  <!-- Hero section -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:48px 40px 32px 40px;" align="center">
      <!-- Checkmark circle -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px auto;">
        <tr>
          <td align="center" valign="middle" style="width:72px;height:72px;background-color:${C.greenLight};border-radius:50%;border:2px solid ${C.greenBorder};">
            <span style="font-size:32px;line-height:72px;display:block;">&#10003;</span>
          </td>
        </tr>
      </table>
      <h1 style="font-family:${FONT};font-size:28px;font-weight:800;color:${C.textPri};
        margin:0 0 10px 0;letter-spacing:-0.8px;line-height:1.2;">We&apos;ve got your request!</h1>
      <p style="font-family:${FONT};font-size:16px;color:${C.textSec};margin:0;line-height:1.7;">
        Hi <strong style="color:${C.textPri};">${name}</strong> &mdash; thanks for reaching out about
        <strong style="color:${C.blue};">${company}</strong>.
      </p>
    </td>
  </tr>

  <!-- Teal accent banner -->
  <tr>
    <td bgcolor="${C.tealLight}" style="background-color:${C.tealLight};border-top:2px solid ${C.teal};
      border-bottom:2px solid ${C.teal};padding:18px 40px;" align="center">
      <p style="font-family:${FONT};font-size:14px;font-weight:700;color:#1A7A73;margin:0;">
        &#127919; &nbsp;A Bizonix consultant will reach you within <strong>1&ndash;2 business days</strong> to arrange your personalised demo.
      </p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:36px 40px;" align="left">
      <p style="font-family:${FONT};font-size:15px;color:${C.textSec};line-height:1.9;margin:0 0 32px 0;">
        We&apos;ve carefully reviewed the details you submitted. Our solutions team will reach out to schedule
        a live Bizonix demo built specifically around your retail operations &mdash; no generic walkthroughs.
      </p>

      <!-- What happens next box -->
      <div style="background-color:${C.bg};border:1px solid ${C.border};border-left:4px solid ${C.blue};
        border-radius:12px;padding:26px 28px;margin-bottom:32px;">
        <p style="font-family:${FONT};font-size:10px;font-weight:800;color:${C.textMuted};
          letter-spacing:1.5px;text-transform:uppercase;margin:0 0 20px 0;">What Happens Next</p>
        ${step('1', 'Our team reviews your business requirements &amp; operating context')}
        ${step('2', 'We contact you to confirm a convenient demo date &amp; time')}
        ${step('3', 'You receive a live Bizonix walkthrough tailored to your industry')}
      </div>

      <!-- Support notice -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;" width="100%">
        <tr>
          <td style="background-color:${C.blueLight};border-radius:10px;padding:14px 18px;">
            <p style="font-family:${FONT};font-size:13px;color:${C.textSec};line-height:1.6;margin:0;">
              &#128172; &nbsp;Have urgent questions? Email us at
              <a href="mailto:sales@bizonix.com" style="color:${C.blue};font-weight:700;text-decoration:none;">sales@bizonix.com</a>
            </p>
          </td>
        </tr>
      </table>

      <!-- Signature -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:top;width:4px;padding-right:16px;">
            <div style="width:4px;height:58px;background:linear-gradient(to bottom,${C.blue},${C.teal});border-radius:2px;"></div>
          </td>
          <td style="vertical-align:top;">
            <p style="font-family:${FONT};font-size:14px;color:${C.textSec};margin:0 0 3px 0;">Warm regards,</p>
            <p style="font-family:${FONT};font-size:15px;font-weight:800;color:${C.textPri};margin:0 0 3px 0;">The Bizonix Sales Team</p>
            <a href="mailto:sales@bizonix.com" style="font-family:${FONT};font-size:12px;color:${C.blue};text-decoration:none;font-weight:600;">sales@bizonix.com</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${footer()}`;

  return htmlDoc(body);
}

// ---------------------------------------------------------------------------
// Template 2 â€” Internal Staff Alert Email
// Sent to the team inbox on every new enquiry
// ---------------------------------------------------------------------------
export function buildStaffAlertEmail(
  enquiry: {
    fullName: string; companyName: string; email: string;
    phone: string | null; city: string | null; outletCount: string | null;
    role: string | null; industry: string | null; timeline: string | null;
    priority: string; leadScore: number; message: string | null; intent: string | null;
  },
  adminUrl: string,
): string {
  const priorityConfig: Record<string, { bg: string; text: string; border: string; emoji: string }> = {
    URGENT: { bg: C.redLight,   text: C.red,   border: C.redBorder,   emoji: '&#128308;' },
    HIGH:   { bg: C.amberLight, text: C.amber, border: C.amberBorder, emoji: '&#128992;' },
    MEDIUM: { bg: C.blueLight,  text: C.blue,  border: C.blueBorder,  emoji: '&#128309;' },
    LOW:    { bg: C.greenLight, text: C.green, border: C.greenBorder, emoji: '&#128994;' },
  };
  const pc = priorityConfig[enquiry.priority] || priorityConfig.MEDIUM;

  const scorePercent = Math.min(100, Math.max(0, enquiry.leadScore));
  const scoreColor = scorePercent >= 70 ? C.green : scorePercent >= 40 ? C.amber : C.red;
  const barWidth = Math.round((scorePercent / 100) * 100);

  const body = `
  ${header('New Lead Alert')}

  <!-- Priority ribbon -->
  <tr>
    <td bgcolor="${pc.bg}" style="background-color:${pc.bg};border-top:4px solid ${pc.text};padding:16px 40px;" align="left">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td>
            <span style="font-family:${FONT};font-size:13px;font-weight:800;color:${pc.text};letter-spacing:0.5px;">
              ${pc.emoji} &nbsp;${enquiry.priority} PRIORITY LEAD
            </span>
            <span style="font-family:${FONT};font-size:12px;color:${C.textSec};margin-left:14px;">
              ${enquiry.intent || 'Demo Request'}
            </span>
          </td>
          <td align="right" style="vertical-align:middle;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="right">
                  <span style="font-family:${FONT};font-size:10px;color:${C.textMuted};display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Lead Score</span>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-left:auto;">
                    <tr>
                      <td style="vertical-align:middle;padding-right:8px;">
                        <div style="width:100px;height:8px;background-color:${C.border};border-radius:4px;overflow:hidden;">
                          <div style="width:${barWidth}px;height:8px;background-color:${scoreColor};border-radius:4px;"></div>
                        </div>
                      </td>
                      <td style="vertical-align:middle;">
                        <span style="font-family:${FONT};font-size:20px;font-weight:900;color:${scoreColor};line-height:1;">${scorePercent}</span>
                        <span style="font-family:${FONT};font-size:12px;color:${C.textMuted};">/100</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Contact headline -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:32px 40px 20px 40px;" align="left">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:top;width:52px;padding-right:16px;">
            <div style="width:52px;height:52px;background:linear-gradient(135deg,${C.blue} 0%,${C.teal} 100%);border-radius:50%;
              font-family:${FONT};font-size:22px;font-weight:800;color:#fff;
              text-align:center;line-height:52px;">${enquiry.fullName.charAt(0).toUpperCase()}</div>
          </td>
          <td style="vertical-align:top;">
            <h1 style="font-family:${FONT};font-size:22px;font-weight:800;color:${C.textPri};margin:0 0 4px 0;letter-spacing:-0.4px;">
              ${enquiry.fullName}
            </h1>
            <p style="font-family:${FONT};font-size:14px;color:${C.textSec};margin:0 0 5px 0;">
              ${enquiry.role || 'Not specified'} &nbsp;&middot;&nbsp; <strong style="color:${C.textPri};">${enquiry.companyName}</strong>
            </p>
            <p style="font-family:${FONT};font-size:13px;color:${C.blue};margin:0;">
              <a href="mailto:${enquiry.email}" style="color:${C.blue};text-decoration:none;font-weight:600;">${enquiry.email}</a>
              ${enquiry.phone ? ` &nbsp;&middot;&nbsp; <span style="color:${C.textSec};font-weight:500;">${enquiry.phone}</span>` : ''}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${divider()}

  <!-- Details table -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:22px 40px;" align="left">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${dataRow('Company', `<strong>${enquiry.companyName}</strong>`)}
        ${dataRow('City / Region', enquiry.city || '&mdash;')}
        ${dataRow('Industry', enquiry.industry || '&mdash;')}
        ${dataRow('Outlets / Scale', enquiry.outletCount || '&mdash;')}
        ${dataRow('Timeline', enquiry.timeline || '&mdash;')}
      </table>
    </td>
  </tr>

  ${enquiry.message ? `
  <!-- Prospect message -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:0 40px 28px 40px;" align="left">
      <div style="background-color:${C.bg};border:1px solid ${C.border};border-left:4px solid ${C.blue};
        border-radius:10px;padding:18px 22px;">
        <p style="font-family:${FONT};font-size:10px;font-weight:800;color:${C.textMuted};
          text-transform:uppercase;letter-spacing:1px;margin:0 0 10px 0;">Prospect Message</p>
        <p style="font-family:${FONT};font-size:13px;color:${C.textSec};line-height:1.8;margin:0;white-space:pre-wrap;">${enquiry.message}</p>
      </div>
    </td>
  </tr>` : ''}

  <!-- CTA -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:8px 40px 44px 40px;" align="center">
      ${ctaButton('Open in Admin Console', adminUrl)}
      <p style="font-family:${FONT};font-size:11px;color:${C.textMuted};margin:14px 0 0 0;">
        Review, assign, and respond from the Bizonix admin panel
      </p>
    </td>
  </tr>

  ${footer()}`;

  return htmlDoc(body);
}

// ---------------------------------------------------------------------------
// Template 3 â€” Prospect Reply Email
// Sent when admin replies from the enquiry detail panel
// ---------------------------------------------------------------------------
export function buildProspectReplyEmail(
  name: string,
  messageBody: string,
  demoDate?: Date,
): string {
  const demoBlock = demoDate
    ? `
    <!-- Demo confirmation card -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:28px 0;">
      <tr>
        <td style="background-color:${C.greenLight};border:2px solid ${C.greenBorder};
          border-radius:16px;padding:28px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;" width="100%">
            <tr>
              <td style="vertical-align:middle;width:48px;padding-right:14px;">
                <div style="width:44px;height:44px;background-color:${C.green};border-radius:12px;
                  font-size:24px;text-align:center;line-height:44px;">&#128197;</div>
              </td>
              <td style="vertical-align:middle;">
                <p style="font-family:${FONT};font-size:11px;font-weight:800;color:${C.green};
                  text-transform:uppercase;letter-spacing:1.4px;margin:0 0 2px 0;">Your Demo is Confirmed</p>
                <p style="font-family:${FONT};font-size:12px;color:#059669;margin:0;font-weight:500;">Add this to your calendar</p>
              </td>
            </tr>
          </table>
          <p style="font-family:${FONT};font-size:30px;font-weight:900;color:${C.textPri};
            margin:0 0 6px 0;letter-spacing:-1px;line-height:1.15;">
            ${demoDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p style="font-family:${FONT};font-size:20px;font-weight:600;color:${C.textSec};
            margin:0 0 18px 0;">
            ${demoDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} IST
          </p>
          <div style="background-color:#fff;border:1px solid ${C.greenBorder};border-radius:8px;padding:12px 16px;">
            <p style="font-family:${FONT};font-size:13px;color:${C.textSec};margin:0;line-height:1.6;">
              &#128231; &nbsp;We&apos;ll send you the meeting link before the session. Please add this to your calendar.
            </p>
          </div>
        </td>
      </tr>
    </table>` : '';

  // Convert plain line breaks into styled paragraphs
  const formattedBody = messageBody
    .split('\n')
    .filter(line => line.trim())
    .map(line => `<p style="font-family:${FONT};font-size:15px;color:${C.textSec};line-height:1.9;margin:0 0 14px 0;">${line}</p>`)
    .join('');

  const body = `
  ${header()}

  <!-- Greeting -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:40px 40px 8px 40px;" align="left">
      <p style="font-family:${FONT};font-size:16px;color:${C.textSec};margin:0 0 20px 0;line-height:1.8;">
        Hi <strong style="color:${C.textPri};">${name}</strong>,
      </p>
      ${formattedBody}
      ${demoBlock}
    </td>
  </tr>

  ${divider()}

  <!-- Signature block -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:28px 40px 40px 40px;" align="left">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="vertical-align:top;width:4px;padding-right:16px;">
            <div style="width:4px;height:58px;background:linear-gradient(to bottom,${C.blue},${C.teal});border-radius:2px;"></div>
          </td>
          <td style="vertical-align:top;">
            <p style="font-family:${FONT};font-size:14px;color:${C.textSec};margin:0 0 3px 0;">Warm regards,</p>
            <p style="font-family:${FONT};font-size:16px;font-weight:800;color:${C.textPri};margin:0 0 4px 0;">The Bizonix Sales Team</p>
            <a href="mailto:sales@bizonix.com" style="font-family:${FONT};font-size:12px;color:${C.blue};text-decoration:none;font-weight:600;">sales@bizonix.com</a>
          </td>
          <td style="vertical-align:middle;text-align:right;">
            <div style="width:40px;height:40px;background-color:${C.navy};border-radius:10px;
              font-family:${FONT};font-size:20px;font-weight:900;color:#fff;
              text-align:center;line-height:40px;display:inline-block;">B</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${footer()}`;

  return htmlDoc(body);
}

// ---------------------------------------------------------------------------
// Template 4 — Employee Deal Assignment & Credentials Email
// Sent to employee when an enquiry is assigned to them.
// If it's their first assignment, includes their login credentials.
// ---------------------------------------------------------------------------
export interface EmployeeAssignmentEmailOptions {
  enquiry: {
    id: string;
    fullName: string;
    companyName: string;
    email: string;
    phone?: string | null;
    city?: string | null;
    role?: string | null;
    industry?: string | null;
    outletCount?: string | null;
    currentSoftware?: string | null;
    timeline?: string | null;
    intent?: string | null;
    priority?: string;
    leadScore?: number;
    message?: string | null;
  };
  assignee: {
    displayName?: string | null;
    email: string;
    username?: string | null;
  };
  assignedBy: {
    email: string;
    displayName?: string | null;
  };
  adminUrl: string;
  loginUrl: string;
  isFirstAssignment: boolean;
  temporaryPassword?: string | null;
}

export function buildEmployeeAssignmentEmail(options: EmployeeAssignmentEmailOptions): string {
  const { enquiry, assignee, assignedBy, adminUrl, loginUrl, isFirstAssignment, temporaryPassword } = options;

  const priorityConfig: Record<string, { bg: string; text: string; border: string; emoji: string }> = {
    URGENT: { bg: C.redLight,   text: C.red,   border: C.redBorder,   emoji: '&#128308;' },
    HIGH:   { bg: C.amberLight, text: C.amber, border: C.amberBorder, emoji: '&#128992;' },
    MEDIUM: { bg: C.blueLight,  text: C.blue,  border: C.blueBorder,  emoji: '&#128309;' },
    LOW:    { bg: C.greenLight, text: C.green, border: C.greenBorder, emoji: '&#128994;' },
  };
  const pc = priorityConfig[enquiry.priority || 'MEDIUM'] || priorityConfig.MEDIUM;
  const scorePercent = Math.min(100, Math.max(0, enquiry.leadScore || 50));
  const scoreColor = scorePercent >= 70 ? C.green : scorePercent >= 40 ? C.amber : C.red;
  const barWidth = Math.round((scorePercent / 100) * 100);

  const assigneeName = assignee.displayName || assignee.email;
  const assignerName = assignedBy.displayName || assignedBy.email;

  const credentialsBlock = isFirstAssignment && temporaryPassword ? `
  <!-- CREDENTIALS ACTIVATION BOX -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:0 40px 24px 40px;" align="left">
      <div style="background-color:${C.navyDark};border:1px solid #1E3A5F;border-left:4px solid ${C.teal};
        border-radius:12px;padding:24px;box-shadow:0 4px 16px rgba(11,31,58,0.25);">
        
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="vertical-align:middle;width:36px;padding-right:12px;">
              <div style="width:36px;height:36px;background:linear-gradient(135deg,${C.blue} 0%,${C.teal} 100%);
                border-radius:8px;font-size:18px;text-align:center;line-height:36px;">&#128272;</div>
            </td>
            <td style="vertical-align:middle;">
              <span style="font-family:${FONT};font-size:15px;font-weight:800;color:#FFFFFF;display:block;">
                Your Staff Portal Credentials
              </span>
              <span style="font-family:${FONT};font-size:12px;color:#8BAFC5;display:block;margin-top:2px;">
                Use these credentials to sign in and manage your assigned accounts.
              </span>
            </td>
          </tr>
        </table>

        <div style="height:1px;background-color:#1E3A5F;margin:18px 0;"></div>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="font-family:${FONT};font-size:11px;font-weight:700;color:#8BAFC5;padding:6px 0;width:35%;text-transform:uppercase;letter-spacing:0.8px;">
              Portal URL
            </td>
            <td style="font-family:${FONT};font-size:13px;color:#FFFFFF;padding:6px 0;">
              <a href="${loginUrl}" target="_blank" style="color:#38BDF8;text-decoration:none;font-weight:600;">${loginUrl}</a>
            </td>
          </tr>
          <tr>
            <td style="font-family:${FONT};font-size:11px;font-weight:700;color:#8BAFC5;padding:6px 0;text-transform:uppercase;letter-spacing:0.8px;">
              Username
            </td>
            <td style="font-family:${FONT};font-size:13px;padding:6px 0;">
              <code style="background-color:#0F243E;color:#38BDF8;padding:4px 10px;border-radius:5px;font-family:Consolas,Monaco,monospace;font-size:13px;font-weight:700;border:1px solid #1E3A5F;">${assignee.username || assignee.email}</code>
            </td>
          </tr>
          <tr>
            <td style="font-family:${FONT};font-size:11px;font-weight:700;color:#8BAFC5;padding:6px 0;text-transform:uppercase;letter-spacing:0.8px;">
              Work Email
            </td>
            <td style="font-family:${FONT};font-size:13px;color:#CBD5E1;padding:6px 0;">
              ${assignee.email}
            </td>
          </tr>
          <tr>
            <td style="font-family:${FONT};font-size:11px;font-weight:700;color:#8BAFC5;padding:6px 0;text-transform:uppercase;letter-spacing:0.8px;">
              Temporary Password
            </td>
            <td style="font-family:${FONT};font-size:13px;padding:6px 0;">
              <code style="background-color:#0F243E;color:#34D399;padding:4px 10px;border-radius:5px;font-family:Consolas,Monaco,monospace;font-size:14px;font-weight:800;letter-spacing:1px;border:1px solid #1E3A5F;">${temporaryPassword}</code>
            </td>
          </tr>
        </table>

        <div style="background-color:#0F243E;border-radius:8px;padding:12px 14px;margin-top:16px;border:1px solid #1E3A5F;">
          <p style="font-family:${FONT};font-size:11px;color:#94A3B8;margin:0;line-height:1.6;">
            &#128161; &nbsp;<strong style="color:#E2E8F0;">Security Tip:</strong> You can log in using either your Username or your Work Email. Please update your password once logged in.
          </p>
        </div>

      </div>
    </td>
  </tr>` : '';

  const body = `
  ${header(isFirstAssignment ? 'Staff Activation & Deal Assignment' : 'Deal Assignment')}

  <!-- Priority ribbon -->
  <tr>
    <td bgcolor="${pc.bg}" style="background-color:${pc.bg};border-top:4px solid ${pc.text};padding:16px 40px;" align="left">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td>
            <span style="font-family:${FONT};font-size:13px;font-weight:800;color:${pc.text};letter-spacing:0.5px;">
              ${pc.emoji} &nbsp;${enquiry.priority || 'MEDIUM'} PRIORITY DEAL
            </span>
            <span style="font-family:${FONT};font-size:12px;color:${C.textSec};margin-left:14px;">
              ${enquiry.intent || 'Demo Request'}
            </span>
          </td>
          <td align="right" style="vertical-align:middle;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-left:auto;">
              <tr>
                <td style="vertical-align:middle;padding-right:8px;">
                  <div style="width:90px;height:8px;background-color:${C.border};border-radius:4px;overflow:hidden;">
                    <div style="width:${barWidth}px;height:8px;background-color:${scoreColor};border-radius:4px;"></div>
                  </div>
                </td>
                <td style="vertical-align:middle;">
                  <span style="font-family:${FONT};font-size:18px;font-weight:900;color:${scoreColor};line-height:1;">${scorePercent}</span>
                  <span style="font-family:${FONT};font-size:11px;color:${C.textMuted};">/100</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Intro greeting -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:36px 40px 16px 40px;" align="left">
      <p style="font-family:${FONT};font-size:16px;color:${C.textPri};margin:0 0 10px 0;line-height:1.6;">
        Hello <strong style="color:${C.navy};">${assigneeName}</strong>,
      </p>
      <p style="font-family:${FONT};font-size:14px;color:${C.textSec};margin:0 0 20px 0;line-height:1.8;">
        ${isFirstAssignment
          ? `A new business deal has been assigned to you by <strong style="color:${C.textPri};">${assignerName}</strong>, and your Bizonix staff account has been activated.`
          : `A new client deal has been assigned to you by <strong style="color:${C.textPri};">${assignerName}</strong>.`
        }
      </p>
    </td>
  </tr>

  ${credentialsBlock}

  <!-- Prospect Dossier Header -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:8px 40px 16px 40px;" align="left">
      <h3 style="font-family:${FONT};font-size:11px;font-weight:800;color:${C.textMuted};text-transform:uppercase;letter-spacing:1px;margin:0 0 14px 0;">
        Prospect Dossier
      </h3>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${dataRow('Company', `<strong>${enquiry.companyName}</strong>`)}
        ${dataRow('Prospect Name', enquiry.fullName)}
        ${dataRow('Email Address', `<a href="mailto:${enquiry.email}" style="color:${C.blue};text-decoration:none;font-weight:600;">${enquiry.email}</a>`)}
        ${dataRow('Phone', enquiry.phone || '&mdash;')}
        ${dataRow('City / Location', enquiry.city || '&mdash;')}
        ${dataRow('Role / Title', enquiry.role || '&mdash;')}
        ${dataRow('Industry', enquiry.industry || '&mdash;')}
        ${dataRow('Outlet Scale', enquiry.outletCount || '&mdash;')}
        ${dataRow('Timeline', enquiry.timeline || '&mdash;')}
        ${dataRow('Current Software', enquiry.currentSoftware || '&mdash;')}
      </table>
    </td>
  </tr>

  ${enquiry.message ? `
  <!-- Prospect Note -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:0 40px 24px 40px;" align="left">
      <div style="background-color:${C.bg};border:1px solid ${C.border};border-left:4px solid ${C.blue};
        border-radius:10px;padding:16px 20px;">
        <p style="font-family:${FONT};font-size:10px;font-weight:800;color:${C.textMuted};
          text-transform:uppercase;letter-spacing:1px;margin:0 0 8px 0;">Prospect Note</p>
        <p style="font-family:${FONT};font-size:13px;color:${C.textSec};line-height:1.7;margin:0;white-space:pre-wrap;">${enquiry.message}</p>
      </div>
    </td>
  </tr>` : ''}

  <!-- Action CTA -->
  <tr>
    <td bgcolor="${C.white}" style="background-color:${C.white};padding:12px 40px 40px 40px;" align="center">
      ${ctaButton('Open Assigned Deal in CRM', adminUrl)}
      ${isFirstAssignment ? `
      <p style="font-family:${FONT};font-size:12px;color:${C.textMuted};margin:16px 0 0 0;">
        Or go directly to <a href="${loginUrl}" target="_blank" style="color:${C.blue};font-weight:600;text-decoration:none;">Portal Login &rarr;</a>
      </p>` : ''}
    </td>
  </tr>

  ${footer()}`;

  return htmlDoc(body);
}

