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
import Avatar from '@material-ui/core/Avatar';
import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import UserIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import RightIcon from '@material-ui/icons/KeyboardArrowRight';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import TimeField from 'react-simple-timefield';

import HomeStyle from 'resources/styles/HomeStyle.jsx';
import { LanguageContext } from 'resources/languages/Language.js';
import Spinner from 'views/spinner/Spinner.jsx';
import Utils from 'helpers/Utils.js';
import WebSocket from 'api/WebSocketManager.js';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      filtered: [],
      filter: "",
      rowsPerPageOptions: [5, 10, 25, 50],
      rowsPerPage: 5,
      pageNumber: 0,
      passwordVisible: false,
      verificationVisible: false,
      emptyDialogError: false,
      networkDialogError: false,
      incorrectDataDialogError: false,
      newGameDialogStatus: false,
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
      gameList: [],
    }
  }

  async componentDidMount() {
    try {
      let result = await WebSocket.sendJson({"GameList": {}});
      console.log('result: ', result);
      this.setState({ gameList: result.GameList.games })
    } catch(err) {
      console.log('err: ', err);
    }
    try {
      let result = await WebSocket.sendJson({"LobbySubscribe": {}});
      console.log('result: ', result);
    } catch(err) {
      console.log('err: ', err);
    }
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
            required
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
          <TimeField
            showSeconds
            value={this.state.newGameDialogData.params.timeout}
            onChange={event => this.handleNewGameDialogInputChange("timeout", event)}
            input={
              <TextField
                fullWidth
                margin="dense"
                label={this.context.dictionary.home.newGameInputTimeout} 
                value={this.state.newGameDialogData.params.timeout} 
              />
            }
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
        </DialogContent>
          {/* Action buttons */}
        <DialogActions>
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
            { this.context.dictionary.general.save }
          </Button>
        </DialogActions>
      </Dialog>
    );
    
    return (
      <React.Fragment>
        <Spinner open={this.state.loading} />

        { newGameDialog } 

        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography variant="h3" className={classes.title}>
              {this.context.dictionary.home.title}
            </Typography>
          </Grid>
          <Hidden smDown><Grid item xs={3} /></Hidden>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              className={classes.buttonPrimary}
              startIcon={<UserIcon />}
              onClick={() => this.newGameDialogHandle()}
            >
              {this.context.dictionary.home.new}
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
                onChange={(event) => this.applyFilter(event.target.value)} 
                value={this.state.filter}
              />                      
              <Divider className={classes.searchDivider} />
              <IconButton > <SearchIcon /> </IconButton>
            </Paper>
          </Grid>
          <Hidden smDown>
            <Grid item xs={5}/>
            <Grid item xs={3}>
              <Typography variant="subtitle2" className={classes.recapText}>
                {`${this.context.dictionary.home.title} | ${this.state.filtered.length} ${this.context.dictionary.home.item}`}
              </Typography>
            </Grid>
          </Hidden>
        </Grid>

      </React.Fragment>
    )
  }

  newGameDialogHandle() {
    let status = this.state.newGameDialogStatus;
    this.resetNewGameDialog();
    this.setState({ newGameDialogStatus: !status });
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
      incorrectDataDialogError: false
    });
    let newGame = JSON.parse(JSON.stringify(this.state.newGameDialogData));
    if(!newGame.name || newGame.game === null || !newGame.params.bots) {
      this.setState({ 
        loading: false, 
        emptyDialogError: true,
        networkDialogError: false, 
        incorrectDataDialogError: false
      });
      return;
    }
    if((newGame.params.players && isNaN(newGame.params.players))
       || isNaN(newGame.params.bots)
    ) {
      this.setState({ 
        loading: false, 
        emptyDialogError: false,
        networkDialogError: false, 
        incorrectDataDialogError: true
      });
      return;
    }
    newGame.params.players = newGame.params.players ? Number(newGame.params.players) : null;
    newGame.params.bots = Number(newGame.params.bots);
    newGame.game = this.state.gameList[newGame.game];
    if(!newGame.params.timeout || newGame.params.timeout === "00:00:00")
      newGame.params.timeout = null
    else {
      // TODO Manage time
      console.log('newGame.params.timeout: ', newGame.params.timeout);
      // let time = new Date("01/01/1970" + " " + newGame.params.timeout);
      // console.log(time.getDate() +'/'+ time.getMonth() +'/'+ time.getFullYear()+ ' '+ time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
    }
    try {
      let result = await WebSocket.sendJson({"GameNew": newGame});
      if(result.GameNew.id.Err) {
        console.log('result.GameNew.id.Err: ', result.GameNew.id.Err);
        this.setState({ 
          loading: false, 
          emptyDialogError: false,
          networkDialogError: false, 
          incorrectDataDialogError: true
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
        incorrectDataDialogError: false
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
}

Home.contextType = LanguageContext;
export default withStyles(HomeStyle)(Home);