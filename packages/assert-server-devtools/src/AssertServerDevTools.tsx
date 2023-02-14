import { ThemeProvider, defaultTheme as theme } from "./style/Theme";
import CommandDialog from "./components/CommandDialog";
import { useEffect, useState } from "react";
import { GlobalStyle } from "./style/font";

function AssertServerDevtools() {
  const [availablePaths, setAllAvailablePaths] = useState<{}>({});

  // Rewrite is needed from @assert-server/core to expose better API for this
  useEffect(() => {
    const fetchPaths = async () => {
      const response = await fetch("http://localhost:3100/route/all");
      const data = await response.json();

      const handlersByPath = data.reduce((group: any, data: any) => {
        const { path, name, method } = data;
        group[`${method} ${path}`] = group[`${method} ${path}`] ?? [];
        group[`${method} ${path}`].push(name);
        return group;
      }, {});

      setAllAvailablePaths(handlersByPath);
    };

    fetchPaths();
  }, []);

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <CommandDialog availablePaths={availablePaths} />
      </ThemeProvider>
    </>
  );
}

export default AssertServerDevtools;
