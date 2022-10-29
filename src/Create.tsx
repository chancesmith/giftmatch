import {
  Grid,
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";

interface Match {
  id: string;
  title: string;
  names: string[];
  matches: [string, string][];
  createdAt: string;
  updatedAt: string;
}

const defaultMatch: Match = {
  id: new Date().toISOString(),
  title: "",
  names: [],
  matches: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultSelectedList = "brand-new-list";

export const Create = () => {
  const [newName, setNewName] = React.useState<string>("");
  const [list, setList] = React.useState<Match>(defaultMatch);
  const [selectedHistoryList, setSelectedHistoryList] =
    React.useState(defaultSelectedList);
  let matchHistory = getMatchesHistory();

  useEffect(() => {
    matchHistory = getMatchesHistory();
  }, [list.title]);

  const handleNewName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setNewName(name);
  };

  const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    const oldTitle = list.title;
    const newList = {
      ...list,
      id: title,
      title,
    };
    setList(newList);

    // change the title of the key in localStorage
    if (selectedHistoryList !== defaultSelectedList) {
      const oldList = matchHistory[oldTitle];

      delete matchHistory[oldTitle];

      // update match history
      const newMatchesHistory = {
        ...matchHistory,
        [title]: newList,
      };
      updateMatchesHistory(newMatchesHistory);
    }
  };

  const makeMatches = (names: string[]) => {
    // shuffle names
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    console.log({ names, shuffled });

    // make matches by shifting names by 1
    const namesToShift = [...shuffled];
    const firstName = namesToShift.shift();
    const shiftedNames = firstName ? [...namesToShift, firstName] : [];

    const newMatches: [string, string][] = [];
    for (let i = 0; i < names.length; i++) {
      newMatches.push([shuffled[i], shiftedNames[i]]);
    }
    // sort by first match name
    newMatches.sort((a, b) => a[0].localeCompare(b[0]));

    return newMatches.sort(() => Math.random() - 0.5);
  };

  const handleAddName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newName.length === 0) {
      alert(`Name can't be empty`);
      return;
    }

    const newNames = [...list.names, newName];
    const newMatch: Match = {
      ...list,
      names: newNames.sort(),
      matches: makeMatches(newNames),
      updatedAt: new Date().toISOString(),
    };

    setList(newMatch);
    setSelectedHistoryList(newMatch.title);
    setNewName("");

    matchHistory = getMatchesHistory();

    // update match history
    const newMatchesHistory = {
      ...matchHistory,
      [newMatch.id]: newMatch,
    };
    updateMatchesHistory(newMatchesHistory);
  };

  const handleDeleteName = (name: string) => {
    const newNames = [...list.names];
    newNames.splice(newNames.indexOf(name), 1);
    setList({
      ...list,
      names: newNames,
      matches: makeMatches(newNames),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleMatchSelect = (match: Match) => {
    setSelectedHistoryList(match.id);
    setList(match);
  };

  const handleShuffle = () => {
    const shuffled = makeMatches(list.names.sort());

    setList({ ...list, matches: shuffled });
  };

  const handleNewList = () => {
    setList(defaultMatch);
    setSelectedHistoryList("brand-new-list");
  };

  return (
    <Box sx={{ pt: 8 }}>
      <Typography variant="h3" component="h1">
        Create Gift Exchange List
      </Typography>

      {list.title !== "" && list.names.length > 0 ? (
        <Button variant="contained" onClick={handleNewList}>
          Start A New List
        </Button>
      ) : null}

      <Box sx={{ pt: 1, display: "flex" }}>
        <Box sx={{ pr: 4, pt: 4, flex: 1 }}>
          <form onSubmit={handleAddName}>
            <TextField
              id="newTitle"
              label="Match Title"
              variant="outlined"
              value={list.title}
              onChange={handleNewTitle}
              sx={{ width: "100%" }}
              autoFocus={!list.title}
            />
            {Object.keys(matchHistory).includes(list.title) &&
            defaultSelectedList === selectedHistoryList ? (
              <>
                <Typography variant="body1" sx={{ color: "red", pt: 1 }}>
                  Your title must be unique to your history listing.
                </Typography>
              </>
            ) : null}

            <TextField
              id="newName"
              label="Add Name"
              variant="outlined"
              value={newName}
              onChange={handleNewName}
              sx={{ width: "100%", mt: 3 }}
              autoFocus={!!list.title}
            />
            <Button type="submit" sx={{ display: "none" }}>
              Submit
            </Button>

            {newName !== "" ? (
              <>
                <Typography variant="body1" sx={{ color: "#888", pt: 1 }}>
                  Press Enter to add
                </Typography>
              </>
            ) : null}

            {list.matches.length === 1 ? (
              <>
                <Typography variant="body1" sx={{ color: "#888", pt: 1 }}>
                  💡 Add two names to see matches
                </Typography>
              </>
            ) : null}
          </form>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 150 }} aria-label="simple table">
              <TableBody>
                {list.names.map((name) => (
                  <TableRow
                    key={name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {name}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => handleDeleteName(name)}
                        style={{ color: "red", fontSize: 10 }}
                      >
                        ❌
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ pt: 4, mr: 4, flex: 1 }}>
          {/* // show matches */}
          {list.matches.length > 1 ? (
            <>
              <Typography variant="h4" component="h2">
                Matches
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table sx={{ minWidth: 150 }} aria-label="simple table">
                  <TableBody>
                    {list.matches.map(([name1, name2]) => (
                      <TableRow
                        key={name1}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {name1}
                        </TableCell>
                        <TableCell align="right">{name2}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button onClick={handleShuffle} style={{ color: "blue" }}>
                Shuffle My List
              </Button>
            </>
          ) : null}
        </Box>
        <Box sx={{ pt: 4, flex: 1 }}>
          <Typography variant="h4" component="h2">
            History
          </Typography>
          {/* // show history */}
          {Object.keys(matchHistory).length > 0 ? (
            <>
              {Object.keys(matchHistory).map((item) => {
                const createdAt = new Intl.DateTimeFormat("en-US", {
                  dateStyle: "short",
                }).format(new Date(matchHistory[item].createdAt));
                const updatedAt = new Intl.DateTimeFormat("en-US", {
                  dateStyle: "short",
                }).format(new Date(matchHistory[item].updatedAt));
                return (
                  <Box
                    key={matchHistory[item].id}
                    sx={{
                      color:
                        matchHistory[item].id === list.id ? "#333" : undefined,
                      backgroundColor:
                        matchHistory[item].id === list.id ? "#ccc" : undefined,
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      p: 2,
                      mt: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => handleMatchSelect(matchHistory[item])}
                  >
                    <Typography variant="body1">
                      {matchHistory[item].title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#777" }}>
                      Created: {createdAt}
                    </Typography>
                    {createdAt !== updatedAt ? (
                      <Typography variant="body2" sx={{ color: "#777" }}>
                        Updated: {updatedAt}
                      </Typography>
                    ) : null}
                  </Box>
                );
              })}
            </>
          ) : (
            <Typography>No Histrory. Go create your first list</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

function getMatchesHistory(): Record<string, Match> {
  return JSON.parse(window.localStorage.getItem("matchesHistory") || "{}");
}

function updateMatchesHistory(newMatchesHistory: Record<string, Match>) {
  window.localStorage.setItem(
    "matchesHistory",
    JSON.stringify(newMatchesHistory)
  );
}
