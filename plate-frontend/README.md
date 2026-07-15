# Plate Frontend - Meal Tracking Dashboard

A React.js based dashboard for the Plate Meal Tracking Module built as part of the Fitshield Dietfood Pvt Ltd Full-Stack Developer Assessment.

The frontend connects to the Django REST Framework backend and provides an interface for meal tracking, calorie monitoring, and nutrition insights.

## Features

* Add meal form with inline validation
* Meal list with pagination
* Date based filtering
* Tag based filtering
* Search functionality
* Daily calorie summary
* Macro nutrient tracking
* Progress bar for calorie goal
* Delete meal functionality
* Live UI updates without page refresh
* Loading states for API requests
* Error handling
* Empty state handling
* 7-day calorie trends visualization
* Clickable trend bars for date filtering

## Tech Stack

* React.js
* JavaScript
* Axios
* CSS
* SVG based charts

## Backend Integration

The frontend communicates with the Django REST Framework backend through REST APIs.

Configured endpoints:

* POST `/api/meals/`
* GET `/api/meals/`
* GET `/api/meals/summary/`
* DELETE `/api/meals/{id}/`
* GET `/api/meals/trends/`

## Environment Variables

Create a `.env` file:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

For production deployment:

```env
REACT_APP_API_BASE_URL=<BACKEND_API_URL>
```

## Local Setup

Clone the repository:

```bash
git clone https://github.com/Aayushi-jain22/plate-frontend
```

Navigate to the project directory:

```bash
cd plate-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will start on:

```text
http://localhost:3000
```

## Build for Production

```bash
npm run build
```

## AI Tools Used

The following AI tools were used during development:

Claude, ChatGPT
All AI generated suggestions were reviewed and modified before integration.

## Repository

Frontend Repository:

https://github.com/Aayushi-jain22/plate-frontend

## Author

Aayushi Jain
Software Engineer
