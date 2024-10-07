const emailTemplate = (resetLink) => `
<div style="display: none; max-height: 0; overflow: hidden;">Use this link to reset your password. Don't miss out!</div>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333;">Password Reset Request</h2>
        <p style="color: #555555; font-size: 16px; line-height: 1.5;">Click the button below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #fff !important; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px; margin-top: 20px;">Reset Password</a>
        <p style="color: #555555; font-size: 16px; line-height: 1.5;">If you didn’t request a password reset, please ignore this email.</p>
        <div class="footer" style="color: #9ca3af; margin-top: 20px;">
            <p>Thanks,</p>
            <p>Trade Sphere</p>
        </div>
    </div>
</div>
`;

module.exports = emailTemplate;
