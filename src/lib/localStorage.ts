export const saveToLocalStorage = <T>(key: string, value: T): boolean => {
  try {
    // Check if localStorage is available
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage is not available");
      return false;
    }

    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage with key "${key}":`, error);
    return false;
  }
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    // Check if localStorage is available
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage is not available");
      return null;
    }

    const serializedValue = localStorage.getItem(key);

    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error(
      `Error retrieving from localStorage with key "${key}":`,
      error,
    );
    return null;
  }
};

export const removeFromLocalStorage = (key: string): boolean => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage is not available");
      return false;
    }

    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage with key "${key}":`, error);
    return false;
  }
};

export const existsInLocalStorage = (key: string): boolean => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }

    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage key "${key}":`, error);
    return false;
  }
};
