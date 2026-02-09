# Lone Star EDU - AI Demo

This is a demonstration of an AI-powered educational platform designed for the Lone Star Unified School District. It showcases how Generative AI can be integrated into various roles within the educational ecosystem to enhance learning, administration, and parent engagement.

## Features

*   **Role-Based Access**: Tailored views and functionalities for Students, Parents, Teachers, Principals, District Admins, and Board Members.
*   **Dual Modes**:
    *   **Pilot (MVP)**: Focuses on core dashboards and early warning indicators.
    *   **Future Vision**: Demonstrates advanced AI integration, personalized learning plans, and comprehensive data analytics.
*   **AI Assistant**: Powered by Google Gemini, the "EDU AI" assistant provides contextual help, data analysis, and insights specific to the user's role.
*   **Interactive Dashboards**: Visualizes key metrics like attendance, academic performance, and budget utilization.

## Technologies Used

*   React
*   Vite
*   Tailwind CSS
*   Google Gemini API
*   Recharts for data visualization
*   Lucide React for icons

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/90rdon/EDU-AI-Demo.git
    cd EDU-AI-Demo
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    *   Create a `.env` file in the root directory.
    *   Add your Google Gemini API key:
        ```env
        GEMINI_API_KEY=your_api_key_here
        ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

## Deployment

This project is configured for deployment to GitHub Pages.

1.  **Add your API Key to GitHub Secrets**:
    *   Go to your repository settings > Secrets and variables > Actions.
    *   Add a new repository secret named `GEMINI_API_KEY` with your API key value.

2.  **Push to `main`**:
    *   The included GitHub Actions workflow will automatically build and deploy your app to the `gh-pages` branch.

3.  **Enable GitHub Pages**:
    *   In repository settings > Pages, select the `gh-pages` branch as the source.
