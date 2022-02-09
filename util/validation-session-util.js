
//blog routes
//no longer carry the previous user input
//post.fetch(); is in controller
function getSessionErr(req, defaultValue) {
    let sessionInputData = req.session.inputData;

    if (!sessionInputData) {
        sessionInputData = {
            hasError: false,
            ...defaultValue
        };
    }
    req.session.inputData = null;

    return sessionInputData;
}


function flashErrSession(req, data, action) {
    req.session.inputData = {
        hasError: true,
        ...data
    };
    req.session.save(action);
}

//test auth utility
function isAuthSession(req, data, action) {
    req.session.user = {
        ...data
    };
    req.session.isAuthenticated = true;
    req.session.save(action);
}

module.exports = {
    getSessionErrK: getSessionErr,
    flashErrSessionK: flashErrSession,
    isAuthSessionK: isAuthSession
}