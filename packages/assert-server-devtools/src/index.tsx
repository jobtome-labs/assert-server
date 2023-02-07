import AssertServerDevTools from "./AssertServerDevTools";

export const AssertServerDevtools =
  process.env.NODE_ENV !== "development"
    ? function () {
        return null;
      }
    : AssertServerDevTools;
