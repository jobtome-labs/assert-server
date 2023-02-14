import { useState, useEffect } from "react";
import { Command } from "cmdk";
import styled from "../styled";

//TODO: move style to proper folder --> got error TS2742 when I tried to do that
const StyleCommandDialog = styled(Command.Dialog)`
  background: linear-gradient(136.61deg, #27282b 13.72%, #2d2e31 74.3%);
  border-radius: 10px;
  font-size: 16px;
  line-height: 1.4;
  margin: 0;
  box-shadow: 0 16px 70px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  color: white;
  box-sizing: border-box;
  font-family: "Inter", --apple-system, BlinkMacSystemFont, Segoe UI, Roboto;
`;

const StyledInput = styled(Command.Input)`
  border: none;
  width: 100%;
  font-size: 16px;
  padding: 20px;
  outline: none;
  background: var(--bg);
  color: #ededed;
  border-bottom: 1px solid #343434;
  border-radius: 0;
  caret-color: #6e5ed2;
  margin: 0;
  box-sizing: border-box;
`;

const StyledItem = styled(Command.Item)`
  content-visibility: auto;
  cursor: pointer;
  height: 60px;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #ededed;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  will-change: background, color;
  transition: all 0.15s ease;
  transition-property: none;
  position: relative;
  cursor: auto;
  display: flex;
  flex: 1;
  justify-content: space-between;
  border-bottom: 1px solid #343434;
  &:hover {
    background: #232323;
  }
`;

const StyledEmpty = styled(Command.Empty)`
  content-visibility: auto;
  cursor: pointer;
  height: 48px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  color: #ededed;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  will-change: background, color;
  transition: all 0.15s ease;
  transition-property: none;
  position: relative;
`;

const StyledList = styled(Command.List)`
  height: 400px;
  overflow-y: auto;
  width: 640px;
`;

const Badge = styled("div")`
  font-size: 10px;
  color: #fff;
  border: 0.5px solid #fff;
  border-radius: 4px;
  padding: 5px;
  width: 50px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const ListItemPath = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledSelect = styled("select")`
  background: #343434;
  border: none;
  color: #ededed;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  font-family: "Inter", --apple-system, BlinkMacSystemFont, Segoe UI, Roboto;
  cursor: pointer;
  outline: none;
  margin: 0;
  width: 200px;
  box-sizing: border-box;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  &:focus {
    border: 1px solid #6e5ed2;
  }
`;

const StyledOption = styled("option")`
  background: #343434;
  border: none;
  color: #ededed;
  padding: 10px;
  border-radius: 4px;
  font-size: 10px;
  font-family: "Inter", --apple-system, BlinkMacSystemFont, Segoe UI, Roboto;
  cursor: pointer;
  outline: none;
  margin: 0;
  text-align: center;
  box-sizing: border-box;
`;

const CommandMenu = ({ availablePaths }: { availablePaths: any }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: any) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // TODO: Improve code
  const setHandler = ({ path, handler }: { path: any; handler: any }) => {
    fetch("http://localhost:3100/route/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: path.split(" ")[1],
        name: handler,
      }),
    });
  };

  const getMethodFromPath = (path: string) => {
    return path.split(" ")[0];
  };

  const getRouteFromPath = (path: string) => {
    return path.split(" ")[1];
  };

  return (
    <StyleCommandDialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
    >
      <StyledInput placeholder="Search for paths or handlers" />
      <StyledList>
        <StyledEmpty>No path or handlers found</StyledEmpty>

        <Command.Group>
          {Object.entries(availablePaths).map(
            ([path, handlers]: [any, any]) => (
              <StyledItem>
                <ListItemPath style={{ display: "flex", alignItems: "center" }}>
                  <Badge> {getMethodFromPath(path)}</Badge>
                  {getRouteFromPath(path)}
                </ListItemPath>
                <StyledSelect
                  onChange={(e) => {
                    setHandler({
                      path: path,
                      handler: e.target.value,
                    });
                  }}
                >
                  {handlers.map((handler: any) => (
                    <StyledOption>{handler}</StyledOption>
                  ))}
                </StyledSelect>
              </StyledItem>
            )
          )}
        </Command.Group>
      </StyledList>
    </StyleCommandDialog>
  );
};

export default CommandMenu;
