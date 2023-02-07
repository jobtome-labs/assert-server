import { styled } from "../utils";

export const Container = styled("button", (_props, theme) => ({
  position: "absolute",
  right: 0,
  width: "25%",
  height: "calc(100% - 40px)",
  backgroundColor: theme.background,
  color: theme.color,
  border: "0px",
  margin: "20px",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: "20px",
}));
