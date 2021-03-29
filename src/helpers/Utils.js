import routes from 'security/routes.js';

class Utils {
    static instance = null;
    static getInstance()
    {
        if (!Utils.instance)
            Utils.instance = new Utils();
        return Utils.instance;
    }

    getToday()
    {
        var date = new Date();
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        if (month >= 1 && month <= 9)
            month = "0" + month;

        var day = date.getDate();
        if (day >= 1 && day <= 9)
            day = "0" + day;

        let separator = "-"
        return year + separator + month + separator + day;
    }

    englishDateToItalianDate(date, separator)
    {
        if (date === undefined)
            throw new Error("Date is required")

        var res = date.split("-")
        var year = res[0];
        var month = res[1];
        var day = res[2];

        if (separator === undefined)
            separator = "/"

        return day + separator + month + separator + year;
    }

    englishDateToItalianDateWithTime(timestamp)
    {
        if (timestamp === undefined)
            throw new Error("Date is required")

        let tmp = timestamp.split(' ')
        let date = tmp[0]
        let time = tmp[1]
        
        var res = date.split("-")
        var year = res[0];
        var month = res[1];
        var day = res[2];

        return day + '-' + month + '-' + year + ' ' + time.split('.')[0];
    }

    isEmpty(value)
    {
        if (value === null || value === undefined || value === '')
            return true

        return false
    }

    isObjEmpty(obj)
    {
        if (typeof(obj) !== "object")
            throw new Error("Is not an object")

        if (obj === null || obj === undefined)
            return true

        let keys = Object.keys(obj) 
        if (keys.length === 0)
            return true

        for (let i=0; i<keys.length; i++) 
        {
            let key = keys[i]
            let v = obj[key];
            if (this.isEmpty(v))
                return true
        };

        return false
    }

    isArrayEmpty(array)
    {
        if (typeof array !== 'object')
            throw new Error("It is not an array")

        if (array.length === 0)
            return true

        return false
    }

    getReducedDate(date)
    {
        date = "" + date
        date = date.split(' ')
        let monthStr = date[1]
        let year = date[3]
        let month = ''
        if (monthStr === "Gen") month = '01'
        else if (monthStr === "Feb") month = '02'
        else if (monthStr === "Mar") month = '03'
        else if (monthStr === "Apr") month = '04'
        else if (monthStr === "May") month = '05'
        else if (monthStr === "Jun") month = '06'
        else if (monthStr === "Jul") month = '07'
        else if (monthStr === "Aug") month = '08'
        else if (monthStr === "Sep") month = '09'
        else if (monthStr === "Oct") month = '10'
        else if (monthStr === "Nov") month = '11'
        else if (monthStr === "Dec") month = '12'

        return month + '/01/' + year
    }

    fromDateToDbEntry(date)
    {
        // new Date() --> yyyy-mm-dd
        date = new Date(date)
        let dateStr = date.getFullYear()
        let mm = (date.getMonth() + 1)
        dateStr += '-' + (mm < 10 ? '0' + mm : mm)
        let dd = date.getDate()
        dateStr += '-' + (dd < 10 ? '0' + dd : dd)
        return dateStr;
    }

    getActivePageNumber(path) {
        if(path.charAt(0) === '/')
            path = path.substr(1);
        path = path.split('/')[1];
        if(path === undefined)
            return -1;
        for (let i = 0; i < routes.length; i++) {
            if(routes[i].name === undefined)
                return -1;
            if(routes[i].name.toUpperCase() === path.toUpperCase())
                return routes[i].drawerPosition;
        }
        return -1
    }
}

const utils = Utils.getInstance();
export default utils;