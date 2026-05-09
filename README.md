# auto-job-tracker
A Google Apps Script that automatically extracts, cleans, and organizes job links from Gmail alerts into a Google Sheet.

# Gmail Job Scraper & Organizer

A Google Apps Script that automates the tedious part of job hunting. It scans your Gmail for job alerts (LinkedIn, Indeed, Handshake, etc.), extracts the application links, cleans off messy tracking parameters, and organizes them neatly into an auto-sorting Google Sheet.

## Features
*   **Automated Extraction:** Pulls job links directly from unread Gmail job alerts.
*   **Duplicate Prevention:** Checks your existing spreadsheet to ensure you never log the same job twice.
*   **Smart Link Cleaning:** Automatically strips out bulky tracking parameters (e.g., `?utm_`, `?trk=`, `?from=`) to reveal the clean, direct URL.
*   **Aggressive Junk Filter:** Ignores non-job links commonly found in these emails, such as "Unsubscribe", "Privacy Policy", or App Store links, preventing accidental unsubscriptions.
*   **Auto-Sorting:** Automatically pushes the newest jobs to the very top of your list so you can apply to fresh postings first.

## Prerequisites
1. A Google Account.
2. Job board email alerts routed to your Gmail.

## Setup Instructions

### Step 1: Prepare Your Gmail
1. Open Gmail and create a new label called **job-alerts**.
2. Go to your Gmail search bar and click the "Show search options" icon.
3. In the **From** field, add the domains of your job boards separated by an uppercase OR (e.g., `@linkedin.com OR @indeed.com OR @joinhandshake.com`).
4. Click **Create filter**.
5. Check **Apply the label** and select your new **job-alerts** label.
6. Check **Also apply filter to matching conversations** and click **Create filter**.

### Step 2: Prepare Your Google Sheet
1. Create a new Google Sheet.
2. Create the following headers in Row 1:
   * **Column A:** Date
   * **Column B:** Time
   * **Column C:** Subject
   * **Column D:** Link

### Step 3: Add the Script
1. In your Google Sheet, click **Extensions > Apps Script**.
2. Delete the default code and paste the contents of `Code.gs` from this repository.
3. Click the **Save** icon.

### Step 4: Run and Automate
1. Click **Run** at the top of the Apps Script editor.
2. Google will ask for authorization to access your Gmail and Sheets. Click **Review permissions > Advanced > Go to project (unsafe) > Allow**.
3. **To fully automate:** Click the **Triggers** icon (the alarm clock on the left sidebar).
4. Click **+ Add Trigger** and configure it to run `extractJobLinks` on a `Time-driven` -> `Day timer` at whatever time you prefer (e.g., Midnight to 1am). 

## Code Structure
The main logic is housed in `Code.gs`. The script utilizes `GmailApp` to search specific labels and `SpreadsheetApp` to manipulate the connected Google Sheet. It relies on standard JavaScript Regex for link extraction and array manipulation for filtering junk and formatting.

## Disclaimer
This script relies on the current URL structures of major job boards. If job boards significantly change how they format their "Unsubscribe" buttons or tracking links, the `junkWords` array in the script may need to be updated.
