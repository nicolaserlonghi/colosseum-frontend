import Colors from 'resources/Colors.js'

const saveSpaceLayoutStyle = theme => ({
  root: {
    display: 'flex',
    overflow: 'hidden'
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
});

export default saveSpaceLayoutStyle;