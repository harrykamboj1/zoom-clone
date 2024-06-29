import { Typography, AppBar, makeStyles } from "@material-ui/core";
import Notification from "./components/notification";
import Option from "./components/options";
import VideoPlayer from "./components/videoplayer";

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '600px',
    border: '2px solid black',

    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  image: {
    marginLeft: '15px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography variant="h3" align="center">
          Video Chat
        </Typography>
      </AppBar>
      <VideoPlayer />
      <Option>
        <Notification />
      </Option>

    </div>
  );
}

export default App;
