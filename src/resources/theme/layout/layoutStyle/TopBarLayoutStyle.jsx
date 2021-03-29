import Colors from 'resources/Colors.js'

const topBarLayoutStyle = theme => ({
  root: {
    display: 'flex',
  },

  appBar: {
    backgroundColor: Colors.primaryColor,
    height: '64px',
  },

  appBarTitle: {
    color: Colors.white,
    flexGrow: 1,
    fontFamily: 'Roboto'
  },

  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: "20px",
    minHeight: "calc(100vh - 250px)",
    [theme.breakpoints.up('md')]: {
      marginLeft: "120px",
      marginRight: "120px",
    },
  },

  toolbar: theme.mixins.toolbar,
  
  container: {
    marginBottom: '100px',
  }
});

export default topBarLayoutStyle;