'use server';
import nodemailer from 'nodemailer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { FeedbackSchema } from '@/lib/schemas';

const SMTP_SERVER_HOST = process.env.SMTP_HOST;
const SMTP_SERVER_PORT = process.env.SMTP_PORT;
const SMTP_SERVER_USERNAME = process.env.SMTP_USER;
const SMTP_SERVER_PASSWORD = process.env.SMTP_PASS;
const SITE_MAIL_RECEIVER = process.env.SITE_MAIL_RECEIVER;
const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  port: Number(SMTP_SERVER_PORT),
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function notifyTeacherFeedback(data: FeedbackSchema) {
  const templatePath = path.join(process.cwd(), 'lib/email-templates/teacher-feedback.html');
  const template = await fs.readFile(templatePath, 'utf8');

  const html = fill(template, {
    feedback_title: data.title,
    feedback_category: data.category,
    feedback_description: data.description,
    feedback_link: 'https://yourapp.example.com/portal/feedback',
    submitted_at: new Date().toLocaleString(),
    school_name: 'B3 School',
  });

  await sendMail({
    email: String(SMTP_SERVER_USERNAME),
    subject: `Feedback submitted: ${data.title} (${data.category})`,
    text: `A new feedback was submitted.\n\nTitle: ${data.title}\nCategory: ${data.category}\nSubmitted at: ${new Date().toLocaleString()}\n\nPlease view it in the portal.`,
    html,
  });
}

function fill(template: string, map: Record<string, string>): string {
  const escape = (v: string) =>
    v
      .replaceAll(/&/g, '&amp;')
      .replaceAll(/</g, '&lt;')
      .replaceAll(/>/g, '&gt;')
      .replaceAll(/"/g, '&quot;')
      .replaceAll(/'/g, '&#39;');

  return template.replace(/{{\s*(\w+)\s*}}/g, (_: string, k: string) => {
    const raw = map[k];
    return raw != null ? escape(String(raw)) : '';
  });
}

export async function sendMail({
  email,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    await transporter.verify();
  } catch (error) {
    console.error(
      'SMTP verification failed. Please check SMTP configuration (host, port, user).',
      error
    );
    return;
  }
  const info = await transporter.sendMail({
    from: email,
    to: SITE_MAIL_RECEIVER,
    subject: subject,
    text: text,
    html: html ? html : '',
  });
  console.log('Message Sent', info.messageId);
  console.log('Mail sent to', SITE_MAIL_RECEIVER);
  return info;
}
