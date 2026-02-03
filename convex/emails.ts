"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.APP_URL || "http://localhost:5173";

export const sendInvitation = action({
  args: {
    email: v.string(),
    token: v.string(),
  },
  handler: async (_, args) => {
    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not set, skipping email send");
      console.log(`Would send invitation to ${args.email} with link: ${APP_URL}/questionnaire/${args.token}`);
      return { success: true, skipped: true };
    }

    const questionnaireUrl = `${APP_URL}/questionnaire/${args.token}`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DISC Assessment <noreply@yourdomain.com>",
        to: args.email,
        subject: "You're invited to take a DISC personality assessment",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #ea580c;">DISC Personality Assessment</h1>
            <p>You've been invited to complete a DISC personality assessment.</p>
            <p>This assessment consists of 16 questions and should take about 5-10 minutes to complete.</p>
            <p style="margin: 30px 0;">
              <a href="${questionnaireUrl}"
                 style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Start Assessment
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">
              This link will expire in 7 days. If you have any questions, please contact the administrator.
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    return { success: true };
  },
});

export const sendConfirmation = action({
  args: {
    email: v.string(),
    firstName: v.string(),
    primaryType: v.string(),
    primaryColor: v.string(),
  },
  handler: async (_, args) => {
    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not set, skipping email send");
      console.log(`Would send confirmation to ${args.email}`);
      return { success: true, skipped: true };
    }

    const colorStyles: Record<string, string> = {
      Red: "#ef4444",
      Yellow: "#eab308",
      Green: "#22c55e",
      Blue: "#3b82f6",
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DISC Assessment <noreply@yourdomain.com>",
        to: args.email,
        subject: "Your DISC Assessment Results",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #ea580c;">Your DISC Results</h1>
            <p>Hi ${args.firstName},</p>
            <p>Thank you for completing the DISC personality assessment!</p>
            <p>Your primary personality type is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="background-color: ${colorStyles[args.primaryColor] || "#ea580c"}; color: white; padding: 16px 32px; border-radius: 8px; font-size: 24px; font-weight: bold; display: inline-block;">
                ${args.primaryColor} (${args.primaryType})
              </span>
            </div>
            <p style="color: #666; font-size: 14px;">
              This assessment is provided for educational purposes only. Please refer to the full results page for detailed insights into your DISC profile.
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    return { success: true };
  },
});
