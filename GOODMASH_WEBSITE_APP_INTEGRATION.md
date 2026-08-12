# GoodMash.io Website ↔ App Integration

## What is now prepared

- The website login/register flow uses the same Firebase project as the current mobile app (`goodmash-io`).
- Website registration creates the same basic `users/{uid}` profile structure used by the mobile app, including the 30-day trial and Standard membership defaults.
- Website `/account` reads the authenticated user's GoodMash profile from Firestore.
- Website download cards accept real Google Play, Huawei AppGallery and Apple App Store URLs through environment variables.
- A controlled Android test APK link can be enabled separately without pretending it is a public store release.
- Ozow remains server-side only; no merchant secret belongs in the website or APK.

## Website setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_FIREBASE_PROJECT_ID=goodmash-io`.
3. Set `NEXT_PUBLIC_FIREBASE_WEB_API_KEY` to the Web API key for the existing `goodmash-io` Firebase project.
4. Run `npm install` and `npm run dev`.
5. Test `/login`, create an account, then confirm `/account` loads the same Firebase user.
6. Confirm the new user appears in Firebase Authentication and Firestore under `users/{uid}`.
7. When official stores are live, put their real URLs into the three store variables.
8. For private APK testing, set `NEXT_PUBLIC_ANDROID_TEST_APK_URL` to a real HTTPS APK location.

## Firebase console requirements

- Enable Email/Password authentication.
- Add the production website domain to Authentication > Settings > Authorized domains.
- Deploy the Firestore rules from the mobile project after reviewing them for the production environment.
- Do not put Firebase Admin/service-account credentials in the website.

## App setup

The current app already initializes `AppGuardian` at startup and uses Firebase Authentication/Firestore. Keep that architecture.

Before production:

- Replace any placeholder iOS Firebase configuration.
- Register/verify the production Android application ID in Firebase.
- Verify iOS bundle ID `com.goodmash.io` in Firebase/Apple configuration.
- Add and enable the iOS Network Extension Packet Tunnel target.
- Attach the Android tun2socks component and implement authenticated GoodMash SOCKS transport.
- Implement the equivalent iOS packet-flow transport.
- Deploy the GoodMash relay behind TLS 1.3 and replace the reference token check with backend session verification.
- Test real provider-to-member traffic on physical devices.

## Download flow

The website must only show a public download link when a real published store URL or controlled test APK URL is configured. Do not add fake download buttons.

## Ozow flow

App/website -> GoodMash backend -> Ozow checkout -> Ozow notification -> backend verification -> Firestore maintenance state -> app/website reads verified state.

Never put Ozow secret credentials in the frontend or mobile APK.
