import Colors from 'resources/Colors.js'

const topBarLayoutStyle = theme => ({
  root: {
    display: 'flex',
  },

  appBar: {
    backgroundColor: Colors.backgroundAppBar,
    height: '64px',
  },

  appBarTitle: {
    color: Colors.textAppBar,
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
  },

  cardHeaderContainer: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      padding: 0
    },
  },
  
  menu: {
    color: Colors.textMenu,
  },

  menuIcon: {
    backgroundColor: Colors.white,
    marginRight: '10px'
  },

  languageMenu: {
    color: Colors.textAppBar, 
    fontSize: '15px',
    textTransform: 'none',
  },
});

export default topBarLayoutStyle;