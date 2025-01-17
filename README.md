# Date Filter and Summary Table Application

## Description

This web application allows users to:
- Filter a dataset of posts by date range using a date picker.
- Display the filtered results dynamically in a responsive table.
- View a summarized analysis of the data on a separate page, leveraging the **ChatGPT API** to generate concise, human-readable summaries for the top 10 posts of each day.

Key technologies used:
- **Next.js 15** (App Router) for modern routing and server-side rendering.
- **React Table** (`@tanstack/react-table`) for building flexible and performant tables.
- **React DatePicker** for selecting date ranges.
- **OpenAI ChatGPT API** for generating high-quality summaries.
- **Tailwind CSS** for styling.

---

## Features

1. **Dynamic Filtering and Display**:
   - Users can filter posts by selecting a date range, and the filtered results are displayed in a table.
   - The table supports dynamic updates and responsive design for different screen sizes.

2. **Daily Summary Generation**:
   - The application generates human-readable summaries of the top 10 posts for each day using the **ChatGPT API**.
   - These summaries provide concise insights into the most significant posts, including their titles, scores, and authors.

3. **Server-Side Rendering (SSR)**:
   - Data fetching and rendering are handled server-side for better performance and SEO.

4. **Reusable Components**:
   - Modular design with reusable components like `DateFilter` and `Table`.

---

## Steps to Run the Project Locally

### Prerequisites
- Node.js (v16 or above)
- npm or yarn package manager
- A Supabase project for storing post data (if applicable)
- OpenAI API Key for generating summaries

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AI-LastWish/TrendHive
   cd TrendHive
2. Install dependencies:
   ```bash
   npm install
3. Configure environment variables:
   Rename the example.env.local to .env.local and add your key
4. Start the development server:
   ```bash
   npm run dev
5. Open the application in your browser:
   Visit http://localhost:3000