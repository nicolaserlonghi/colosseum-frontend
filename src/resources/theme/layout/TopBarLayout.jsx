import React from "react"
import PropTypes from "prop-types"
import { Switch, Route } from "react-router-dom"
import "perfect-scrollbar/css/perfect-scrollbar.css"
import withStyles from "@material-ui/core/styles/withStyles"
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import MenuItem from "@material-ui/core/MenuItem"
import Menu from "@material-ui/core/Menu"
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'

import ReactCountryFlag from "react-country-flag"

import Routes from 'security/routes.js'
import TopBarLayoutStyle from 'resources/theme/layout/layoutStyle/TopBarLayoutStyle.jsx'
import { languageOptions } from 'resources/languages/FileLanguageIndex.js'
import { LanguageContext } from 'resources/languages/Language.js'
import Constant from "Constants.js"


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
    }
  }

  componentDidMount() {
    let userLanguage = this.context.userLanguage;
    this.setState({ languageSelected: userLanguage })
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
  
    return (
      <div className={classes.root}>
        {/* RENDER TOPBAR*/}
        {this.renderTopbar(classes, anchorEl)}
        {/* RENDER MAIN AREA*/}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.container}>{switchRoutes}</div>
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


          <div className={classes.cardHeaderContainer}>
            <Button
              className={classes.languageMenu}
              fullWidth
              ref={anchorEl} 
              onClick={(event) => this.handleMenuToggle(event)}
            >
              { this.getFlag(classes.menuIcon, this.state.languageSelected) }
              { languageOptions[this.state.languageSelected] }
            </Button>
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
          </div>
        </Toolbar>
      </AppBar>
    )
  }

  getFlag = (classStyle, keyCountryCode) => {
    return (
      <Avatar className={classStyle} >
        <ReactCountryFlag
          countryCode={Constant.countryCodeLanguagesSupported[keyCountryCode] || ""}
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
}

TopBarLayout.propTypes = { classes: PropTypes.object.isRequired }
TopBarLayout.contextType = LanguageContext;
export default withStyles(TopBarLayoutStyle)(TopBarLayout)