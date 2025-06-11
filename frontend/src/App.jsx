import { useState } from "react";
import "./App.css";
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import axios from "axios";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("professional");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        {
          emailContent,
          tone,
        }
      );
      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      setError("Failed to Generate Email Reply. Please Try Again");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedReply);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h3" component="h1" fontWeight={600} gutterBottom>
          ✉️ Email Reply Generator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Instantly craft well-toned responses using AI
        </Typography>
      </Box>

      <Card
        elevation={4}
        sx={{
          borderRadius: 4,
          p: 4,
          backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="tone-label">Tone</InputLabel>
              <Select
                labelId="tone-label"
                value={tone}
                label="Tone"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            label="Paste Email Content Here"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ fontSize: "1rem" }}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            sx={{
              px: 5,
              py: 1.5,
              fontWeight: 500,
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Generate Reply"
            )}
          </Button>
        </CardActions>
      </Card>

      {error && (
        <Box mt={4}>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </Box>
      )}

      {generatedReply && (
        <Box mt={4}>
          <Card
            sx={{
              backgroundColor: "#f9f9f9",
              border: "1px solid #e0e0e0",
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generated Reply:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="filled"
                value={generatedReply}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mt: 2 }}
              />
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
              <Button variant="outlined" onClick={handleCopyToClipboard}>
                Copy to Clipboard
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Container>
  );
}

export default App;
