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
    "&,&:focus,&:hover": {
      background: colors.primaryColor
    }
  },

  searchRoot: {
    borderRadius: '10px',
    display: 'flex',
  },
  
  searchInput: {
    flex: 1,
    paddingLeft: '16px',
  },

  searchIconButton: {
    padding: 8,
    color: colors.darkGray
  },

  searchDivider: {
    width: 1,
    height: 48,
    margin: 0,
  },

  recapText: {
    fontSize: '18px',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: '25px',
    color: colors.veryDarkGray,
  },

  tableRow: {
    borderRadius: '20px',
    background: colors.white,
    marginTop: '10px',
    padding: '8px',
    borderLeft: '12px solid',
  },
  
  avatar: {
    width: '60px',
    height: '60px',
    color: colors.veryDarkGray,
    backgroundColor: colors.gray,
  },

  avatarText: {
    fontSize: '30px',
    fontWeight: 'bold',
  },

  rowTextTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: colors.veryDarkGray,
  },

  rowText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: colors.veryDarkGray,
  },

  rowMiniText: {
    fontSize: '14px',
    color: colors.veryDarkGray,
  },

  rowTextGoto: {
    fontSize: '14px',
    color: colors.primaryColor,
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