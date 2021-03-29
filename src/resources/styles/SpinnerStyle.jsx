import colors from 'resources/Colors.js'

const spinnerStyle = theme => ({
  dialog: {
    background: 'transparent',
    border: 'none',
    boxShadow: 'none'
  },
  
  dialogPaper: {
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    minWidth: 120,
    minHeight: 120,
  },

  spinner: {
    color: colors.primaryColor
  },
})

export default spinnerStyle;