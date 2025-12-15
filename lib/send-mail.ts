'use server';
import nodemailer from 'nodemailer';
import fs from 'node:fs/promises';
import path from 'node:path';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECEIVER = process.env.SITE_MAIL_RECEIVER;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: SMTP_SERVER_HOST,
    port: 587,
    secure: true,
    auth: {
        user: SMTP_SERVER_USERNAME,
        pass: SMTP_SERVER_PASSWORD,
    },
});

function fill(template: string, map: Record<string, string>): string {
    return template.replace(/{{\s*(\w+)\s*}}/g, (_, k) => map[k] ?? '')
}

export async function notifyTeacherFeedback() {
    const templatePath = path.join(process.cwd(), 'lib/email-templates/teacher-feedback.html')
    const template = await fs.readFile(templatePath, 'utf8')

    const html = fill(template, {
        teacher_name: 'Ms. Smith',
        student_name: 'John Doe',
        course_name: 'Math 8A',
        feedback_excerpt: 'I found the algebra unit quite engaging... ',
        feedback_link: 'https://yourapp.example.com/feedback/123',
        submitted_at: new Date().toLocaleString(),
        school_name: 'B3 Echo School',
    })

    await sendMail({
        email: 'no-reply@yourapp.example.com',
        sendTo: 'ms.smith@example.com',
        subject: 'New feedback submitted',
        text: 'A new feedback was submitted. Please view it in the portal.',
        html,
    })
}

export async function sendMail({
                                   email,
                                   sendTo,
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
        console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
        return;
    }
    const info = await transporter.sendMail({
        from: email,
        to: sendTo || SITE_MAIL_RECEIVER,
        subject: subject,
        text: text,
        html: html ? html : '',
    });
    console.log('Message Sent', info.messageId);
    console.log('Mail sent to', SITE_MAIL_RECEIVER);
    return info;
}
