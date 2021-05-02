import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableContainer from '@material-ui/core/TableContainer';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import RightIcon from '@material-ui/icons/KeyboardArrowRight';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Search from '@material-ui/icons/Search';
import Check from '@material-ui/icons/CheckCircleRounded';
import Cancel from '@material-ui/icons/CancelRounded';
import Close from '@material-ui/icons/CloseRounded';
import AddCircle from '@material-ui/icons/AddCircleOutlineRounded';
import DeleteIcon from "@material-ui/icons/DeleteRounded";
import ExpandMore from "@material-ui/icons/ExpandMoreRounded";
import Info from "@material-ui/icons/InfoRounded";

import ReactMarkdown from 'react-markdown';

import HomeStyle from 'resources/styles/HomeStyle.jsx';
import { LanguageContext } from 'resources/languages/Language.js';
import Spinner from 'views/Spinner.jsx';
import WebSocket from 'api/WebSocketManager.js';
import Constants from 'Constants.js';


class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      clientLobbySubscribe: null,
      rowsPerPage: 10,
      pageNumber: 0,
      order: "asc",
      orderBy: 'name',
      passwordVisible: false,
      verificationVisible: false,
      emptyDialogError: false,
      networkDialogError: false,
      incorrectDataDialogError: false,
      errorFromServer: false,
      newGameDialogStatus: false,
      newGameDialogAdvancedSettings: false,
      newGameDialogData: {
        name: null,
        game: null,
        params: {
          players: null,
          bots: null,
          timeout: ""
        },
        args: {},
        password: null,
        verification: null,
      },
      argsElement: [],
      gameList: [],
      gameListDialogStatus: false,
      gameDetailsDialogStatus: false,
      gameName: "",
      gameDescription: "",
      lobbyList: [],
      lobbyListBackup: [],
      matchInfoDialogStatus: false,
      matchDialogInfo: null,
    }
  }

  async componentDidMount() {
    this.getGameList();
    this.lobbySubscribe();
  }

  async getGameList() {
    try {
      let result = await WebSocket.sendJson({"GameList": {}});
      this.setState({ gameList: result.GameList.games });
    } catch(err) {
      console.log('err: ', err);
    }
  }

  async lobbySubscribe() {
    try {  
      let clientLobbySubscribe = await WebSocket.subscribe({"LobbySubscribe": {}});
      this.setState({ clientLobbySubscribe: clientLobbySubscribe });
      clientLobbySubscribe.onmessage = async (message) => {
        let parsedMessage = WebSocket.messageResponseToJson(message);
        this.manageLobbyMessage(parsedMessage);
        this.setState({ loading: false });
      }
    } catch(err) {
      console.log('err: ', err);
    }
  }

  manageLobbyMessage(message) {
    let type = Object.keys(message)[0];
    let bodyMessage = message[type];
    switch(type) {
      case Constants.lobbyMessageSubscribed:
        this.manageLobbyMessageSubscribed(bodyMessage);
        break;
      case Constants.lobbyMessageNew:
        this.manageLobbyMessageNew(bodyMessage);
        break;
      case Constants.lobbyMessageUpdate:
        this.manageLobbyMessageUpdate(bodyMessage);
        break;
      case Constants.lobbyMessageDelete:
        this.manageLobbyMessageDelete(bodyMessage);
        break;
      default:
        console.log("ERR: I don't know the lobby message type " + message);
    }
  }

  manageLobbyMessageSubscribed(bodyMessage) {
    let lobbyList = bodyMessage.seed;
    this.setState({ lobbyList: lobbyList, lobbyListBackup: lobbyList});
  }
  
  manageLobbyMessageNew(bodyMessage) {
    let newItem = bodyMessage.info;
    let lobbyList = this.state.lobbyList;
    lobbyList.push(newItem);
    this.setState({ lobbyList: lobbyList, lobbyListBackup: lobbyList});
  }

  manageLobbyMessageUpdate(bodyMessage) {
    let updateItem = bodyMessage.info;
    let lobbyList = this.state.lobbyList;
    lobbyList.every((element, i) => {
      if(element.id === updateItem.id) {
        lobbyList[i] = updateItem;
        return false;
      } else
        return true;
    });
    this.setState({ lobbyList: lobbyList, lobbyListBackup: lobbyList});
  }

  manageLobbyMessageDelete(bodyMessage) {
    let deleteItemId = bodyMessage.id;
    let lobbyList = this.state.lobbyList;
    lobbyList.every((element, i) => {
      if(element.id === deleteItemId) {
        lobbyList.splice(i, 1);
        return false;
      } else
        return true;
    });
    this.setState({ lobbyList: lobbyList, lobbyListBackup: lobbyList});
  }


  render() {
    const classes = this.props.classes;

    const newGameDialog = (
      <Dialog 
        open={this.state.newGameDialogStatus} 
        onClose={() => this.newGameDialogHandle()}
        fullWidth={true}
        // PaperProps={{className: classes.dialogPaper}}
      >
        <DialogTitle className={classes.dialogTitle}>
          { this.context.dictionary.home.newGameDialogTitle }
        </DialogTitle>
        <DialogContent>
          {/* name input */}
          <TextField
            autoFocus
            required
            margin="dense"
            label={this.context.dictionary.home.newGameInputName}
            value={this.state.newGameDialogData.name}
            onChange={event => this.handleNewGameDialogInputChange("name", event)}
            fullWidth
            className={classes.dialogTextField}
          />
          {/* game input */}
          <FormControl
            fullWidth
            required
            margin="dense"
            className={classes.dialogTextField}
          >
            <InputLabel>
              { this.context.dictionary.home.newGameInputNameGame }
            </InputLabel>
            <Select
              value={this.state.newGameDialogData.game}
              onChange={event => this.handleNewGameDialogInputChange("game", event)}
            >
              {
                this.state.gameList.map((gameName, i) => {
                  return (
                    <MenuItem value={i} key={i}>{gameName}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
          {/* players input */}
          <TextField
            margin="dense"
            label={this.context.dictionary.home.newGameInputPlayersNum}
            value={this.state.newGameDialogData.params.players}
            onChange={event => this.handleNewGameDialogInputChange("players", event)}
            type="number"
            inputProps={{ min: "2", step: "1" }}
            fullWidth
            className={classes.dialogTextField}
          />
          {/* bots input */}
          <TextField
            margin="dense"
            label={this.context.dictionary.home.newGameInputBotsNum}
            value={this.state.newGameDialogData.params.bots}
            onChange={event => this.handleNewGameDialogInputChange("bots", event)}
            type="number"
            inputProps={{ min: "0", step: "1" }}
            fullWidth
            className={classes.dialogTextField}
          />
          {/* Timeout input */}
          <TextField
            margin="dense"
            label={this.context.dictionary.home.newGameInputTimeout}
            value={this.state.newGameDialogData.params.timeout}
            onChange={event => this.handleNewGameDialogInputChange("timeout", event)}
            type="number"
            InputProps={{ 
              min: "0",
              step: "1",
              startAdornment: <InputAdornment position="start">
                { this.context.dictionary.home.newGameTimeoutMeasureUnit }
              </InputAdornment>,
             }}
            fullWidth
            className={classes.dialogTextField}
          />
          {/* password input */}
          <TextField
            margin="dense"
            label={this.context.dictionary.home.newGameInputPassword}
            value={this.state.newGameDialogData.password}
            onChange={event => this.handleNewGameDialogInputChange("password", event)}
            type={this.state.passwordVisible ? 'text' : 'password'}
            fullWidth
            className={classes.dialogTextField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={this.showPassword}
                  >
                    {this.state.passwordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {/* verification input */}
          {
            this.state.newGameDialogAdvancedSettings ?
              <TextField
                margin="dense"
                label={this.context.dictionary.home.newGameInputVerification}
                value={this.state.newGameDialogData.verification}
                onChange={event => this.handleNewGameDialogInputChange("verification", event)}
                type={this.state.verificationVisible ? 'text' : 'password'}
                fullWidth
                className={classes.dialogTextField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={this.showVerification}
                      >
                        {this.state.verificationVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            :
              null
          }
          {/* Args */}   
          {
            this.state.argsElement.map((item, index) => (
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={5}>
                  {/* Arg Key */}
                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    label={this.context.dictionary.home.newGameInputArgKey}
                    value={item.key}
                    onChange={event => this.handleArgsElementChange(index, 'key', event)}
                    fullWidth
                    className={classes.dialogTextField}
                  />
                </Grid>
                {/* Arg Value */}
                <Grid item xs={5}>
                  <TextField
                    required
                    margin="dense"
                    label={this.context.dictionary.home.newGameInputArgValue}
                    value={item.value}
                    onChange={event => this.handleArgsElementChange(index, 'value', event)}
                    fullWidth
                    className={classes.dialogTextField}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    size="small"
                    onClick={() => this.deleteArg(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))
          }
          {/* Button add arg */}
          <Button 
            className={classes.buttonPrimaryDialog}
            variant="outlined"
            fullWidth
            style={{ marginTop: '8px' }}
            onClick={() => this.addNewArg()}
            >
            { this.context.dictionary.home.newGameButtonAddArg }
          </Button>
          <br/>
          <br/>
          {
            this.state.emptyDialogError ?
              <Typography className={classes.errorText}>
                {this.context.dictionary.error.errorEmptyField}
              </Typography>
            :
              null
          }
          {
            this.state.networkDialogError ?
              <Typography className={classes.errorText}>
                {this.context.dictionary.error.errorNoConnection}
              </Typography>
            :
              null
          }
          {
            this.state.incorrectDataDialogError ?
              <Typography className={classes.errorText}>
                {this.context.dictionary.error.errorIncorrectData}
              </Typography>
            :
              null
          }
          {
            this.state.errorFromServer ?
              <Typography className={classes.errorText}>
                {this.state.errorFromServer}
              </Typography>
            :
              null
          }
          
        </DialogContent>
          {/* Action buttons */}
        <DialogActions>
          <Button 
            className={classes.buttonPrimaryDialog}
            onClick={() => this.setState({
              newGameDialogAdvancedSettings: !this.state.newGameDialogAdvancedSettings
            })}
          >
            { this.context.dictionary.general.advanced }
          </Button>
          <div style={{flex: '1 0 0'}} />
          <Button 
            className={classes.buttonPrimaryDialog}
            onClick={() => this.newGameDialogHandle()}
          >
            { this.context.dictionary.general.cancel }
          </Button>
          <Button 
            className={classes.buttonPrimaryDialog}
            onClick={() => this.createNewGame()}
          >
            { this.context.dictionary.general.create }
          </Button>
        </DialogActions>
      </Dialog>
    );

    const gameListDialog = (
      <Dialog 
        open={this.state.gameListDialogStatus} 
        onClose={() => this.gameListDialogHandle()}
        fullWidth={true}
        maxWidth={"xs"}
        scroll={"paper"}
        // PaperProps={{className: classes.dialogPaper}}
      >
        <DialogTitle className={classes.dialogTitle}>
          { this.context.dictionary.home.gameListDialogTitle }
        </DialogTitle>
        <DialogContent>
          <List>
            {
              this.state.gameList.map((gameName, i) => (
                <ListItem button onClick={() => this.handleGameDialogClick(gameName)} key={i}>
                  <ListItemText primary={gameName} />
                  <ListItemSecondaryAction>
                    <RightIcon className={classes.iconDialog}/>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            }
          </List>
        </DialogContent>
        {/* Action buttons */}
        <DialogActions>
          <Button 
            className={classes.buttonPrimaryDialog}
            onClick={() => this.gameListDialogHandle()}
          >
            { this.context.dictionary.general.close }
          </Button>
        </DialogActions>
      </Dialog>
    );

    const gameDetailsDialog = (
      <Dialog 
        open={this.state.gameDetailsDialogStatus} 
        onClose={() => this.gameDetailsDialogHandle()}
        fullScreen
      >
        <AppBar className={classes.gameDetailsDialogAppBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => this.gameDetailsDialogHandle()}>
              <Close />
            </IconButton>
            <Typography variant="h6">
              { this.state.gameName }
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.dialogContentMarkDown}>
          <ReactMarkdown>
            { this.state.gameDescription }
          </ReactMarkdown>
        </DialogContent>
      </Dialog>
    );

    let argsListDialog;
    if(this.state.matchDialogInfo) {
      argsListDialog = (
        <Dialog 
          open={this.state.matchInfoDialogStatus} 
          onClose={() => this.matchInfoDialogHandle()}
          fullWidth={true}
          maxWidth={"xs"}
          scroll={"paper"}
          // PaperProps={{className: classes.dialogPaper}}
        >
          <DialogTitle className={classes.dialogTitle}>
            { this.context.dictionary.home.matchInfoDialogTitle }
          </DialogTitle>
          <DialogContent>
            <Typography variant="h3" className={classes.dialogSubtitle}>
              { this.context.dictionary.home.matchInfoDialogSubtitleConnected}
            </Typography>
            <Typography className={classes.dialogContent} style={{ marginTop: '12px' }}>
              { 
                this.state.matchDialogInfo.connected.length > 0 ?
                  this.state.matchDialogInfo.connected.join(', ')
                :
                  this.context.dictionary.home.matchInfoDialogNoConnectedLabel
              }
            </Typography>
            <br/><br/>
            <Typography variant="h3" className={classes.dialogSubtitle}>
              { this.context.dictionary.home.matchInfoDialogSubtitleArgs }
            </Typography>
            {
              Object.keys(this.state.matchDialogInfo.args).length > 0 ?
                <Table className={classes.dialogContent}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        { this.context.dictionary.home.matchInfoDialogKeyHeader }
                      </TableCell>
                      <TableCell align="center">
                        { this.context.dictionary.home.matchInfoDialogValueHeader  }
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      Object.entries(this.state.matchDialogInfo.args).map((item) => (
                        <TableRow key={item[0]}>
                          <TableCell>{item[0]}</TableCell>
                          <TableCell align="center">{item[1]}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              :
                <Typography className={classes.dialogContent} style={{ marginTop: '12px' }}>
                  { this.context.dictionary.home.matchInfoDialogNoArgsLabel }
                </Typography>
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


    const headCells = [
      { id: "id", numeric: false, label: this.context.dictionary.home.tableHeaderId },
      { id: "name", numeric: false, label: this.context.dictionary.home.tableHeaderName },
      { id: "game", numeric: false, label: this.context.dictionary.home.tableHeaderGame },
      { id: "players", numeric: true, label: this.context.dictionary.home.tableHeaderPlayers },
      { id: "spectators", numeric: true, label: this.context.dictionary.home.tableHeaderSpectators },
      { id: "verified", numeric: false, label: this.context.dictionary.home.tableHeaderVerified },
      { id: "password", numeric: false, label: this.context.dictionary.home.tableHeaderPassword },
      { id: "timeout", numeric: false, label: this.context.dictionary.home.tableHeaderTimeout },
      { id: "time", numeric: false, label: this.context.dictionary.home.tableHeaderTime },
      { id: "info", numeric: false, label: this.context.dictionary.home.tableHeaderInfo },
    ]
    
    return (
      <React.Fragment>
        { this.state.loading ?  <Spinner open={this.state.loading} /> : null }

        { newGameDialog } 
        { gameListDialog } 
        { gameDetailsDialog } 
        { argsListDialog } 

        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography variant="h3" className={classes.title}>
              {this.context.dictionary.home.title}
            </Typography>
          </Grid>
          <Hidden xsDown><Grid item xs={3} /></Hidden>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              className={classes.buttonPrimary}
              startIcon={<AddCircle />}
              onClick={() => this.newGameDialogHandle()}
            >
              {this.context.dictionary.home.buttonAddNewGame}
            </Button>
          </Grid>
        </Grid>
        <br/><br/>

        <Grid container>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.searchRoot}>
              <InputBase
                className={classes.searchInput} 
                placeholder={this.context.dictionary.home.search}
                onChange={(event) => this.filterForName(event.target.value)} 
              />                      
              <Divider className={classes.searchDivider} />
              <IconButton 
                className={classes.searchIconButton} 
                aria-label="Directions"
              >
                <Search />
              </IconButton>
            </Paper>
          </Grid>
          <Grid item xs={0} sm={5}>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              className={classes.buttonSecondary}
              fullWidth
              variant="outlined"
              startIcon={<ExpandMore />}
              onClick={() => this.gameListDialogHandle()}
            >
              {this.context.dictionary.home.buttonGameList}
            </Button>
          </Grid>
        </Grid>


        <Grid container>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              {
                this.state.lobbyList.length > 0 ?
                  <Table>
                    <TableHead className={classes.tableHeader}>
                      <TableRow>
                        {
                          headCells.map(headCell => (
                            <TableCell
                              key={headCell.id}
                              sortDirection={this.state.orderBy === headCell.id ? this.state.order : false}
                            >
                              <TableSortLabel
                                className={classes.tableTitle}
                                active={this.state.orderBy === headCell.id}
                                direction={this.state.order}
                                onClick={() => this.handleRequestSort(headCell.id)}
                              >
                                {headCell.label}  
                              </TableSortLabel>
                            </TableCell>
                          ), this)
                        }
                        <TableCell />
                      </TableRow>
                    </TableHead>
  
                    <TableBody>
                      {
                        this.stableSort(this.state.lobbyList, this.getSorting(this.state.order, this.state.orderBy))
                        .slice(this.state.pageNumber * this.state.rowsPerPage, this.state.pageNumber * this.state.rowsPerPage + this.state.rowsPerPage)
                        .map(row => {
                          let time = new Date(row.time * 1000);
                          return (  
                            <TableRow 
                              key={row.id} 
                              className={classes.tableRow}
                              hover
                              tabIndex={-1}
                            >
                              <TableCell>{row.id}</TableCell>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>{row.game}</TableCell>
                              <TableCell>{(row.connected.length) + "/" + row.players}</TableCell>
                              <TableCell>{row.spectators}</TableCell>
                              <TableCell>
                                {
                                  row.verified ?
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
                                  row.password ?
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
                              <TableCell>{row.timeout}</TableCell>
                              <TableCell>
                                {
                                  row.running ?
                                    this.context.dictionary.home.tableTimeStart + " " + time.getHours() + (time.getMinutes() < 10 ? ':0' : ":") + time.getMinutes()
                                  :
                                    this.context.dictionary.home.tableTimeExpires + " " + time.getHours() + (time.getMinutes() < 10 ? ':0' : ":") + time.getMinutes()
                                }
                              </TableCell>
                              <TableCell>  
                                <IconButton 
                                  size="small"
                                  onClick={() => this.showInfo(row)}
                                >
                                  <Info />
                                </IconButton>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => this.goToSpectatePage(row.id)}
                                >
                                  <RightIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                :
                  <Typography className={classes.tableMessage} variant="h5">
                    { this.context.dictionary.home.tableNothing }
                  </Typography>
                }
              <TablePagination
                labelRowsPerPage={""}
                rowsPerPageOptions={this.state.rowsPerPageOptions}
                component="div"
                count={this.state.lobbyList.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.pageNumber}
                backIconButtonProps={{'aria-label': 'Previous Page'}}
                nextIconButtonProps={{'aria-label': 'Next Page'}}
                onChangePage={(event, page) => this.setState({ pageNumber: page })}
                onChangeRowsPerPage={(event) => this.setState({ rowsPerPage: event.target.value })}
                />
            </TableContainer>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }

  handleRequestSort(property) {
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc')
        order = 'asc';
    this.setState({ order: order, orderBy: orderBy });
  };

  stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => this.desc(a, b, orderBy)
      : (a, b) => -this.desc(a, b, orderBy);
  }

  desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  filterForName(str) {
      let base = this.state.lobbyListBackup;
      if (!str)
          this.setState({ lobbyList: base });
      let filtered = [];
      let filter = str.toLowerCase()
      for (let i = 0; i < base.length; i++) {
        let tmp = Object.values(base[i]);
        for(let j = 0; j < tmp.length; j++) {
          let item = tmp[j].toString().toLowerCase();
          if (item.includes(filter)) {
            filtered.push(base[i]);
            break;
          }
        }   
      }
      this.setState({ lobbyList: filtered })
  }

  newGameDialogHandle() {
    let status = this.state.newGameDialogStatus;
    this.resetNewGameDialog();
    this.setState({ newGameDialogStatus: !status, newGameDialogAdvancedSettings: false });
  }

  resetNewGameDialog() {
    this.setState({
      newGameDialogData: {
        name: null,
        game: null,
        params: {
          players: null,
          bots: null,
          timeout: ""
        },
        args: {},
        password: null,
        verification: null,
      },
      passwordVisible: false,
      verificationVisible: false,
      emptyDialogError: false,
      networkDialogError: false,
      incorrectDataDialogError: false,
      errorFromServer: false,
      argsElement: [],
    });
  }

  handleNewGameDialogInputChange = (attribute, event) => {
    let newGame = JSON.parse(JSON.stringify(this.state.newGameDialogData));
    if(attribute === 'players' || attribute === 'bots' || attribute === 'timeout')
      newGame.params[attribute] = event.target.value.trim();
    else if(attribute === 'game')
      // Manage selection
      newGame[attribute] = event.target.value;
    else
      newGame[attribute] = event.target.value.trim();
    this.setState({newGameDialogData: newGame})
  }

  async createNewGame() {
    this.setState({ 
      loading: true, 
      emptyDialogError: false,
      networkDialogError: false, 
      incorrectDataDialogError: false,
      errorFromServer: false,
    });
    let newGame = JSON.parse(JSON.stringify(this.state.newGameDialogData));
    if(!newGame.name || newGame.game === null) {
      this.setState({ 
        loading: false, 
        emptyDialogError: true,
        networkDialogError: false, 
        incorrectDataDialogError: false,
        errorFromServer: false,
      });
      return;
    }
    for(let i = 0; i < this.state.argsElement.length; i++) {
      let item = this.state.argsElement[i];
      if(!item.key || !item.value) {
        this.setState({ 
          loading: false, 
          emptyDialogError: true,
          networkDialogError: false,
          incorrectDataDialogError: false,
          errorFromServer: false,
        });
        return;
      }
      newGame.args[item.key] = item.value;
    }
    if((newGame.params.players && isNaN(newGame.params.players))
       || isNaN(newGame.params.bots)
    ) {
      this.setState({ 
        loading: false, 
        emptyDialogError: false,
        networkDialogError: false, 
        incorrectDataDialogError: true,
        errorFromServer: false,
      });
      return;
    }
    newGame.params.players = newGame.params.players ? Number(newGame.params.players) : null;
    newGame.params.bots = newGame.params.bots ? Number(newGame.params.bots) : 0;
    newGame.game = this.state.gameList[newGame.game];
    newGame.params.timeout = newGame.params.timeout ? Number(newGame.params.timeout) : null;
    try {
      let result = await WebSocket.sendJson({"GameNew": newGame});
      if(result.GameNew.id.Err) {
        this.setState({ 
          loading: false, 
          emptyDialogError: false,
          networkDialogError: false, 
          incorrectDataDialogError: true,
          errorFromServer: result.GameNew.id.Err,
        });
        return;
      } else {
        this.setState({ loading: false });
        this.newGameDialogHandle()
        return;
      }

    } catch(err) {
      console.error('err: ', err);
      this.setState({ 
        loading: false, 
        emptyDialogError: false,
        networkDialogError: true, 
        incorrectDataDialogError: false,
        errorFromServer: false,
      });
      return;
    }
  }

  showPassword = () => {
    this.setState({
      passwordVisible: !this.state.passwordVisible
    })
  }

  showVerification = () => {
    this.setState({
      verificationVisible: !this.state.verificationVisible
    })
  }

  addNewArg() {
    let newArg = {key: "", value: ""}
    this.setState({ argsElement: [...this.state.argsElement, newArg] })
  }

  deleteArg(index) {
    let argsElement = this.state.argsElement;
    argsElement.splice(index, 1);
    this.setState({ argsElement: argsElement });
  }

  handleArgsElementChange(index, key, event) {
    let argsElement = this.state.argsElement;
    argsElement[index][key] = event.target.value.trim();
    this.setState({ argsElement: argsElement });
  }

  gameListDialogHandle() {
    let status = this.state.gameListDialogStatus;
    this.setState({ gameListDialogStatus: !status });
  }

  handleGameDialogClick(gameName) {
    this.getGameDescription(gameName);
    this.gameListDialogHandle();
    this.gameDetailsDialogHandle();
  }

  async getGameDescription(gameName) {
    this.setState({ loading: true });
    let description = "";
    try {
      let result = await WebSocket.sendJson({"GameDescription": {"name": gameName}});
      description = result.GameDescription.description;
    } catch(err) {
      console.log('err: ', err);
    }
    this.setState({
      gameName: gameName,
      gameDescription: description,
      loading: false,
    });
  }

  gameDetailsDialogHandle() {
    let status = this.state.gameDetailsDialogStatus;
    this.setState({ gameDetailsDialogStatus: !status });
  }

  matchInfoDialogHandle() {
    let status = this.state.matchInfoDialogStatus;
    this.setState({ matchInfoDialogStatus: !status });
  }

  showInfo(match) {
    this.setState({ matchDialogInfo: match });
    this.matchInfoDialogHandle();
  }

  async goToSpectatePage(matchId) {
    if(this.state.clientLobbySubscribe) {
      try {
        let body = {"LobbyUnsubscribe": {}};
        await WebSocket.unsubscribe(body , this.state.clientLobbySubscribe);
        this.setState({ clientLobbySubscribe: null })
      } catch(err) {
        console.log('err: ', err);
      }
    }
    this.props.history.push('spectate', {"matchId": matchId});
  }
}

Home.contextType = LanguageContext;
export default withStyles(HomeStyle)(Home);