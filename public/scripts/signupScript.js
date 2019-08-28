$(function() {
    let type = sessionStorage.cachedType;
    if (type) {
        let name = sessionStorage.cachedManagerName;
        let email = sessionStorage.cachedManagerEmail;
        let phone = sessionStorage.cachedManagerPhone;
        console.log(`Data found ${name}, ${email}, ${phone}`);
    }
    if (!type) {
        console.log(`No data found, user is not a manager`);
    }

})