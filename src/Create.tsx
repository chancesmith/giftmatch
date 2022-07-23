import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";

export const Create = () => {
  const [newName, setNewName] = React.useState<string>("");
  const [names, setNames] = React.useState<string[]>([]);
  const [matches, setMatches] = React.useState<[string, string][]>([]);

  const handleNewName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setNewName(name);
  };

  const makeMatches = (names: string[]) => {
    // shuffle names
    const shuffled = names.sort(() => Math.random() - 0.5);

    // make matches by shifting names by 1
    const namesToShift = [...names];
    const firstName = namesToShift.shift();
    const shiftedNames = firstName ? [...namesToShift, firstName] : [];

    const newMatches: [string, string][] = [];
    for (let i = 0; i < names.length; i++) {
      newMatches.push([shuffled[i], shiftedNames[i]]);
    }
    // sort by first match name
    newMatches.sort((a, b) => a[0].localeCompare(b[0]));

    setMatches(newMatches.sort(() => Math.random() - 0.5));
  };

  const handleAddName = (event: React.FormEventHandler<HTMLFormElement>) => {
    event.preventDefault();
    if (newName.length === 0) {
      alert(`Name can't be empty`);
      return;
    }
    const newNames = [...names, newName];
    setNames(newNames);
    setNewName("");
    makeMatches(newNames);
  };

  const handleDeleteName = (name: string) => {
    const newNames = [...names];
    newNames.splice(newNames.indexOf(name), 1);
    setNames(newNames);
    makeMatches(newNames);
  };

  return (
    <>
      <Typography variant="h1">Create Exchange List</Typography>
      <form onSubmit={handleAddName}>
        <TextField
          id="newName"
          label="Add Name"
          variant="outlined"
          value={newName}
          onChange={handleNewName}
        />
        {matches.length <= 1 ? (
          <>
            <Typography variant="body1" style={{ color: "grey" }}>
              Add two names to see matches
            </Typography>
          </>
        ) : null}
      </form>
      {names.map((name) => (
        <Typography key={name} variant="body1">
          {name}
          <Button onClick={() => handleDeleteName(name)}>Delete</Button>
        </Typography>
      ))}
      {/* // show matches */}
      {matches.length > 1 ? (
        <>
          <Typography variant="h2">Matches</Typography>
          {matches.map(([name1, name2]) => (
            <Typography key={name1} variant="body1">
              {name1} - {name2}
            </Typography>
          ))}
        </>
      ) : null}
    </>
  );
};
