# EasyEats

A React Native mobile app that helps users discover meals, plan their week, and manage their grocery list.
---

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd EasyEats
npm install
```

---

### 2. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Create a new Firebase project**.
2. Give it a name (e.g. `easyeats`) and follow the prompts to create your project.
3. Once inside the project, click **+ Add app** and choose the **Web** platform (`</>`).
4. Choose an app nickname, and register the app. Firebase will show you a `firebaseConfig` block. Make sure you are on the "Use npm" radio buttton. Copy the SDK code and save it somewhere as it will be used in the next step.
5. Scroll to the bottom of the pages and click **Continue to console**

---

### 3. Enable Firestore

#### Create the database
1. In the Firebase Console sidebar (on the left side), go to **Product Categories → NoSQL → Firestore**.
2. Click **Create database**.
3. Select Edition: Choose **Standard Edition** 
4. Database ID & location: For the region, pick the one closest to you (e.g. `us-east1` for eastern North America). Click **Enable**.
5. Configure: **Start in test mode**. This allows open reads and writes for 30 days which is good for development. 
6. Click **Create**

#### Security Rules

Once Firestore is created, go to the **Rules** tab. Remove the current code, and copy-paste this in
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 6, 1);
    }
  }
}
```
Then press **Publish**

### 4. Configure environment variables

Create a `.env` file in the root of the project and fill in the values from your `firebaseConfig`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=easyeats-xxxxx
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456:web:abcdef
```
---

### 5. Seed the database

The app ships with 30 pre-built meals in `src/data/meals.ts`. The `clearAndSeedMeals()` function in `src/services/mealService.ts` uploads all of them to your Firestore `meals` collection in one shot.

**To run the seed, temporarily add this to `App.tsx`:**

```tsx
import { clearAndSeedMeals } from './src/services/mealService';
import { useEffect } from 'react';

// Inside your App component, add this useEffect below all the other lines of code currently in the file:
useEffect(() => {
  clearAndSeedMeals();
}, []);
```

The App component should now look like so  

<img width="594" height="401" alt="image" src="https://github.com/user-attachments/assets/295635cd-0a56-4444-b8a9-2507cb32f344" />

Save the file. Start the app (`npm start`), wait for the web console to log `30 meals added into DB`, then **remove the `useEffect` and the import** before continuing development.

---

### 6. Run the app

If the application is already running, stop the app, and then run with the following command:

```bash
npm expo start
```

---

### 7. Previewing in the Browser (Mobile View)

Run the app in the browser with:

```bash
npx expo start 
```
Then simulate an iPhone XR screen in your browser's dev tools:

### Windows (Chrome / Edge)
1. Press `F12` to open DevTools
2. Click the **Toggle Device Toolbar** icon (looks like a phone/tablet) in the top-left of DevTools, or press `Ctrl + Shift + M`
3. In the device dropdown at the top of the viewport, select **iPhone XR** - or choose **Edit** to add it if it's not listed
4. If the dimensions are not already added, set the dimensions manually to **414 × 896**
5. Set zoom to **78%** to fit the full screen comfortably

### Mac (Chrome)
1. Press `Cmd + Option + I` to open DevTools
2. Click the **Toggle Device Toolbar** icon or press `Cmd + Shift + M`
3. Select **iPhone XR** from the device dropdown, or set dimensions manually to **414 × 896**
4. Set zoom to **78%**
