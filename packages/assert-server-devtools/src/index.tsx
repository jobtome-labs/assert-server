import AssertServerDevTools from "./AssertServerDevTools";

export const AssertServerDevtools =
  process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test"
    ? function () {
        return null;
      }
    : AssertServerDevTools;
