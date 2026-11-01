# Firebase setup

The customer and office pages now use Firebase callable functions. Requests are stored in Firestore; the browser no longer stores submitted requests. The office dashboard requires a verified Firebase Authentication account for `yousfmefreh@gmail.com`.

## Configure the Firebase project

1. Create a Firebase project and register a Web app. Enable **Cloud Firestore**, **Authentication > Email/Password**, **App Check > reCAPTCHA Enterprise**, **Cloud Functions**, and **Firebase Hosting**. Cloud Functions may require the Blaze billing plan.
2. Copy the Web app's `apiKey`, `projectId`, and `appId` into `firebase-config.js`. Set `authDomain` to `<project-id>.firebaseapp.com`, and replace `appCheckSiteKey` with the reCAPTCHA Enterprise site key. Add the Hosting domain to the authorized domains for Firebase Authentication and App Check.
3. Create the Firestore database. Deploy the included rules; direct client reads and writes are denied. Cloud Functions use the Admin SDK.
4. In Firebase Authentication, create the office account `yousfmefreh@gmail.com`, set its password, and verify the email. This exact, verified account is authorized to manage requests.
5. Configure the EmailJS service, template, public key, and allowed website origins as described in [EMAILJS_SETUP.md](./EMAILJS_SETUP.md).

## Deploy from PowerShell

Install the Firebase CLI if needed, then run these commands from the project directory:

```powershell
firebase login
firebase use --add
firebase deploy --only firestore:rules,functions,hosting
```

EmailJS credentials are configured in `emailjs-config.js`; only its public key belongs in the browser. Serve the pages through Firebase Hosting (HTTPS); opening the HTML files directly does not provide Firebase Hosting, App Check, or Cloud Functions. New requests are saved even if the email service is temporarily unavailable; the confirmation screen reports when the email notification fails, and the request remains available in the office dashboard.
