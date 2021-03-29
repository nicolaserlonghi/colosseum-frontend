import React from "react"
import withStyles from "@material-ui/core/styles/withStyles"
import SpinnerStyle from "resources/styles/SpinnerStyle.jsx"

import Dialog from '@material-ui/core/Dialog'
import CircularProgress from '@material-ui/core/CircularProgress'

class Spinner extends React.Component {
    constructor(props) {
      super(props)
    }

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