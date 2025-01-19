# Date Filter and Summary Table Application

## Description

This web application allows users to:
- Filter a dataset of posts by date range using a date picker.
- Search for posts dynamically using a search bar with debounced input handling.
- Display the filtered results dynamically in a responsive table with pagination controls.
- View a summarized analysis of the data on a separate page, leveraging the **ChatGPT API** to generate concise, human-readable summaries for the top 10 posts of each day.
- Navigate and interact with the application using a responsive header and footer layout.
- Authenticate seamlessly using **Clerk** for user sign-in and account management.
- Get real-time feedback with a **loading spinner** during data fetch operations.

Key technologies used:
- **Next.js 15** (App Router) for modern routing and server-side rendering.
- **React Table** (`@tanstack/react-table`) for building flexible and performant tables.
- **React DatePicker** for selecting date ranges.
- **OpenAI ChatGPT API** for generating high-quality summaries.
- **Clerk** for user authentication and session management.
- **Tailwind CSS** for styling.

---

## Features

1. **Dynamic Filtering and Display**:
   - Users can filter posts by selecting a date range, and the filtered results are displayed in a table.
   - The table supports dynamic updates and responsive design for different screen sizes.

2. **Searching and Pagination**:
   - A search bar allows users to find posts based on keywords with debounced input handling.
   - Pagination controls let users navigate between pages of results efficiently.

3. **Daily Summary Generation**:
   - The application generates human-readable summaries of the top 10 posts for each day using the **ChatGPT API**.
   - These summaries provide concise insights into the most significant posts, including their titles, scores, and authors.

4. **Header and Footer**:
   - A responsive header includes the application title and user account actions (e.g., sign-in button or user menu) powered by **Clerk**.
   - A footer provides branding and navigation support with a clean design.

5. **Clerk Integration**:
   - Users can sign in or sign out using **Clerk**.
   - The app dynamically displays user-specific content based on the authentication state.

6. **Loading Spinner**:
   - A spinner is displayed during data fetch operations to provide real-time feedback to users, enhancing the experience by indicating loading progress.

7. **Server-Side Rendering (SSR)**:
   - Data fetching and rendering are handled server-side for better performance and SEO.

8. **Reusable Components**:
   - Modular design with reusable components like `DateFilter`, `Table`, `Header`, `Footer`, and `Spinner`.

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