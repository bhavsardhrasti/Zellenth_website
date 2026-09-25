import { Resend } from 'resend';

import { server } from '@/lib/env';
import type { QuoteRequestDocument } from '@/lib/db/models/QuoteRequest.model';

function getResendClient(): Resend | null {
  if (!server.EMAIL_API_KEY) {
    return null;
  }
  return new Resend(server.EMAIL_API_KEY);
}

function renderItemsList(items: QuoteRequestDocument['items']): string {
  return items
    .map((item, index) => {
      const parts = [item.doorSnapshot?.name, item.laminateSnapshot?.name].filter(Boolean);
      return `<li>${index + 1}. ${parts.join(' + ') || 'Saved item'}</li>`;
    })
    .join('');
}

function renderQuoteRequestSummary(quoteRequest: QuoteRequestDocument): string {
  return `
    <p><strong>Reference:</strong> ${quoteRequest.referenceId}</p>
    <p><strong>Name:</strong> ${quoteRequest.name}</p>
    <p><strong>Phone:</strong> ${quoteRequest.phone}</p>
    ${quoteRequest.email ? `<p><strong>Email:</strong> ${quoteRequest.email}</p>` : ''}
    ${quoteRequest.city ? `<p><strong>City:</strong> ${quoteRequest.city}</p>` : ''}
    ${quoteRequest.projectType ? `<p><strong>Project type:</strong> ${quoteRequest.projectType}</p>` : ''}
    ${quoteRequest.message ? `<p><strong>Message:</strong> ${quoteRequest.message}</p>` : ''}
    <p><strong>Items:</strong></p>
    <ul>${renderItemsList(quoteRequest.items)}</ul>
  `;
}

export async function sendQuoteRequestAdminEmail(
  quoteRequest: QuoteRequestDocument,
): Promise<void> {
  const client = getResendClient();
  if (!client || !server.EMAIL_FROM || !server.ADMIN_NOTIFICATION_EMAIL) {
    console.warn(
      'Email not configured (EMAIL_API_KEY/EMAIL_FROM/ADMIN_NOTIFICATION_EMAIL) — skipping admin notification email.',
    );
    return;
  }

  await client.emails.send({
    from: server.EMAIL_FROM,
    to: server.ADMIN_NOTIFICATION_EMAIL,
    subject: `New quote request — ${quoteRequest.referenceId}`,
    html: renderQuoteRequestSummary(quoteRequest),
  });
}

export async function sendQuoteRequestConfirmationEmail(
  quoteRequest: QuoteRequestDocument,
): Promise<void> {
  if (!quoteRequest.email) return;

  const client = getResendClient();
  if (!client || !server.EMAIL_FROM) {
    console.warn('Email not configured (EMAIL_API_KEY/EMAIL_FROM) — skipping confirmation email.');
    return;
  }

  await client.emails.send({
    from: server.EMAIL_FROM,
    to: quoteRequest.email,
    subject: `Your Zellenth quote request — ${quoteRequest.referenceId}`,
    html: `<p>Thanks for reaching out — our team will follow up shortly.</p>${renderQuoteRequestSummary(quoteRequest)}`,
  });
}
