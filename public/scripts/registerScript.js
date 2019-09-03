$(function() {
    $('#registerSect').hide();

    $('#teamRegister').on('click', function(e) {
        e.preventDefault();
        $('#optionSect').hide();
        $('#registerSect').show();
        $('body').addClass('parallaxReg stadiumTwo');
    });

    $('#registerTeam').on('click', function(e) {
        e.preventDefault();
        registerTeam();
    });

    let leagueData;
    $.getJSON("/api/leagues", (allLeagueData) => {
        leagueData = allLeagueData
        loadDDL(leagueData);
    });

    $('.close').on('click', () => $('.toast').hide());
    $('#formReset').on('click', function(e) {
        e.preventDefault();
        $('input[type="text"]').val('')
    });
    $('input[type="text"]').on({
        focus: function() {
            $(this).addClass('focusColor');
            $('.toast').hide();
        },
        blur: function() {
            $(this).removeClass('focusColor');
        }
    });
    $('.numOnly').on({
        focus: function() {
            $(this).removeClass('errorRed');
            $('#errorRmv').remove();
        },
        blur: function() {
            if (!blurValidate($(this))) {
                $(this).after(`<div id="errorRmv"><small class="text-danger shadow-lg">&nbsp; Please enter a valid number</small></div>`);
            };
        }
    });
});

function loadDDL(data) {
    for (let i = 0; i < data.length; i++) {
        $("#leaguesDDL").append($("<option />")
            .html(data[i].Name)
            .attr('value', data[i].Code));
    };
};

function registerTeam() {
    console.log("running Validation");
    let teamName = $('#teamName').val();
    let name = $('#managerName').val();
    let email = $('#managerEmail').val();
    let phone = $('#managerPhone').val();
    let ddlVal = $('#leaguesDDL').val()
        //End of Variable declarations
    let validatedData = validateForm(teamName, name, email, phone, ddlVal);
    //If data returns true
    if (validatedData) {
        console.log("valid Data");
        $.post("/api/teams", $("#teamForm").serialize(), function() {
            window.location.href = "teamList.html"
        });
    };
};


function blurValidate(field) {
    let numReg = /^[0-9]*$/;
    if (!numReg.test(field.val())) {
        field.addClass('errorRed');
        field.val('');
        return false;
    } else {
        field.removeClass('errorRed');
        return true;
    };
};

//Validator
function validateForm(teamName, name, email, phone, option) {
    // console.log("Im validating");
    let errorMsg = [];
    let errorStatus = false;
    let temp = "";
    // validate courseid
    // trim() - takes off trailing and leading spaces
    if (!teamName.trim()) {
        errorMsg[errorMsg.length] = "Please enter a Team Name.";
        errorStatus = true;
    };
    if (!name.trim()) {
        errorMsg[errorMsg.length] = "Please enter a Name.";
        errorStatus = true;
    };
    if (!email.trim()) {
        errorMsg[errorMsg.length] = "Please enter an Email.";
        errorStatus = true;
    };
    let emailReg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!emailReg.test(email)) {
        errorMsg[errorMsg.length] = "Please enter a valid Email.";
        errorStatus = true;
    };
    if (!phone.trim()) {
        errorMsg[errorMsg.length] = "Please enter a Phone Number.";
        errorStatus = true;
    };
    let phoneReg = /^[2-9]\d{2}-\d{3}-\d{4}$/;
    if (!phoneReg.test(phone)) {
        errorMsg[errorMsg.length] = "Your phone number must include a dash '-' and be no more than 10 numbers.";
        errorStatus = true;
    };
    if (option == "NOT") {
        errorMsg[errorMsg.length] = "Please select a valid League.";
        errorStatus = true;
    };
    if (errorStatus == true) {
        for (let i = 0; i < errorMsg.length; i++) {
            console.log("error found");
            temp += errorMsg[i] + "</br>";
        };
        $('.toast').show();
        $('#errorMsgId').html(temp);
        return false;
    } else {
        return true;
    };
};