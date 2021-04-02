import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Dialog from '@material-ui/core/Dialog'
import CircularProgress from '@material-ui/core/CircularProgress'

import SpinnerStyle from 'resources/styles/SpinnerStyle.jsx'


class Spinner extends React.Component {

  render() {
    const classes = this.props.classes
    return (
      <Dialog
        fullScreen={false}
        open={this.props.open}
        className={classes.dialog}
        PaperProps={{className: classes.dialogPaper}}
      >
        <CircularProgress className={classes.spinner} size={95} /> 
      </Dialog>
    )
  }
}

export default withStyles(SpinnerStyle)(Spinner)