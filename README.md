# Showroom Dashboard

The code is based on tools I developed for real showroom workflows. The records and figures shown are fictional to protect client confidentiality.

This repository contains an interactive portfolio recreation, not the original production application. The interface reflects the original workflow, but all sample records and amounts are fictional. Production data, credentials, client identities, and private links are not included.

**Problem:** The team needed to see who was booked for each market, what brands retailers were coming to see, and how sales compared across brands and markets.

**What I built:** A central dashboard for appointment tracking, sales analysis, and operational reporting. I built the interface in HTML, CSS, and JavaScript and used Google Apps Script to connect Calendar, Sheets, and the CRM.

## How the workflow connects

1. **Google Calendar → Google Sheets:** Appointment records sync into a structured spreadsheet.
2. **Google Sheets → Dashboard:** The dashboard uses those records alongside sales and CRM data for filtering, analysis, and reporting.
3. **Dashboard workflow → CRM:** The related integration syncs records to Close CRM. Teams can review the data in one place without using the dashboard as a replacement for the CRM.

**Potential enhancement:** Let users update CRM records directly from the dashboard, with changes written back to the CRM. The public portfolio version is read-only with respect to external systems and includes no live connections.

| View | What it shows |
| --- | --- |
| Appointments | Filters for retailer, season, brand, and market; a retailer-by-brand matrix; and appointment detail. |
| Sales Analysis | Sales by brand or retailer, a retailer-by-brand comparison, and separate available-to-sell (ATS) views. |
| Reports | Showroom summaries, brand and market breakdowns, retailer changes between seasons, and conversion views. |

[Open the dashboard](index.html). Try searching for a retailer, then switch to Sales Overview and choose Client × Brand. In Reports, compare Sales by Location with Conversion.

![Dashboard: appointment matrix with fictional retailers](dashboard.jpg)

![Dashboard: Sales Analysis by retailer and brand with fictional values](dashboard-sales.jpg)

![Dashboard: showroom report with fictional appointment and sales figures](dashboard-reports.jpg)

## Run locally

Open `index.html` in a modern browser. No installation, sign-in, network connection, or backend is required. Changes reset when you reload. Use fictional information only.
