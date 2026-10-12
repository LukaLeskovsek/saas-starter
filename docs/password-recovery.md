# Password recovery

Open /forgot-password to request a reset email. Submit your email and open the latest link in the same browser. The request stores the PKCE verifier in that browser; /auth/callback exchanges the returned code and opens /setup-password.

For an operator-generated recovery link, use /auth/recovery?token_hash=HASH. Generate HASH with Supabase Auth Admin generateLink({ type: "recovery", email }) and use properties.hashed_token. Do not send users through the provider's action_link for this route. Opening the page does not consume the token; the user must press Continue to reset password. The server verifies a recovery token, writes session cookies and redirects to /setup-password.

An expired or used link cannot be recovered. Generate a new link after the deployment is ready. GenerateLink does not send email. Treat the generated URL as a credential: never commit it, log it, or include it in public documentation. No service-role key belongs in the browser.

The Supabase redirect allow list must include the deployed app and the local development app. Sign-in uses the same /auth/callback when "Confirm email" is left on: the confirmation link comes back with a code and lands on /dashboard.

Email delivery depends on the project's configured mail service and rate limits. The reset-request form sends email only when the user submits it. The operator link is an alternative that requires the operator's authenticated Supabase access.

## Supabase settings this needs

- Authentication → URL Configuration: the Site URL is the app's address, and the Redirect URLs include `http://localhost:3000/**` and the live address with `/**`. Without them the e-mailed link is rejected.
- The reset e-mail uses Supabase's own mailer and its low hourly rate limit, which is fine for a workshop.
