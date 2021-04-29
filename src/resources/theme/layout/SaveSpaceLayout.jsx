import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import withStyles from '@material-ui/core/styles/withStyles';

import Routes from 'security/routes.js';
import SaveSpaceLayoutStyle from 'resources/theme/layout/layoutStyle/SaveSpaceLayoutStyle.jsx';
import { LanguageContext } from 'resources/languages/Language.js';


const switchRoutes = (
  <Switch>
    {
      Routes.map((prop, key) => {
        if (prop.layout === "saveSpaceLayout") {
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

class SaveSpaceLayout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { classes } = this.props;
  
    return (
      <div className={classes.root}>
        {/* RENDER MAIN AREA*/}
          <main className={classes.content}>
            <div className={classes.container}>
              {switchRoutes}
            </div>
          </main>
      </div>
    );
  }
}

SaveSpaceLayout.propTypes = { classes: PropTypes.object.isRequired }
SaveSpaceLayout.contextType = LanguageContext;
export default withStyles(SaveSpaceLayoutStyle)(SaveSpaceLayout)