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
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';

import ExitToAppRounded from '@material-ui/icons/ExitToAppRounded';
import Check from '@material-ui/icons/CheckCircleRounded';
import Cancel from '@material-ui/icons/CancelRounded';
import Info from "@material-ui/icons/InfoRounded";

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
      argsListDialogStatus: false,
      argToList: {},
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

        // let text = await (new Response(message.data)).text();
        // console.log('text: ', text);


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

  manageSpectateMessageEnd(bodyMessage) {
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

    const argsListDialog = (
      <Dialog 
        open={this.state.argsListDialogStatus} 
        onClose={() => this.argsListDialogHandle()}
        scroll={"paper"}
        // PaperProps={{className: classes.dialogPaper}}
      >
        <DialogTitle className={classes.dialogTitle}>
          { this.context.dictionary.spectate.argsListDialogTitle }
        </DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  { this.context.dictionary.spectate.argsListDialogKeyHeader }
                </TableCell>
                <TableCell align="center">
                  { this.context.dictionary.spectate.argsListDialogValueHeader }
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Object.entries(this.state.argToList).map((item) => (
                  <TableRow key={item[0]}>
                    <TableCell>{item[0]}</TableCell>
                    <TableCell align="center">{item[1]}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </DialogContent>
        {/* Action buttons */}
        <DialogActions>
          <Button 
            className={classes.buttonPrimaryDialog}
            onClick={() => this.argsListDialogHandle()}
          >
            { this.context.dictionary.general.close }
          </Button>
        </DialogActions>
      </Dialog>
    );

    let headCells, time;
    if(this.state.matchInfo) {
      headCells = [
        { id: "id", numeric: false, label: this.context.dictionary.spectate.tableHeaderId },
        { id: "name", numeric: false, label: this.context.dictionary.spectate.tableHeaderName },
        { id: "game", numeric: false, label: this.context.dictionary.spectate.tableHeaderGame },
        { id: "players", numeric: true, label: this.context.dictionary.spectate.tableHeaderPlayers },
        { id: "spectators", numeric: true, label: this.context.dictionary.spectate.tableHeaderSpectators },
        { id: "verified", numeric: false, label: this.context.dictionary.spectate.tableHeaderVerified },
        { id: "password", numeric: false, label: this.context.dictionary.spectate.tableHeaderPassword },
        { id: "timeout", numeric: false, label: this.context.dictionary.spectate.tableHeaderTimeout },
        { id: "time", numeric: false, label: this.context.dictionary.spectate.tableHeaderTime },
        { id: "args", numeric: false, label: this.context.dictionary.spectate.tableHeaderArgs },
      ]
      time = new Date(this.state.matchInfo.time * 1000);
    }


    return (
      <React.Fragment>
        { this.state.loading ?  <Spinner open={this.state.loading} /> : null }

        { errorDialog }
        { argsListDialog }

        {
          this.state.matchInfo ?
            <React.Fragment>
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
              <TableContainer component={Paper}>
                <Table>
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      {
                        headCells.map(headCell => (
                          <TableCell key={headCell.id}>
                            {headCell.label}
                          </TableCell>
                        ), this)
                      }
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow 
                      key={this.state.matchInfo.id} 
                      className={classes.tableRow}
                      hover
                      tabIndex={-1}
                    >
                      <TableCell>{this.state.matchInfo.id}</TableCell>
                      <TableCell>{this.state.matchInfo.name}</TableCell>
                      <TableCell>{this.state.matchInfo.game}</TableCell>
                      <TableCell>{(this.state.matchInfo.connected.length) + "/" + this.state.matchInfo.players}</TableCell>
                      <TableCell>{this.state.matchInfo.spectators}</TableCell>
                      <TableCell>
                        {
                          this.state.matchInfo.verified ?
                            <IconButton 
                              size="small"
                              disabled
                            >
                              <Check className={classes.tableIcon}/>
                            </IconButton>
                          :
                            <IconButton 
                              size="small"
                              disabled
                            >
                              <Cancel className={classes.tableIcon}/>
                            </IconButton>
                        }
                      </TableCell>
                      <TableCell>
                        {
                          this.state.matchInfo.password ?
                            <IconButton 
                              size="small"
                              disabled
                            >
                              <Check className={classes.tableIcon}/>
                            </IconButton>
                          :
                            <IconButton 
                              size="small"
                              disabled
                            >
                              <Cancel className={classes.tableIcon}/>
                            </IconButton>
                        }
                      </TableCell>
                      <TableCell>{this.state.matchInfo.timeout}</TableCell>
                      <TableCell>
                        {
                          this.state.matchInfo.running ?
                            this.context.dictionary.spectate.tableTimeStart + " " + time.getHours() + (time.getMinutes() < 10 ? ':0' : ":") + time.getMinutes()
                          :
                            this.context.dictionary.spectate.tableTimeExpires + " " + time.getHours() + (time.getMinutes() < 10 ? ':0' : ":") + time.getMinutes()
                        }
                      </TableCell>
                      <TableCell>
                        {
                          Object.keys(this.state.matchInfo.args).length > 0 ?
                            <IconButton 
                              size="small"
                              onClick={() => this.showArgs(this.state.matchInfo.args)}
                            >
                              <Info />
                            </IconButton>
                          :
                          <IconButton 
                            size="small"
                            disabled
                          >
                            <Cancel className={classes.tableIcon}/>
                          </IconButton>
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <br/><br/>
              {/* Canvas Manager */}
              <CanvasManager />
            </React.Fragment>
          :
            null
        }
      </React.Fragment>
    )
  }

  argsListDialogHandle() {
    let status = this.state.argsListDialogStatus;
    this.setState({ argsListDialogStatus: !status });
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