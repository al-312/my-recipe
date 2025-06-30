# My Recipe App 🍲

A mobile application built with React Native and Expo that allows users to search for recipes by ingredients and view detailed recipe information.

## Features

- **Recipe Search**: Search for recipes by entering ingredients
- **Recipe Listings**: Browse through recipe cards with images and basic information
- **Detailed Recipe View**: View comprehensive recipe details including:
  - Preparation and cooking time
  - Servings
  - Health score
  - Cost per serving
  - Dietary information
  - Suitable occasions
  - Ingredients list
  - Cooking instructions
- **User Interactions**: 
  - Mark recipes as favorites
  - Share recipes with friends
  - Pull-to-refresh for updated content
- **Responsive UI**: Modern, intuitive interface with loading states and error handling

## Technologies Used

- **React Native**: Core framework for building the mobile application
- **Expo**: Development platform for React Native
- **Expo Router**: File-based routing system
- **Axios**: HTTP client for API requests
- **Spoonacular API**: External API for recipe data
- **React Navigation**: Navigation library for React Native
- **Expo Image**: Optimized image component
- **TypeScript**: Type-safe JavaScript

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd my-recipe
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   EXPO_PUBLIC_BASE_API=https://api.spoonacular.com
   EXPO_PUBLIC_API_KEY=your_spoonacular_api_key
   ```
   Note: You'll need to register for a free API key at [Spoonacular API](https://spoonacular.com/food-api)

4. Start the development server
   ```bash
   npx expo start
   ```

5. Run on a device or emulator
   - Press `a` to run on Android emulator
   - Press `i` to run on iOS simulator
   - Scan the QR code with Expo Go app on your physical device

## Project Structure

- `app/`: Main application code with file-based routing
  - `(home)/`: Home screen with recipe search and listing
  - `details/`: Recipe details screen
- `api/`: API configuration and services
- `components/`: Reusable UI components
- `constants/`: Application constants
- `types/`: TypeScript type definitions
- `assets/`: Images and other static assets

## Usage

1. On the home screen, tap the search icon to open the search modal
2. Enter ingredients separated by commas
3. View the list of recipes that match your ingredients
4. Tap on a recipe card to view detailed information
5. Toggle between ingredients and instructions using the tabs
6. Mark recipes as favorites or share them using the buttons in the header

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- [Spoonacular API](https://spoonacular.com/food-api) for providing recipe data
- [Expo](https://expo.dev) for the development platform
- [React Native](https://reactnative.dev) for the framework
