import * as React from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import {
  sortProducts,
  sortProductsDesc,
  sortProductsForPrice,
  sortProductsForPriceDesc,
} from "../redux/appSlice";
import { useDispatch } from "react-redux";

function Sort() {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          sx={{
            flex: 1,
            minWidth: "100px",
            maxWidth: "100%",
            backgroundColor: "rgba(0,0,0,0.05)",
            color: "black",
          }}
          variant="contained"
        >
          Sort by:
        </Button>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal={false}
          sx={{
            zIndex: 9999,
          }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper
                sx={{
                  zIndex: 9999,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    sx={{
                      zIndex: 9999,
                    }}
                  >
                    <MenuItem
                      onClick={() => dispatch(sortProducts("asc"))}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255, 107, 53, 0.1)",
                        },
                      }}
                    >
                      A to Z
                    </MenuItem>
                    <MenuItem
                      onClick={() => dispatch(sortProductsDesc("desc"))}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255, 107, 53, 0.1)",
                        },
                      }}
                    >
                      Z to A
                    </MenuItem>
                    <MenuItem
                      onClick={() => dispatch(sortProductsForPriceDesc("desc"))}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255, 107, 53, 0.1)",
                        },
                      }}
                    >
                      high to low price
                    </MenuItem>
                    <MenuItem
                      onClick={() => dispatch(sortProductsForPrice("asc"))}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255, 107, 53, 0.1)",
                        },
                      }}
                    >
                      low to high price
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}

export default Sort;
