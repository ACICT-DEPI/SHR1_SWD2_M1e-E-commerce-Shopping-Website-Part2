const emailTemplate = (resetLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9fafb;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333333;
        }
        p {
            color: #555555;
            font-size: 16px;
            line-height: 1.5;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #2563eb;
            color: #fff !important;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            color: #9ca3af;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" class="btn">Reset Password</a>
        <p>If you didn’t request a password reset, please ignore this email.</p>
        <div class="footer">
            <p>Thanks,</p>
            <p>Trade Sphere</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = emailTemplate;
