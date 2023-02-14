import { createGlobalStyle } from "styled-components";
import InterFont from "../assets/Inter/Inter-VariableFont_slnt,wght.ttf";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Inter';
    src: url(${InterFont}) format('truetype');
    font-weight: 100;200;300;400;500;600;700;800;900;
    font-style: normal;
    font-display: auto;
  }
`;
