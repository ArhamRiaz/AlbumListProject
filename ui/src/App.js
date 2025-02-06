import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SignUp } from './components/SignUpY';
import { AddAlbum } from './components/AddAlbum';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SignUp/>
      <AddAlbum/>
    </ThemeProvider>
  );
}

//export default App;
