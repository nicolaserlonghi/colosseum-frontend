import React from "react"
import PropTypes from "prop-types"
import { Switch, Route } from "react-router-dom"
import "perfect-scrollbar/css/perfect-scrollbar.css"
import withStyles from "@material-ui/core/styles/withStyles"
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import Routes from 'security/routes.js'
import TopBarLayoutStyle from 'resources/theme/layout/layoutStyle/TopBarLayoutStyle.jsx'
import language from 'resources/Language.js'


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

  render() {
    const { classes, container, ...other } = this.props;
  
    return (
      <div className={classes.root}>
        {/* RENDER TOPBAR*/}
        {this.renderTopbar(classes)}
        {/* RENDER MAIN AREA*/}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.container}>{switchRoutes}</div>
        </main>
      </div>
    );
  }

  renderTopbar = (classes) => {
    return (
      <AppBar position="fixed" className={classes.appBar} styles={{zIndex: 1}}>
        <Toolbar>
          <Typography variant="h4" noWrap className={classes.appBarTitle}>
            {language.project.name}
          </Typography>
        </Toolbar>
      </AppBar>
    )
  }
}

TopBarLayout.propTypes = { classes: PropTypes.object.isRequired }
export default withStyles(TopBarLayoutStyle)(TopBarLayout)