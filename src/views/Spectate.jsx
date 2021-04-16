import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

import ExitToAppRounded from '@material-ui/icons/ExitToAppRounded';

import SpectateStyle from 'resources/styles/SpectateStyle.jsx';
import { LanguageContext } from 'resources/languages/Language.js';
import Spinner from 'views/Spinner.jsx';
import WebSocket from 'api/WebSocketManager.js';
import Constants from 'Constants.js';


class Spectate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      errorDialogStatus: false,
      errorDialogTitle: "",
      errorDialogMessage: false,
      clientSpectate: null,
      matchId: null,
      matchInfo: {},

    }

    const location = this.props.location
    if (location && location.state) {
      this.state.matchId = location.state.matchId;
    } else {
      this.props.history.push('home')
    }
  }

  async componentDidMount() {
    this.spectateJoin();
  }

  async spectateJoin() {
    try {
      let clientSub = await WebSocket.subscribe({"SpectateJoin": { "id": this.state.matchId }});
      this.setState({ clientSpectate: clientSub })
      clientSub.onmessage = async (message) => {
        let parsedMessage = WebSocket.messageResponseToJson(message);
        this.manageSpectateMessage(parsedMessage);
        this.setState({ loading: false });
      }
    } catch(err) {
      console.log('err: ', err);
    }
  }

  manageSpectateMessage(message) {
    let type = Object.keys(message)[0];
    console.log('type: ', type);
    let bodyMessage = message[type];
    console.log('bodyMessage: ', bodyMessage);
    switch(type) {
      case Constants.spectateMessageJoined:
        this.manageSpectateMessageJoined(bodyMessage);
        break;
      case Constants.lobbyMessageUpdate:
        this.manageLobbyMessageUpdate(bodyMessage);
        break;
      case Constants.lobbyMessageDelete:
        this.manageLobbyMessageDelete(bodyMessage);
        break;
      case Constants.spectateMessageEnd:
        this.manageSpectateMessageEnd(bodyMessage);
        break;
      case Constants.spectateMessageStarted:
        this.manageSpectateMessageStarted(bodyMessage);
        break;
      case Constants.spectateMessageSynced:
        this.manageSpectateMessageSynced(bodyMessage);
        break;
      default:
        console.log("ERR: I don't know the lobby message type " + message);
    }
  }

  manageSpectateMessageJoined(bodyMessage) {
    let info = bodyMessage.info;
    if('Err' in info) {
      let title = this.context.dictionary.spectate.dialogErrorTitle;
      let message = this.context.dictionary.error.error + info.Err + ".";
      this.setState({
        errorDialogTitle: title,
        errorDialogMessage: message,
        errorDialogStatus: true
      });
    } else if('Ok' in info) {
      let matchInfo = info.Ok;
      this.setState({ matchInfo: matchInfo });
    }
  }

  manageLobbyMessageUpdate(bodyMessage) {
    let updateItem = bodyMessage.info;
    this.setState({ matchInfo: updateItem });
  }

  manageLobbyMessageDelete(bodyMessage) {
    let title = this.context.dictionary.spectate.dialogErrorDeleteTitle
    this.setState({
      errorDialogTitle: title,
      errorDialogMessage: false,
      errorDialogStatus: true
    });
  }

  manageSpectateMessageEnd(bodyMessage) {
    let title = this.context.dictionary.spectate.dialogErrorEndTitle
    this.setState({
      errorDialogTitle: title,
      errorDialogMessage: false,
      errorDialogStatus: true
    });
  }

  manageSpectateMessageStarted(bodyMessage) {
    console.log('spectateMessageStarted: ', bodyMessage);
  }

  manageSpectateMessageSynced(bodyMessage) {
    console.log('manageSpectateMessageSynced: ', bodyMessage);
  }



  render() {
    const classes = this.props.classes;

    const errorDialog = (
      <Dialog 
        open={this.state.errorDialogStatus} 
        onClose={() => {
          this.setState({ errorDialogStatus: false });
          this.goToHomePage();
        }}
        fullWidth={true}
        // PaperProps={{className: classes.dialogPaper}}
      >
        <DialogTitle className={classes.dialogTitle}>
          { this.state.errorDialogTitle || this.context.dictionary.error.error }
        </DialogTitle>
        {
          this.state.errorDialogMessage ?
            <DialogContent>
              <DialogContentText className={classes.dialogTextField}>
                { this.state.errorDialogMessage }
              </DialogContentText>
            </DialogContent>
          :
            null
        }
        {/* Action buttons */}
        <DialogActions>
          <Button 
            className={classes.buttonPrimaryDialog}
            onClick={() => this.goToHomePage()}
          >
            { this.context.dictionary.general.ok }
          </Button>
        </DialogActions>
      </Dialog>
    );
    
    return (
      <React.Fragment>
        { this.state.loading ?  <Spinner open={this.state.loading} /> : null }

        { errorDialog } 

        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography variant="h3" className={classes.title}>
              { this.state.matchInfo.name || "" }
            </Typography>
          </Grid>
          <Hidden smDown><Grid item xs={3} /></Hidden>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              className={classes.buttonPrimary}
              startIcon={<ExitToAppRounded />}
              onClick={() => this.goToHomePage()}
            >
              {this.context.dictionary.spectate.buttonLeave}
            </Button>
          </Grid>
        </Grid>
        <br/><br/>

      </React.Fragment>
    )
  }

  async goToHomePage() {
    if(this.state.clientSpectate) {
      try {
        let body = {"SpectateLeave": {}};
        await WebSocket.unsubscribe(body , this.state.clientSpectate);
        this.setState({ clientSpectate: null })
      } catch(err) {
        console.log('err: ', err);
      }
    }
    this.props.history.push('home');
  }
}

Spectate.contextType = LanguageContext;
export default withStyles(SpectateStyle)(Spectate);