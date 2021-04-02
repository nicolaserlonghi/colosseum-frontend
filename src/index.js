import React from "react"
import ReactDOM from "react-dom"
import { createBrowserHistory } from "history"
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"
import routes from 'security/routes.js'

// Multi Language
import { LanguageProvider } from 'resources/languages/Language.js';

// Font
import 'typeface-roboto'

import TopBarLayout from "resources/theme/layout/TopBarLayout.jsx"
import Constants from 'Constants.js'
import Colors from 'resources/Colors.js'

const hist = createBrowserHistory()

// Set default body background color
document.body.style.background = Colors.background;

(async () => {
	ReactDOM.render(
		<LanguageProvider>
			<BrowserRouter history={hist}>
				<Switch>
					{
						routes.map((item, key) => {
							return <Route key={key} path={item.path} component={TopBarLayout}/>
						})
					}
					<Redirect from="/" to={Constants.defaultHomePage}  />
				</Switch>
			</BrowserRouter>
		</LanguageProvider>
		, 
		document.getElementById("root")
	)
})();