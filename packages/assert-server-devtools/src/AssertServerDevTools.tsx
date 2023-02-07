import { ThemeProvider, defaultTheme as theme } from "./style/Theme";
import { Container } from "./style/Container";

function AssertServerDevtools() {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <div> This is the DevTool for assert-server </div>
      </Container>
    </ThemeProvider>
  );
}

export default AssertServerDevtools;
