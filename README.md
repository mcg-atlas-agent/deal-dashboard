# Flippa Deal Review Dashboard

Minimalist React app for reviewing and rating Flippa e-commerce deals.

## Setup

```bash
cd flippa-dashboard
npm install
npm run dev
```

The app will open at `http://localhost:3000`

## Features

- **Deal Cards**: Display 10 Flippa deals with revenue, margins, and competitive moats
- **Feedback Controls**: Rate each deal as Hot, Maybe, or Pass
- **Notes**: Add questions or notes for each deal
- **Summary**: Live feedback count dashboard
- **Local Storage**: Feedback persists in browser
- **Export**: Export feedback to JSON (for saving to server)

## Design

- Dark mode minimalist UI
- Tailwind CSS styling
- Mobile responsive
- Clean typography and spacing

## File Structure

```
flippa-dashboard/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── deals.json              # Deal data
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   └── components/
│       ├── DealCard.jsx
│       └── FeedbackSummary.jsx
```

## Feedback Export

Click "Export Feedback" to generate a JSON object containing your ratings and notes for all deals. In production, this would POST to your server and save to `flippa_feedback.json`.

---

*Built for MCG Atlas Deal Intelligence Pipeline*
