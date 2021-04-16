import colors from 'resources/Colors.js'

const spectateStyle = theme => ({
  
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

export default spectateStyle;