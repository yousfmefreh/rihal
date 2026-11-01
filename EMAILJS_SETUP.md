# EmailJS setup

The customer page saves each confirmed request to Firestore, then sends an email notification through EmailJS. If email delivery fails, the request remains saved and the confirmation screen offers an email-only retry.

## Configure EmailJS

1. In EmailJS, add and verify an email service.
2. Create an email template. Set its **To Email** to the office inbox in the EmailJS dashboard; do not take the recipient address from a browser-supplied template variable.
3. Add the template variables listed below to the message. For the complete request data, use `{{request_details}}` (for an HTML template, place it in a `<pre>` block).
4. In **Account > General**, copy the public key. Copy the service ID and template ID from their respective EmailJS pages.
5. Put those three values in `emailjs-config.js`. The public key is intended for browser use; never put an EmailJS private key or other secret in this file.
6. In EmailJS, restrict allowed origins to the website's real domain(s), including the deployed hosting domain. Then submit a test request over HTTPS and confirm that it arrives in the office inbox.

## Template variables

Use any of these variables in the subject or message:

- `{{request_id}}`
- `{{destination}}`
- `{{trip_type}}`
- `{{departure_date}}`
- `{{return_date}}`
- `{{adults}}` and `{{children}}`
- `{{budget_amount}}` and `{{budget_currency}}`
- `{{flight_preference}}`
- `{{hotel_stars}}`
- `{{special_notes}}`
- `{{request_details}}` — the full request data as formatted JSON

The email notification is sent only after Firestore confirms that the request was saved. If the EmailJS settings are missing or sending fails, the page still confirms the saved request and allows the visitor to retry the notification.
