# Hook and Haul dispatch demo

A clickable practice version of a dispatch helper for H&H Towing and Recovery (Maryville, TN).
All trucks, jobs and phone numbers are fake. No texts are sent.

Live: https://brianlaks.github.io/hookandhaul-demo/

## Save answers to a Google Sheet (one-time setup, about 5 minutes)

1. Open https://sheets.new and name the sheet "Hook and Haul answers".
2. In the sheet, click **Extensions → Apps Script**.
3. Delete the code you see. Paste in all of [apps-script/Code.gs](apps-script/Code.gs). Click the **Save** icon.
4. Click **Deploy → New deployment**. Click the gear icon and pick **Web app**.
5. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy**.
6. Google asks for permission. Click **Authorize access** and pick your account.
   If you see "Google hasn't verified this app", click **Advanced → Go to (project name)**. It is your own script.
7. Copy the **Web app URL** (it ends in `/exec`).
8. Put it in `index.html` at `const SHEET_URL=...` and push. (Done: the live page uses it.)

Each person gets one row. If they save again, their row updates. Feature ratings show as columns like `features.plan`.
