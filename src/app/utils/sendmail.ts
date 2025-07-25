import sgMail, { MailDataRequired } from "@sendgrid/mail";

interface SendEmailOptions {
  to: string;
  subject: string;
  templateId: string;
  dynamicData?: Record<string, any>;
}

export async function sendEmail({ to, subject, templateId, dynamicData = {} }: SendEmailOptions) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const msg: MailDataRequired = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject,
    templateId,
    dynamicTemplateData: dynamicData,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Email sent successfully:", response[0].statusCode);
    return { success: true, message: "Email sent successfully" };
  } catch (error: any) {
    console.error("Error sending email:", error.response ? error.response.body : error.message);
    return { success: false, error: error.response ? error.response.body : error.message };
  }
}

interface InvitationData {
  toEmail: string;
  invitationUrl: string;
  role: string;
}

export async function sendInvitationEmail({ toEmail, invitationUrl, role }: InvitationData) {
  if (!invitationUrl) {
    throw new Error("Failed to generate invitation URL");
  }

  const templateId = "d-b290e9b7c8f9416c8138f97ba7495b67";
  const dynamicData = {
    invitation_url: invitationUrl,
    role,
  };

  return sendEmail({
    to: toEmail,
    subject: "Invitation to Join Semantic Hub",
    templateId,
    dynamicData,
  });
}
