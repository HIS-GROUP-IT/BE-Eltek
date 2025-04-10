import { AWS_REGION } from "@/config"; // Ensure the AWS_REGION is correctly imported
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Create SES client instance
const ses = new SESClient({ region: AWS_REGION });

async function sendEmail() {
  const params = {
    Destination: {
      ToAddresses: ["kwanelendaba69@gmail.com"],
    },
    Message: {
      Body: {
        Text: {
          Data: "Hello Kwanele! 🚀 This is a test email from exxarofund.com using AWS SES.",
        },
      },
      Subject: {
        Data: "Test Email from Exxarofund.com",
      },
    },
    Source: "noreply@exxarofund.com", 
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await ses.send(command);
    console.log("Email sent successfully!", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

sendEmail();
