import colors from 'resources/Colors.js'

const topBarLayoutStyle = theme => ({
  root: {
    display: 'flex',
  },

  appBar: {
    backgroundColor: colors.backgroundAppBar,
    height: '64px',
  },

  appBarTitle: {
    color: colors.textAppBar,
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

  menu: {
    color: colors.textMenu,
  },

  menuIcon: {
    backgroundColor: colors.white,
    marginRight: '10px'
  },

  dialogTextField: {
    fontFamily:"Roboto",
    "& label.Mui-focused": {
      color: colors.textButtonDialog,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: colors.textButtonDialog,
    }
  },

  buttonPrimaryDialog: {
    color: colors.textButtonDialog,
    fontSize: '15px',
    fontWeight: 500,
    fontFamily:"Roboto",
    textTransform: 'none',
  },

  errorText: {
    fontSize: '16px',
    fontWeight: '700',
    fontFamily:"Roboto",
    color: colors.errorText,
    textAlign: 'left',
    marginTop: '10px'
  },
});

export default topBarLayoutStyle;