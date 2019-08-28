$(function() {
    $('#registerSect').hide();
    $('#teamRegister').on('click', (evt) => {
        evt.preventDefault();
        $('#optionSect').hide();
        $('#registerSect').show();
        loadRegister();
    })

})

function loadRegister() {
    $('#managerInfo').on('change', () => {
        if ($('#managerInfo').prop('checked') == true) {
            let type = true;
            sessionStorage.cachedType = type;
            let name = $('#managerName').val();
            sessionStorage.cachedManagerName = name;
            let email = $('#managerEmail').val();
            sessionStorage.cachedManagerEmail = email;
            let phone = $('#managerPhone').val();
            sessionStorage.cachedManagerPhone = phone;
            console.log(`Cached Data: ${type}, ${name}, ${email}, ${phone}`);
        }
        if ($('#managerInfo').prop('checked') == false) {
            sessionStorage.clear();
            console.log('Cached Info Removed');
        }
    })
    $('input[name="ageLock"]').on('change', () => {
        let ageLock = $('input[type="radio"]:checked').val();
        if (ageLock == "false") {
            console.log("false")
        }
        if (ageLock == "true") {
            console.log("true");
        }

    })
    $('#registerTeam').on('click', (evt) => {
        let teamName = $('#teamName').val();
        let name = $('#managerName').val();
        let email = $('#managerEmail').val();
        let phone = $('#managerPhone').val();
        evt.preventDefault();
        let validatedData = validateForm(teamName, name, email, phone)
        if (validatedData) {
            console.log("valid Data");
            window.location.href = "/teamList.html/"
        };
    })
}

function validateForm(teamName, name, email, phone) {
    console.log("Im validating");
    let errorMsg = [];
    let errorStatus = false;
    let temp = "";
    // validate courseid
    // trim() - takes off trailing and leading spaces
    if (teamName.trim() == "") {
        errorMsg[errorMsg.length] = "Please enter a Team Name";
        errorStatus = true;
    };
    if (name.trim() == "") {
        errorMsg[errorMsg.length] = "Please enter a Name";
        errorStatus = true;
    };
    if (email.trim() == "") {
        errorMsg[errorMsg.length] = "Please enter an Email";
        errorStatus = true;
    };
    let emailReg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (emailReg.test(email) == false) {
        errorMsg[errorMsg.length] = "Please enter a valid Email";
        errorStatus = true;
    };
    if (phone.trim() == "") {
        errorMsg[errorMsg.length] = "Please enter a Phone Number";
        errorStatus = true;
    };
    let phoneReg = /^[2-9]\d{2}-\d{3}-\d{4}$/;
    if (phoneReg.test(phone) == false) {
        errorMsg[errorMsg.length] = "Please enter a valid Number";
        errorStatus = true;
    };

    if (errorStatus == true) {
        for (let i = 0; i < errorMsg.length; i++) {
            console.log("error found");
            temp += errorMsg[i] + "</br>";
        }
        $('#errorMsgId').html(temp);
        return false;
    } else {
        return true;
    }
}