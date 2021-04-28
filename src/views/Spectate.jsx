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
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import ExitToAppRounded from '@material-ui/icons/ExitToAppRounded';
import Info from "@material-ui/icons/InfoOutlined";

import SpectateStyle from 'resources/styles/SpectateStyle.jsx';
import { LanguageContext } from 'resources/languages/Language.js';
import Spinner from 'views/Spinner.jsx';
import WebSocket from 'api/WebSocketManager.js';
import Constants from 'Constants.js';
import CanvasManager from 'canvas/CanvasManager.jsx';


class Spectate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      errorDialogStatus: false,
      errorDialogTitle: "",
      errorDialogMessage: false,
      errorDialogButtonAction: null,
      clientSpectate: null,
      matchId: null,
      matchInfo: null,
      matchInfoDialogStatus: false,
      argToList: {},
    }

    const location = this.props.location
    if (location && location.state) {
      this.state.matchId = location.state.matchId;
    } else {
      this.props.history.push('home')
    }

    /* Canvas Manager */
    this.canvasManager = React.createRef();
  }

  async componentDidMount() {
    this.spectateJoin();
  }

  async spectateJoin() {
    try {
      let clientSub = await WebSocket.subscribe({"SpectateJoin": { "id": this.state.matchId }});
      this.setState({ clientSpectate: clientSub })
      clientSub.onmessage = async (message) => {
        if (typeof message.data === 'string') {
          let parsedMessage = WebSocket.messageResponseToJson(message);
          this.manageSpectateMessage(parsedMessage);
        } else {
          this.manageGameBinaryMessage(message.data);
        }
        this.setState({ loading: false });
      }
    } catch(err) {
      console.log('err: ', err);
    }
  }

  manageSpectateMessage(message) {
    let type = Object.keys(message)[0];
    let bodyMessage = message[type];
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
        this.manageSpectateMessageEnded(bodyMessage);
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
        errorDialogStatus: true,
        errorDialogButtonAction: null,
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
      errorDialogStatus: true,
      errorDialogButtonAction: null,
    });
  }

  manageSpectateMessageEnded(bodyMessage) {
    this.canvasManager.current.manageSpectateMessageEnded(bodyMessage);
    let title = this.context.dictionary.spectate.dialogErrorEndTitle
    this.setState({
      errorDialogTitle: title,
      errorDialogMessage: false,
      errorDialogStatus: true,
      errorDialogButtonAction: () => this.setState({ 
        errorDialogStatus: false,
        errorDialogMessage: false,
        errorDialogTitle: "",
      })
    });
  }

  manageSpectateMessageStarted(bodyMessage) {
    if(this.canvasManager && this.canvasManager.current)
      this.canvasManager.current.manageSpectateMessageStarted(bodyMessage);
    else
      console.log("ERR in manageSpectateMessageStarted: canvasManager is null");
  }

  manageSpectateMessageSynced(bodyMessage) {
    if(this.canvasManager && this.canvasManager.current)
      this.canvasManager.current.manageSpectateMessageSynced(bodyMessage);
    else
      console.log("ERR in manageSpectateMessageSynced: canvasManager is null");
  }

  manageGameBinaryMessage(bodyMessage) {
    if(this.canvasManager && this.canvasManager.current) 
      this.canvasManager.current.manageGameBinaryMessage(bodyMessage);
    else
      console.log("ERR in manageGameBinaryMessage: canvasManager is null");
  }


  render() {
    const classes = this.props.classes;

    const errorDialog = (
      <Dialog 
        open={this.state.errorDialogStatus} 
        onClose={
          this.state.errorDialogButtonAction ?
            this.state.errorDialogButtonAction
          :
            () => this.goToHomePage()
        }
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
            onClick={
              this.state.errorDialogButtonAction ?
                this.state.errorDialogButtonAction
              :
                () => this.goToHomePage()
            }
          >
            { this.context.dictionary.general.ok }
          </Button>
        </DialogActions>
      </Dialog>
    );

    let time, argsListDialog;
    if(this.state.matchInfo) {
      time = new Date(this.state.matchInfo.time * 1000);

      argsListDialog = (
        <Dialog 
          open={this.state.matchInfoDialogStatus} 
          onClose={() => this.matchInfoDialogHandle()}
          scroll={"paper"}
          // PaperProps={{className: classes.dialogPaper}}
        >
          <DialogTitle className={classes.dialogTitle}>
            { this.context.dictionary.spectate.matchInfoDialogTitle }
          </DialogTitle>
          <DialogContent>
            {/* Id */}
            <TextField
              margin="dense"
              label={this.context.dictionary.spectate.matchInfoDialogLabelId}
              defaultValue={this.state.matchInfo.id}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              className={classes.dialogTextField}
            />
            {/* Name */}
            <TextField
              margin="dense"
              label={this.context.dictionary.spectate.matchInfoDialogLabelName}
              defaultValue={this.state.matchInfo.name}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              className={classes.dialogTextField}
            />
            {/* Game */}
            <TextField
              margin="dense"
              label={this.context.dictionary.spectate.matchInfoDialogLabelGame}
              defaultValue={this.state.matchInfo.game}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              className={classes.dialogTextField}
            />
            {/* Players */}
            <TextField
              margin="dense"
              multiline
              rowsMax={4}
              label={this.context.dictionary.spectate.matchInfoDialogLabelPlayers}
              defaultValue={
                this.state.matchInfo.connected.length > 0 ?
                  "(" + this.state.matchInfo.connected.length + "/" + this.state.matchInfo.players +
                    "): " + this.state.matchInfo.connected.join(', ')
                :
                  this.state.matchInfo.connected.length + "/" + this.state.matchInfo.players
              }
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              className={classes.dialogTextField}
            />
            {/* Spectator */}
            <TextField
              margin="dense"
              label={this.context.dictionary.spectate.matchInfoDialogLabelSpectators}  //////////////////////////////////////////////
              defaultValue={this.state.matchInfo.spectators}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              className={classes.dialogTextField}
            />
            {/* Timeout */}
            <TextField
              margin="dense"
              label={this.context.dictionary.spectate.matchInfoDialogLabelTimeout}
              defaultValue={this.state.matchInfo.timeout}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              className={classes.dialogTextField}
            />
            {/* Time */}
            <TextField
              margin="dense"
              label={this.context.dictionary.spectate.matchInfoDialogLabelTime}
              defaultValue={
                this.state.matchInfo.running ?
                  this.context.dictionary.spectate.matchInfoDialogTimeStart + " " + time.getHours() + (time.getMinutes() < 10 ? ':0' : ":") + time.getMinutes()
                :
                  this.context.dictionary.spectate.matchInfoDialogTimeExpires + " " + time.getHours() + (time.getMinutes() < 10 ? ':0' : ":") + time.getMinutes()
              }
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              className={classes.dialogTextField}
            />
            {/* Args */}
            {
              Object.entries(this.state.matchInfo.args).map((item) => (
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={6}>
                    {/* Arg Key */}
                    <TextField
                      margin="dense"
                      label={this.context.dictionary.spectate.matchInfoDialogLabelKey}
                      defaultValue={item[0]}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      className={classes.dialogTextField}
                    />
                  </Grid>
                  {/* Arg Value */}
                  <Grid item xs={6}>
                    <TextField
                      margin="dense"
                      label={this.context.dictionary.spectate.matchInfoDialogLabelValue}
                      defaultValue={item[1]}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      className={classes.dialogTextField}
                    />
                  </Grid>
                </Grid>
              ))
            }
          </DialogContent>
          {/* Action buttons */}
          <DialogActions>
            <Button 
              className={classes.buttonPrimaryDialog}
              onClick={() => this.matchInfoDialogHandle()}
            >
              { this.context.dictionary.general.close }
            </Button>
          </DialogActions>
        </Dialog>
      );
    }



    return (
      <React.Fragment>
        { this.state.loading ?  <Spinner open={this.state.loading} /> : null }

        { errorDialog }
        { argsListDialog }

        {
          this.state.matchInfo ?
            <React.Fragment>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h3" className={classes.title}>
                    { this.state.matchInfo.name || "" }
                  </Typography>
                </Grid>
                <Hidden smDown><Grid item xs={2} /></Hidden>
                <Grid item xs={2}>
                  <Button
                    fullWidth
                    className={classes.buttonPrimary}
                    startIcon={<Info />}
                    onClick={() => this.matchInfoDialogHandle()}
                  >
                    {this.context.dictionary.spectate.buttonMatchInfo}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={2}>
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
              <br/>
              {/* Canvas Manager */}
              <Grid container>
                <Grid item xs={12}>
                  <CanvasManager ref={this.canvasManager} matchInfo={this.state.matchInfo} />
                </Grid>
              </Grid>
            </React.Fragment>
          :
            null
        }
      </React.Fragment>
    )
  }

  matchInfoDialogHandle() {
    let status = this.state.matchInfoDialogStatus;
    this.setState({ matchInfoDialogStatus: !status });
  }

  showArgs(args) {
    this.setState({ argToList: args });
    this.argsListDialogHandle();
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