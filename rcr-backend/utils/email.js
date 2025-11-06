import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send email
 * @param {Object} options - Email options
 * @returns {Promise<Object>} Email send result
 */
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"Rwanda Cancer Relief" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

/**
 * Send session reminder email
 * @param {Object} session - Session object
 * @param {Object} patient - Patient user object
 * @param {Object} counselor - Counselor user object
 */
export const sendSessionReminder = async (session, patient, counselor) => {
  try {
    const sessionDate = new Date(session.scheduledDate);
    const formattedDate = sessionDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = session.scheduledTime;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .session-info { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Session Reminder</h1>
          </div>
          <div class="content">
            <p>Dear ${patient.profile?.firstName || 'Patient'},</p>
            <p>This is a reminder about your upcoming counseling session.</p>
            <div class="session-info">
              <h3>Session Details:</h3>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime}</p>
              <p><strong>Duration:</strong> ${session.duration} minutes</p>
              <p><strong>Counselor:</strong> ${counselor.profile?.firstName || ''} ${counselor.profile?.lastName || ''}</p>
            </div>
            <p>Please ensure you are available at the scheduled time. If you need to reschedule, please contact your counselor.</p>
            <p>Best regards,<br>Rwanda Cancer Relief Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Session Reminder
      
      Dear ${patient.profile?.firstName || 'Patient'},
      
      This is a reminder about your upcoming counseling session.
      
      Session Details:
      Date: ${formattedDate}
      Time: ${formattedTime}
      Duration: ${session.duration} minutes
      Counselor: ${counselor.profile?.firstName || ''} ${counselor.profile?.lastName || ''}
      
      Please ensure you are available at the scheduled time.
      
      Best regards,
      Rwanda Cancer Relief Team
    `;

    await sendEmail({
      to: patient.email,
      subject: 'Session Reminder - Rwanda Cancer Relief',
      html,
      text
    });
  } catch (error) {
    console.error('Error sending session reminder:', error);
    throw error;
  }
};

/**
 * Send approval notification email
 * @param {Object} user - User object
 * @param {Object} profile - Profile object
 */
export const sendApprovalNotification = async (user, profile) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Approved</h1>
          </div>
          <div class="content">
            <p>Dear ${profile.firstName} ${profile.lastName},</p>
            <p>Great news! Your account has been approved by our admin team.</p>
            <p>You can now log in to your account and start using the Rwanda Cancer Relief platform.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">Login to Your Account</a>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>Rwanda Cancer Relief Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Account Approved
      
      Dear ${profile.firstName} ${profile.lastName},
      
      Great news! Your account has been approved by our admin team.
      
      You can now log in to your account and start using the Rwanda Cancer Relief platform.
      
      Login: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login
      
      Best regards,
      Rwanda Cancer Relief Team
    `;

    await sendEmail({
      to: user.email,
      subject: 'Account Approved - Rwanda Cancer Relief',
      html,
      text
    });
  } catch (error) {
    console.error('Error sending approval notification:', error);
    throw error;
  }
};

/**
 * Send rejection notification email
 * @param {Object} user - User object
 * @param {Object} profile - Profile object
 * @param {string} reason - Rejection reason
 */
export const sendRejectionNotification = async (user, profile, reason) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .reason-box { background-color: #fff3cd; padding: 15px; margin: 15px 0; border-left: 4px solid #ffc107; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Application Status</h1>
          </div>
          <div class="content">
            <p>Dear ${profile.firstName} ${profile.lastName},</p>
            <p>We regret to inform you that your account application has not been approved at this time.</p>
            ${reason ? `<div class="reason-box"><strong>Reason:</strong> ${reason}</div>` : ''}
            <p>If you believe this is an error or would like to reapply, please contact our support team.</p>
            <p>Best regards,<br>Rwanda Cancer Relief Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Account Application Status
      
      Dear ${profile.firstName} ${profile.lastName},
      
      We regret to inform you that your account application has not been approved at this time.
      
      ${reason ? `Reason: ${reason}` : ''}
      
      If you believe this is an error or would like to reapply, please contact our support team.
      
      Best regards,
      Rwanda Cancer Relief Team
    `;

    await sendEmail({
      to: user.email,
      subject: 'Account Application Status - Rwanda Cancer Relief',
      html,
      text
    });
  } catch (error) {
    console.error('Error sending rejection notification:', error);
    throw error;
  }
};

export default transporter;

