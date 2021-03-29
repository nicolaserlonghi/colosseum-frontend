import React from "react"
import ReactDOM from "react-dom"
import { createBrowserHistory } from "history"
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"
import detectBrowserLanguage from 'detect-browser-language'
import routes from 'security/routes.js'

// Font
import 'typeface-roboto'


import TopBarLayout from "resources/theme/layout/TopBarLayout.jsx"
import language from "resources/Language.js"
import Constants from 'Constants.js'
import Colors from 'resources/Colors.js'

const hist = createBrowserHistory()
language.setLanguage(detectBrowserLanguage())

// Set default body background color
document.body.style.background = Colors.background;

(async () => {
	ReactDOM.render(
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
		, 
		document.getElementById("root")
	)
})();