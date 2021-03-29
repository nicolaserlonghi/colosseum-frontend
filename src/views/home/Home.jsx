import React from "react"
import withStyles from "@material-ui/core/styles/withStyles"
import HomeStyle from "resources/styles/HomeStyle.jsx"
import language from 'resources/Language.js'
import Rest from 'api/RestManager.js'
import Spinner from 'views/spinner/Spinner.jsx'
import Utils from 'helpers/Utils.js'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import Avatar from '@material-ui/core/Avatar'
import TablePagination from '@material-ui/core/TablePagination'
import TextField from '@material-ui/core/TextField';

import UserIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search'
import RightIcon from '@material-ui/icons/KeyboardArrowRight';

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
    }
  }

  render() {
    const classes = this.props.classes
        
    return (
      <React.Fragment>
        <Spinner open={this.state.loading} />

        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography variant="h3" className={classes.title}>
              {language.home.title}
            </Typography>
          </Grid>
          <Hidden smDown><Grid item xs={3} /></Hidden>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              className={classes.buttonPrimary}
              startIcon={<UserIcon />}
              onClick={() => this.props.history.push('')}
            >
              {language.home.new}
            </Button>
          </Grid>
        </Grid>
        <br/><br/>

        <Grid container>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.searchRoot}>
              <InputBase
                className={classes.searchInput} 
                placeholder={language.home.search}
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
                {`${language.home.title} | ${this.state.filtered.length} ${language.home.item}`}
              </Typography>
            </Grid>
          </Hidden>
        </Grid>

      </React.Fragment>
    )
  }
}

export default withStyles(HomeStyle)(Home);