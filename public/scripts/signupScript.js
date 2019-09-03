$(function() {
    let url = new URLSearchParams(location.search);
    let teamId = url.get("id");
    let teamData;
    loadCard(teamId);
    boxEffects(teamId);
    submitForm(teamId);
});

function loadCard(id) {
    $.getJSON(`/api/teams/${id}`, (data) => {
        let cardTopHeader = $('#teamLeague');
        let cardBodyHeader = $('#bodyTop');
        let cardContainer = $('#bodyContainer');
        cardTopHeader.html(`${data.League}`);
        cardBodyHeader.html(`-<u>${data.TeamName}</u>-`);
        cardContainer.append($('<p />')
            .attr('value', 'card-text largePoint')
            .html(`Manager Name: ${data.ManagerName}`)
        );
        cardContainer.append($('<p />')
            .attr('class', ' card-text largePoint')
            .html(`Team Gender: ${data.TeamGender}`)
        );
        cardContainer.append($('<p />')
            .attr('class', ' card-text memNum largePoint')
            .html(`Number of members: (${data.Members.length})`)
        );
    });
};

function boxEffects(id) {
    $(`#teamCard`).on({
        mouseenter: function() {
            $(this).removeClass('shadow-lg');
            $(this).addClass('shadow-md');
        },
        mouseleave: function() {
            $(this).removeClass('shadow-md');
            $(this).addClass('shadow-lg');
        }
    });
    //All Texboes on focus
    $('input[type="text"]').on({
        focus: function() {
            $(this).addClass('focusColor');
            $('.toast').hide();
        },
        blur: function() {
            $(this).removeClass('focusColor');
        }
    });
    //When Phone textbox focused, changes to phoneNum format
    $('input[name="phone"]').on({
        focus: function() {
            $(this).attr('placeholder', '(810)-123-4321')
        },
        blur: function() {
            $(this).attr('placeholder', 'Your Number');
        }
    });
    $('.num').on({
        focus: function() {
            $(this).removeClass('errorRed');
            $('#errorRmv').remove();
        },
        blur: function() {
            let numReg = /^[0-9]*$/;
            let phoneReg = /^[2-9]\d{2}(-)\d{3}(-)\d{4}$/;
            if (!numReg.test($(this).val()) && !phoneReg.test($(this).val())) {
                $(this).val('');
                $(this).addClass('errorRed');
                $(this).after(`<div id="errorRmv"><small class="text-danger shadow-lg">&nbsp; Please enter a valid number</small></div>`);
            };
        }
    });
    $('#memberName"]').on({
        focus: function() {
            removeError($(this));
        },
        blur: function() {
            if (!$(this).val().trim()) {
                addError($(this));
            };
        }
    });
    $('#memberPhone"]').on({
        focus: function() {
            removeError($(this));
        },
        blur: function() {
            if (!$(this).val().trim()) {
                addError($(this));
            };
        }
    });
    $('#memberEmail"]').on({
        focus: function() {
            removeError($(this));
        },
        blur: function() {
            if (!$(this).val().trim()) {
                addError($(this));
            };
        }
    });
    $('#nickName"]').on({
        focus: function() {
            removeError($(this));
        },
        blur: function() {
            if (!$(this).val().trim()) {
                addError($(this));
            };
        }
    });
};

function removeError(field) {
    $(field).removeclass('errorRed');
    $('#errorrmv').remove();
};

function addError(field) {
    $(field).addClass('errorRed');
    $(field).after(`<div id="errorRmv"><small class="text-danger shadow-lg">&nbsp; Please enter a name</small></div>`);
};

function submitForm(id) {
    //alert("I exist ")
    $('#submit').on('click', function(e) {
        e.preventDefault();
        let nameFieldA = $('#memberName').val();
        let nameFieldB = $('#nickName').html();
        let numberField = $('#memberPhone').val();
        let emailField = $('#memberEmail').val();
        let ageField = $('#age').val();
        let validForm = validateForm(nameFieldA, nameFieldB, numberField, emailField, ageField);
        if (validForm) {
            $.post(`/api/teams/${id}/members`, $("#signupForm").serialize(), function() {
                window.location.href = "teamList.html"
            });
        }
    });
};

function validateForm(memberName, memberContact, phone, email, age) {
    // console.log("Im validating");
    let errorMsg = [];
    let errorStatus = false;
    let temp = "";
    // trim() - takes off trailing and leading spaces
    if (!memberName.trim()) {
        errorMsg[errorMsg.length] = "Please enter a Name.";
        errorStatus = true;
    };
    /*     if (!memeberContact.trim()) {
            errorMsg[errorMsg.length] = "Please enter a Nick Name.";
            errorStatus = true;
        }; */
    if (!email.trim()) {
        errorMsg[errorMsg.length] = "Please enter an Email.";
        errorStatus = true;
    };
    let emailReg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!emailReg.test(email)) {
        errorMsg[errorMsg.length] = "Please enter a valid Email.";
        errorStatus = true;
    };
    if (!age.trim()) {
        errorMsg[errorMsg.length] = "Please enter an Age.";
        errorStatus = true;
    };
    let phoneReg = /^[2-9]\d{2}(-)\d{3}(-)\d{4}$/;
    if (!phoneReg.test(phone)) {
        errorMsg[errorMsg.length] = "Please enter a valid Phone Number";
        errorStatus = true;
    };
    if (errorStatus == true) {
        $('.card-body').empty();
        for (let i = 0; i < errorMsg.length; i++) {
            console.log("error found");
            temp += errorMsg[i] + "</br>";
        };
        return false;
    } else {
        return true;
    };
};