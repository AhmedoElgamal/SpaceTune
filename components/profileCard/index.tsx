// IMPORTS
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";

// STYLES
const styles = {
  details: {
    padding: "2rem",
    borderTop: "1px solid #e1e1e1",
  },
  value: {
    padding: "1rem 2rem",
    borderTop: "1px solid #e1e1e1",
    color: "#899499",
  },
};

//APP
export default function ProfileCard() {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = React.useState<
    string | ArrayBuffer | null
  >(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log([...data.keys()]);

    // const password = data.get("password");
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setSelectedFile(e?.target?.result ?? null);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Card variant="outlined">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {/* CARD HEADER START */}
          <Grid
            item
            paddingY={3}
            xs={12}
            sx={{
              width: "100",
              alignItems: "center",
            }}
          >
            <input
              accept="image/*"
              id="contained-button-file"
              name="image"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label
              htmlFor="contained-button-file"
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <CameraAltIcon
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  zIndex: 1,
                  width: 25,
                  height: 25,
                  padding: "3px",
                  backgroundColor: "#ddd",
                  borderRadius: "50px",
                }}
              />
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: "secondary.main",
                  height: 100,
                  width: 100,
                }}
                src={
                  selectedFile
                    ? selectedFile.toString()
                    : session?.user?.image?.toString()
                }
              ></Avatar>
            </label>
          </Grid>
          {/* CARD HEADER END */}

          {/* DETAILS */}
          <Grid container>
            <Grid item xs={5} sx={{ textAlign: "right" }}>
              <Typography style={styles.details}>Name</Typography>
              <Typography style={styles.details}>Email</Typography>
            </Grid>
            {/* VALUES */}
            <Grid item xs={6} sx={{ textAlign: "left" }}>
              <TextField
                style={styles.value}
                value={session?.user?.name}
                name="name"
              ></TextField>
              <TextField
                style={styles.value}
                value={session?.user?.email}
                name="email"
              ></TextField>
            </Grid>
          </Grid>

          {/* BUTTON */}
          <Grid item style={styles.details} sx={{ width: "100%" }}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ width: "99%", p: 1, my: 2 }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
