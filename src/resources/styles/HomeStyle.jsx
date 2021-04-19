import colors from 'resources/Colors.js'

const homeStyle = theme => ({
  
  title: {
    fontSize: '40px',
    color: colors.primaryColor,
    fontWeight: 'bold',
  },

  buttonPrimary: {
    borderRadius: '10px',
    background: colors.primaryColor,
    color: colors.white,
    fontFamily:"Roboto",
    "&,&:focus,&:hover": {
      background: colors.primaryColor
    }
  },

  buttonSecondary: {
    borderRadius: '10px',
    color: colors.primaryColor,
    fontFamily:"Roboto",
    textTransform: 'none',
    fontSize: '15px',
    fontWeight: 500,
  },

  tableHeader: {
    // backgroundColor: '#EEEEEE',
    fontFamily: 'Roboto'
  },

  tableTitle: {
    fontWeight: 'bold',
    fontFamily: 'Roboto'
  },

  tableMessage: {
    fontFamily: 'Roboto',
    color: colors.tableMessage,
    textAlign: 'center',
    marginTop: '90px',
    marginBottom: '120px',
  },

  searchRoot: {
    display: 'flex',
    marginBottom: 20,
    width: '100%',
    fontFamily: 'Roboto'
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontFamily: 'Roboto'
  },

  searchIconButton: {
    padding: 10
  },

  searchDivider: {
    width: 1,
    height: 28,
    margin: 4,
  },

  dialogPaper: {
    borderRadius: '20px',
  },

  buttonPrimaryDialog: {
    color: colors.textButtonDialog,
    fontSize: '15px',
    fontWeight: 500,
    fontFamily:"Roboto",
    textTransform: 'none',
  },

  dialogTextTitle: {
    fontSize: '24px',
    color: colors.titleDialog,
    fontWeight: 'bold',
    fontFamily:"Roboto",
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

  gameDetailsDialogAppBar: {
    background: colors.primaryColor,
    position: 'relative',
  },

  iconDialog: {
    color: colors.iconButtonDialog,
  },

  errorText: {
    fontSize: '16px',
    fontWeight: '700',
    fontFamily:"Roboto",
    color: colors.errorText,
    textAlign: 'right',
    marginTop: '10px'
  },
})

export default homeStyle;