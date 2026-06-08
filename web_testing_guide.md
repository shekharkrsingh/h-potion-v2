# Web Testing & Cleanup Guide

This guide documents the modifications made to support running the project on the Web platform for testing purposes, how to launch the web version, and how to safely revert these changes before mobile production deployment.

---

## 1. Modifications Made for Web Support

We made the following changes to enable web compilation and fix module resolution/runtime errors:

1. **Installed Web Dependencies:**
   - Added `react-native-web` and `react-dom` to `package.json`.

2. **Updated Babel Config ([babel.config.js](file:///Users/shekharkumarsingh/Downloads/personal/fhpotionV2/babel.config.js)):**
   - Added `.web.js`, `.web.tsx`, and `.web.ts` to the `module-resolver` extensions array so that Metro can locate web-specific module versions (e.g., in `react-native-web`).

3. **CountUpText Web Fallback ([CountUpText.tsx](file:///Users/shekharkumarsingh/Downloads/personal/fhpotionV2/src/components/ui/CountUpText.tsx)):**
   - Wrapped `setNativeProps` call with a conditional fallback. When running on Web, `setNativeProps` is not available on DOM elements, so the component falls back to direct DOM `.value` manipulation.
   > [!NOTE]
   > The code change in `CountUpText.tsx` is fully backward-compatible and safe for mobile. You do not strictly need to revert it, but instructions are provided below if you prefer to.

4. **Updated Backend CORS Configuration (in `healnow` service):**
   - Modified [SecurityConfig.java](file:///Users/shekharkumarsingh/Downloads/personal/healnow/src/main/java/com/heal/doctor/security/SecurityConfig.java) and [CorsConfig.java](file:///Users/shekharkumarsingh/Downloads/personal/healnow/src/main/java/com/heal/doctor/config/CorsConfig.java) to allow request origins from ports `8081`, `8082`, and `19006` (standard Expo web testing ports). This resolves the `403 Forbidden` CORS error on local browsers.

5. **TokenService SecureStore Fallback ([tokenService.ts](file:///Users/shekharkumarsingh/Downloads/personal/fhpotionV2/src/services/auth/tokenService.ts)):**
   - Expo's `SecureStore` library uses native Keychain/Keystore APIs which are unavailable on Web platforms. We added a conditional platform check that redirects storage queries to standard `localStorage` (via wrapper functions `setSecureItem`, `getSecureItem`, and `deleteSecureItem`) when running on Web.
   > [!NOTE]
   > Similar to `CountUpText.tsx`, this is backward-compatible and does not need to be reverted for native execution, but revert commands are provided below.

---

## 2. How to Test on Web

To run the web development server:

```bash
# Start the web version of the application
npm run web
```
or:
```bash
# Start expo dev server forcing web platform and clearing cache
npm run web -- --clear
```

---

## 3. Step-by-Step Cleanup (Before Deployment)

To completely remove the web-testing features and restore the project to a pure native mobile state before deployment, run the following commands:

### Step A: Revert Babel Configuration
Revert the additions made to the `module-resolver` extensions in `babel.config.js`:
```bash
git checkout babel.config.js
```
*(Or manually remove `.web.js`, `.web.tsx`, and `.web.ts` from the `extensions` array in `babel.config.js`)*

### Step B: Uninstall Web Dependencies
Remove `react-native-web` and `react-dom` from your project packages:
```bash
npm uninstall react-native-web react-dom
```

### Step C (Optional): Revert CountUpText.tsx changes
If you want to restore the original native-only code in `src/components/ui/CountUpText.tsx`, run:
```bash
git checkout src/components/ui/CountUpText.tsx
```

### Step D (Optional): Revert tokenService.ts changes
If you want to restore the original native-only code in `src/services/auth/tokenService.ts`, run:
```bash
git checkout src/services/auth/tokenService.ts
```

### Step E: Revert Backend CORS Configuration
Restore the original CORS configuration in the `healnow` backend (removing local testing ports 8081, 8082, 19006):
```bash
cd ../healnow
git checkout src/main/java/com/heal/doctor/security/SecurityConfig.java
git checkout src/main/java/com/heal/doctor/config/CorsConfig.java
```

### Step F: Clear Cache
Ensure that the bundler and Expo caches are completely cleared of web artifacts before building your native iOS/Android packages:
```bash
cd ../fhpotionV2
npm start -- --clear
```
