import { List, ListItem } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";

interface Match {
  id: string;
  title: string;
  names: string[];
  matches: [string, string][];
  createdAt: string;
  updatedAt: string;
}

export const Create = () => {
  const [newName, setNewName] = React.useState<string>("");
  const [list, setList] = React.useState<Match>({
    id: new Date().toISOString(),
    title: "",
    names: [],
    matches: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleNewName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setNewName(name);
  };
  const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setList({
      ...list,
      title,
    });
  };

  const makeMatches = (names: string[]) => {
    // shuffle names
    const shuffled = [...names].sort(() => Math.random() - 0.5);

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
    setNewName("");

    // update match history
    const newMatchesHistory = [...getMatchesHistory(), newMatch];
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
    setList(match);
  };

  return (
    <Box sx={{ pt: 8 }}>
      <Typography variant="h1">Create Exchange List</Typography>
      <Box sx={{ pt: 4, display: "flex" }}>
        <Box sx={{ pr: 4, pt: 4, flex: 1 }}>
          <form onSubmit={handleAddName}>
            <TextField
              id="newTitle"
              label="Match Title"
              variant="outlined"
              value={list.title}
              onChange={handleNewTitle}
              sx={{ width: "100%" }}
              autoFocus
            />
            <TextField
              id="newName"
              label="Add Name"
              variant="outlined"
              value={newName}
              onChange={handleNewName}
              sx={{ width: "100%", mt: 3 }}
              autoFocus
            />
            {list.matches.length <= 1 ? (
              <>
                <Typography variant="body1" style={{ color: "grey" }}>
                  Add two names to see matches
                </Typography>
              </>
            ) : null}
          </form>
          <List>
            {list.names.map((name) => (
              <ListItem>
                <Typography key={name} variant="body1">
                  {name}
                  <Button
                    onClick={() => handleDeleteName(name)}
                    style={{ color: "red" }}
                  >
                    🗑
                  </Button>
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ pt: 4, flex: 1 }}>
          {/* // show matches */}
          {list.matches.length > 1 ? (
            <>
              <Typography variant="h2">Matches</Typography>
              {list.matches.map(([name1, name2]) => (
                <Typography key={name1} variant="body1">
                  {name1} - {name2}
                </Typography>
              ))}
              <Button
                onClick={() => makeMatches(list.names)}
                style={{ color: "blue" }}
              >
                Shuffle
              </Button>
            </>
          ) : null}
        </Box>
        <Box sx={{ pt: 4, flex: 1 }}>
          {/* // show history */}
          {getMatchesHistory().length > 0 ? (
            <>
              <Typography variant="h2">History</Typography>
              {getMatchesHistory().map((item) => (
                <Box
                  key={item.id}
                  sx={{ color: item.id === list.id ? "blue" : undefined }}
                >
                  <Typography variant="body1">
                    {item.title} - {item.createdAt}
                    <br />
                    Last updated: {item.updatedAt}
                  </Typography>
                  <Button onClick={() => handleMatchSelect(item)}>
                    Select
                  </Button>
                </Box>
              ))}
            </>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

function getMatchesHistory(): Match[] {
  return JSON.parse(window.localStorage.getItem("matchesHistory") || "[]");
}

function updateMatchesHistory(newMatchesHistory: Match[]) {
  window.localStorage.setItem(
    "matchesHistory",
    JSON.stringify(newMatchesHistory)
  );
}
