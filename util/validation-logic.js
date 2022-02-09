
//for some reason checks as truthy
//carefully invert everything
//replace constants with parameters
function postSuccess(title, content) {
    return (title &&
        content &&
        title.trim() !== "" &&
        content.trim() !== "");
}

function authSuccess(email, confirmEmail, password) {
    return (
        email &&
        confirmEmail &&
        password &&
        password.trim().length >= 6 &&
        email === confirmEmail &&
        email.includes("@")
    );
}

module.exports = {
    postSuccessKey: postSuccess,
    authSuccessKey: authSuccess
}