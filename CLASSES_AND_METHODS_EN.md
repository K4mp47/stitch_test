# Application Classes and Methods

This document lists all classes, components, and services used in the application, along with their methods.

## Table of Contents
1. [Screens](#screens)
2. [Services](#services)
3. [UI Components](#ui-components)
4. [State Management (Redux Store)](#state-management-redux-store)
5. [Custom Hooks](#custom-hooks)
6. [Constants and Types](#constants-and-types)

---

## Screens

### 1. **AlertDetailsScreen** (`app/screens/AlertDetailsScreen.tsx`)
**Description**: Weather alerts details screen

**Helper Functions**:
- `parsePolygon(polygonString: string)`: Converts a coordinate string into an array of points

**Component Methods**:
- `handleNext()`: Navigate to next alert
- `handlePrev()`: Navigate to previous alert

---

### 2. **MapScreen** (`app/screens/MapScreen.tsx`)
**Description**: Main map screen with navigation functionality

**Helper Functions**:
- `parsePolygon(polygonString: string)`: Converts coordinate string to array
- `getPolygonCentroid(coordinates: Array)`: Calculates the centroid of a polygon
- `stripHtml(html: string)`: Removes HTML tags from a string
- `getManeuverIcon(maneuver: string)`: Returns the appropriate icon for a maneuver

**Internal Components**:
- **GoogleBar**: Search bar component with autocomplete
- **DestinationModal**: Modal with trip details
- **RideOptionsModal**: Modal for selecting ride options
- **NavigationModal**: Modal with navigation instructions

---

### 3. **OnboardingScreen** (`app/screens/OnboardingScreen.tsx`)
**Description**: Welcome screen with feature carousel

**Component Methods**:
- `onViewableItemsChanged`: Callback to track visible items in the carousel

---

### 4. **SettingsScreen** (`app/screens/SettingsScreen.tsx`)
**Description**: Application settings screen

**Component Methods**:
- `saveSettings()`: Saves user settings to AsyncStorage
- `loadSettings()`: Loads settings from AsyncStorage
- `handleSimulateAlert()`: Shows position simulation modal
- `handleTestNotification()`: Sends a test notification
- `confirmSimulation()`: Confirms location for simulation

---

## Services

### 5. **NotificationService** (`app/services/NotificationService.tsx`)
**Description**: Service for managing notifications and background weather checks

**Functions**:
- `checkWeatherAndNotify()`: Checks weather conditions and sends notifications when necessary

**NotificationService Object Methods**:
- `registerBackgroundTasks()`: Registers background tasks for periodic fetch
- `testNow()`: Immediately executes a notification test

---

## UI Components

### 6. **CategoryChips** (`components/CategoryChips.tsx`)
**Description**: Component to display category chips in a scrollable horizontal list

---

### 7. **MapSearchBar** (`components/MapSearchBar.tsx`)
**Description**: Map search bar (mobile version)

---

### 8. **MapSearchBar.web** (`components/MapSearchBar.web.tsx`)
**Description**: Map search bar (web version)

---

### 9. **RouteCalculationButton** (`components/RouteCalculationButton.tsx`)
**Description**: Button to calculate route

**Component Methods**:
- `handlePress()`: Handles button press with animation

---

### 10. **ThemedText** (`components/themed-text.tsx`)
**Description**: Text component with light/dark theme support

---

### 11. **ThemedView** (`components/themed-view.tsx`)
**Description**: Container component with light/dark theme support

---

### 12. **HelloWave** (`components/hello-wave.tsx`)
**Description**: Animated component with waving emoji

---

### 13. **ExternalLink** (`components/external-link.tsx`)
**Description**: Component for external links

---

### 14. **HapticTab** (`components/haptic-tab.tsx`)
**Description**: Tab button with haptic feedback

---

### 15. **ParallaxScrollView** (`components/parallax-scroll-view.tsx`)
**Description**: Scroll component with parallax effect

**Component Methods**:
- `headerAnimatedStyle`: Calculates animated style for the header

---

### 16. **BottomSheet** (`components/ui/BottomSheet.tsx`)
**Description**: Draggable bottom sheet component

**Component Methods**:
- `gestureHandler`: Handles pan drag gestures
- `animatedStyle`: Calculates the animated style of the component

---

### 17. **Collapsible** (`components/ui/collapsible.tsx`)
**Description**: Component for collapsible content

---

### 18. **IconSymbol** (`components/ui/icon-symbol.tsx`)
**Description**: Component for symbolic icons

---

## State Management (Redux Store)

### 19. **store** (`store/store.ts`)
**Description**: Redux store configured for global application state management

---

### 20. **navSlice** (`store/slice.ts`)
**Description**: Redux slice for navigation state management

**Reducers**:
- `setOrigin(state, action)`: Sets the origin point
- `setDestination(state, action)`: Sets the destination
- `setTravelTimeInformation(state, action)`: Sets travel time information
- `setSimulationMode(state, action)`: Toggles simulation mode

**Selectors**:
- `selectOrigin(state)`: Selects the origin point
- `selectDestination(state)`: Selects the destination
- `selectTravelTimeInformation(state)`: Selects travel time information
- `selectIsSimulationMode(state)`: Selects simulation mode state

---

## Custom Hooks

### 21. **useColorScheme** (`hooks/use-color-scheme.ts`)
**Description**: Hook to determine current theme (light/dark)

---

### 22. **useThemeColor** (`hooks/use-theme-color.ts`)
**Description**: Hook to get current theme colors

**Methods**:
- `useThemeColor(props, colorName)`: Returns appropriate color based on active theme

---

## Constants and Types

### 23. **Colors** (`constants/theme.ts`)
**Description**: Object containing colors for light and dark themes

**Properties**:
- `light`: Colors for light theme
- `dark`: Colors for dark theme

---

### 24. **Fonts** (`constants/theme.ts`)
**Description**: Object containing font configurations

**Properties**:
- `display`: Main display font

---

### 25. **BorderRadius** (`constants/theme.ts`)
**Description**: Object containing border radius constants

---

### 26. **FakeUser** (`constants/theme.ts`)
**Description**: Object containing mock user data for testing and development

---

### 27. **navState** (`type.ts`)
**Description**: TypeScript type definition for navigation state

**Properties**:
- `origin`: Starting point
- `destination`: End point
- `travelTimeInformation`: Travel time information
- `isSimulationMode`: Flag for simulation mode

---

## Layout and Router

### 28. **RootLayout** (`app/_layout.tsx`)
**Description**: Application root layout with navigation and font configuration

**Component Methods**:
- `useEffect()`: Registers background tasks on app startup

---

### 29. **Home** (`app/index.tsx`)
**Description**: Home screen managing initial routing

**Component Methods**:
- `useEffect()`: Checks onboarding status and redirects accordingly

---

### 30. **ModalScreen** (`app/modal.tsx`)
**Description**: Generic modal screen

---

## Summary

The application consists of:
- **30+ React components** organized into screens, UI components, and layouts
- **1 notification service** with background task support
- **1 Redux store** with 4 reducers and 4 selectors
- **2 custom hooks** for theme management
- **Helper functions** for parsing, geometric calculations, and formatting
- **TypeScript type definitions** for type safety

All classes and methods are designed to create a weather alert application with navigation functionality, push notifications, and simulation mode.
