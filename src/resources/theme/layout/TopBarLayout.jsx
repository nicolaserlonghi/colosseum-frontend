import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Hidden from '@material-ui/core/Hidden';

import Settings from '@material-ui/icons/SettingsRounded';

import ReactCountryFlag from 'react-country-flag';

import validator from 'validator';

import Routes from 'security/routes.js';
import TopBarLayoutStyle from 'resources/theme/layout/layoutStyle/TopBarLayoutStyle.jsx';
import { languageOptions } from 'resources/languages/FileLanguageIndex.js';
import { LanguageContext } from 'resources/languages/Language.js';
import Constants from 'Constants.js';
import Configuration from 'config.js';

const switchRoutes = (
  <Switch>
    {
      Routes.map((prop, key) => {
        if (prop.layout === "topBar") {
          return (
            <Route
              path={prop.path}
              component={prop.component}
              key={key}
            />
          );
        }
        return null;
      })
    }
  </Switch>
)

class TopBarLayout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
      languageSelected: null,
      menuOpen: false,
      settingsDialogStatus: false,
      serverUrl: window.sessionStorage.getItem(Constants.serverUrlKey) || this.getDefualtUrl(),
      errorUrl: false,
    }
  }

  getDefualtUrl() {
    let protocol = (Configuration.ssl ? "wss" : "ws") + "://";
    let ip = Configuration.ip;
    let port = Configuration.port;
    let url = protocol +  ip;
    if(port)
      url += ":" + port;
    return url;
  }

  componentDidMount() {
    let userLanguage = this.context.userLanguage;
    this.setState({ languageSelected: userLanguage })
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
  
    const settingsDialog = (
      <Dialog 
        open={this.state.settingsDialogStatus} 
        onClose={() => this.settingsDialogHandle()}
        fullWidth={true}
        maxWidth={"xs"}
        scroll={"paper"}
        // PaperProps={{className: classes.dialogPaper}}
      >
        <DialogTitle>
          { this.context.dictionary.topBar.settingsDialogTitle }
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={this.context.dictionary.topBar.settingsDialogInputServer}
            value={this.state.serverUrl}
            onChange={event => this.handleSettingDialogUrlChange(event)}
            fullWidth
            className={classes.dialogTextField}
          />
          {
            this.state.errorUrl ?
              <Typography className={classes.errorText}>
                {this.context.dictionary.topBar.urlError}
              </Typography>
            :
              null
          }
        </DialogContent>
        {/* Action buttons */}
        <DialogActions>
          <Button 
            className={classes.buttonPrimaryDialog}
            onClick={() => this.settingsDialogRestoreServerUrl()}
            disabled={this.state.serverUrl === this.getDefualtUrl()}
          >
            { this.context.dictionary.general.default }
          </Button>
          <div style={{flex: '1 0 0'}} />
          <Button 
            className={classes.buttonPrimaryDialog}
            onClick={() => this.settingsDialogHandle()}
          >
            { this.context.dictionary.general.cancel }
          </Button>
          <Button 
            className={classes.buttonPrimaryDialog}
            onClick={() => this.settingsDialogSaveUrl()}
          >
            { this.context.dictionary.general.save }
          </Button>
        </DialogActions>
      </Dialog>
    );

    return (
      <div className={classes.root}>
        {/* RENDER TOPBAR*/}
        {this.renderTopbar(classes, anchorEl)}
        {/* RENDER MAIN AREA*/}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.container}>
            {settingsDialog}
            {switchRoutes}
          </div>
        </main>
      </div>
    );
  }

  renderTopbar = (classes, anchorEl) => {
    return (
      <AppBar position="fixed" className={classes.appBar} styles={{zIndex: 1}}>
        <Toolbar>
          <Typography variant="h4" noWrap className={classes.appBarTitle}>
            {this.context.dictionary.project.name}
          </Typography>
          
          <Hidden smDown>
            <Typography variant="subtitle1" className={classes.appBarUrl}>
              { window.sessionStorage.getItem(Constants.serverUrlKey) || this.getDefualtUrl() }
            </Typography>
          </Hidden>
          <IconButton
            edge="end"
            onClick={() => this.settingsDialogHandle()}
            className={classes.menuButton}
          >
            <Settings fontSize="large"/>
          </IconButton>
          <IconButton
            edge="end"
            ref={anchorEl} 
            onClick={(event) => this.handleMenuToggle(event)}
          >
            { this.getFlag(classes.menuIcon, this.state.languageSelected) }
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
            open={this.state.menuOpen}
            onClose={(event) => this.handleMenuClose(event)}
          >
            {
              Object.keys(languageOptions).map((key, i) => {
                return (
                  <div key={i}> 
                    <MenuItem className={classes.menu}
                      onClick={(event) => {this.handleMenuClose(event); this.handleMenuItemClick(key);}}
                    >
                      { this.getFlag(classes.menuIcon, key) }
                      {languageOptions[key]}
                    </MenuItem>
                    {
                      (i + 1) < Object.keys(languageOptions).length ?
                        <Divider />
                      :
                        null
                    }
                    
                  </div>
              )})
            }
          </Menu>
        </Toolbar>
      </AppBar>
    )
  }

  getFlag = (classStyle, keyCountryCode) => {
    return (
      <Avatar className={classStyle} >
        <ReactCountryFlag
          countryCode={Constants.countryCodeLanguagesSupported[keyCountryCode] || ""}
          svg
          style={{
            width: '3em',
            height: '3em',
          }}
        />
      </Avatar>
    )
  }

  handleMenuToggle(event) {
    this.setState({menuOpen: !this.state.menuOpen, anchorEl: event.currentTarget});
  }

  handleMenuClose(event) {
    if (this.state.anchorEl.current && this.state.anchorEl.current.contains(event.target)) {
      return;
    }
    this.setState({menuOpen: false});
  }

  handleMenuItemClick(key) {
    this.context.userLanguageChange(key)
    this.setState({ languageSelected: key })
  }

  settingsDialogHandle() {
    let status = this.state.settingsDialogStatus;
    this.setState({
      settingsDialogStatus: !status,
      serverUrl: window.sessionStorage.getItem(Constants.serverUrlKey) || this.getDefualtUrl(),
      errorUrl: false,
    });
  }

  handleSettingDialogUrlChange(event) {
    let newUrl = event.target.value.trim();
    let errorUrl;
    if(validator.isURL(newUrl, {protocols: ['wss', 'ws'], require_protocol: true}))
      errorUrl = false;
    else
      errorUrl = true;
    this.setState({ serverUrl: newUrl, errorUrl: errorUrl })
  }

  settingsDialogRestoreServerUrl() {
    let defaultUrl = this.getDefualtUrl();
    this.setState({ serverUrl: defaultUrl, errorUrl: false });
  }

  settingsDialogSaveUrl() {
    let newUrl = this.state.serverUrl;
    let defaultUrl = this.getDefualtUrl();
    let errorUrl = false;
    if(newUrl === defaultUrl)
      sessionStorage.removeItem(Constants.serverUrlKey);
    else {
      if(validator.isURL(newUrl, {protocols: ['wss', 'ws'], require_protocol: true})) {
        window.sessionStorage.setItem(Constants.serverUrlKey, newUrl);
      } else {
        errorUrl = true;
        this.setState({ errorUrl: errorUrl })
        return;
      }
    }
    this.settingsDialogHandle();
    let address = window.location.origin;
    window.location.replace(address);
  }
}

TopBarLayout.propTypes = { classes: PropTypes.object.isRequired }
TopBarLayout.contextType = LanguageContext;
export default withStyles(TopBarLayoutStyle)(TopBarLayout)