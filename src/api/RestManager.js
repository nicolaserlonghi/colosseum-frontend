import axios from 'axios';
import configuration from 'config.js'

class RestManager
{
    static TIMEOUT = 15000;
    static instance = null;
    static getInstance()
    {
        if (!RestManager.instance)
            RestManager.instance = new RestManager();
        return RestManager.instance;
    }

    constructor()
    {
        this.protocol = (configuration.ssl ? "https" : "http") + "://";
        this.clientId = configuration.clientId;
        this.ip = configuration.ip;
        this.port = configuration.port; 
    }

    getClientId()
    {
        return this.clientId
    }

    getUrl(rest)
    {
/*         let url = "";
        let isAuthenticated = auth.isAuthenticated();

        if (!isAuthenticated)
        {
            console.log("Not Authenticated")
            this.config = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
            if (rest === '/user/confirmRegistration' || rest === '/user/forgotPassword' || rest === '/user/resetPassword')
                this.config = {headers: {'Content-Type': 'application/json'}}
            url = this.protocol + this.ip + ":" + this.port + '/api';
        }
        else
        {
            this.config = {headers: { 'Authorization': 'Bearer ' + auth.getToken() }}
            url = this.protocol +  this.ip + ":" + this.port + '/api'
        }

        if (rest)
            url += rest; 
        return url; */
    }

    getConfig()
    {
        return this.config;
    }

    addHeader(header, value)
    {
        this.config.headers[header] = value;
    }

    getTimeout()
    {
        return RestManager.TIMEOUT;
    }

    post(rest, body)
    {
        let url = this.getUrl(rest);
        var self = this;
        return new Promise(async (resolve, reject) => 
        {
            var completed = false

            setTimeout(() => 
            {
                if (!completed)
                {
                    console.log("Timeout")
                    completed = true
                    return reject("")
                }
            }, RestManager.TIMEOUT)

            try 
            {
                var res = await axios.post(url, body, self.config)
                if (!completed)
                {
                    completed = true
                    return resolve(res.data)
                }
            } 
            catch (err) 
            {
                console.log("$$ DBG post error", Object.keys(err), err.config, err.request, err.response)
                if (!completed)
                { 
                    completed = true
                    return reject(err)
                }
            }
        })
    }

    get(rest)
    {
        let url = this.getUrl(rest);
        var self = this;
        return new Promise(async (resolve, reject) => 
        {
            var completed = false

            setTimeout(() => 
            {
                if (!completed)
                {
                    console.log("Timeout")
                    completed = true
                    return reject("")
                }
            }, RestManager.TIMEOUT)

            try 
            {
                var res = await axios.get(url, self.config)
                if (!completed)
                {
                    completed = true
                    return resolve(res.data)
                }
            } 
            catch (err) 
            {
                if (!completed)
                { 
                    completed = true
                    return reject(err)
                }
            }
        })
    }
}

const restManager = RestManager.getInstance();
export default restManager;