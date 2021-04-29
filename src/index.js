import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

// Multi Language
import { LanguageProvider } from 'resources/languages/Language.js';

// Font
import 'typeface-roboto'

import routes from 'security/routes.js';
import TopBarLayout from 'resources/theme/layout/TopBarLayout.jsx'
import SaveSpaceLayout from 'resources/theme/layout/SaveSpaceLayout.jsx'
import Constants from 'Constants.js';
import Colors from 'resources/Colors.js';

const hist = createBrowserHistory()

// Set default body background color
document.body.style.background = Colors.background;

const theme = createMuiTheme({
	palette: {
		type: 'dark'
	}
});

const getComponent = (componentName) => {
	switch(componentName) {
		case 'topBar':
			return TopBarLayout;
		case 'saveSpaceLayout':
			return SaveSpaceLayout;
	}
}

(async () => {
	ReactDOM.render(
		<ThemeProvider theme={theme}>
			<LanguageProvider>
				<BrowserRouter history={hist}>
					<Switch>
						{
							routes.map((item, key) => {
								return <Route key={key} path={item.path} component={getComponent(item.layout)}/>
							})
						}
						<Redirect from="/" to={Constants.defaultHomePage}  />
					</Switch>
				</BrowserRouter>
			</LanguageProvider>
		</ThemeProvider>
		, 
		document.getElementById("root")
	)
})();