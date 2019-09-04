$(function() {
    let url = new URLSearchParams(location.search);
    let teamId = url.get("id");
    let teamData;
    loadTeamCard(teamId);
    boxEffects(teamId);
    $('#checkBox').hide();
    $('#cancelBox').hide();
});

function loadTeamCard(id) {
    $.getJSON(`/api/teams/${id}`, (data) => {
        let cardTopHeader = $('#teamLeague');
        let cardBodyHeader = $('#bodyTop');
        let cardContainer = $('#bodyContainer');
        cardTopHeader.html(`${data.League}`);
        cardBodyHeader.html(`-<u>${data.TeamName}</u>-`);
        cardContainer.append($('<p />')
            .attr('class', ' card-text largePoint')
            .html(`Team Gender: ${data.TeamGender}`)
        );
        cardContainer.append($('<p />')
            .attr('class', ' card-text memNum largePoint')
            .html(`Max Team Member Age: ${data.MaxMemberAge} y/o`)
        );
        cardContainer.append($('<p />')
            .attr('class', ' card-text memNum largePoint')
            .html(`Number of members: (${data.Members.length})`)
        );
        cardContainer.append($('<p />')
            .attr('class', ' card-text memNum largePoint')
            .html(`Max Team Members: (${data.MaxTeamMembers})`)
        );

        loadMemberCard(data);
        boxValidation(data);
        submitForm(id, data);
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
    $('input[name="phone"]').on({
        focus: function() {
            $(this).attr('placeholder', '(810)-123-4321')
        },
        blur: function() {
            $(this).attr('placeholder', 'Your Number');
        }
    });
};

function boxValidation(data) {
    //All Texboes on focus
    $('input[type="text"]').on({
        focus: function() {
            $(this).addClass('focusColor');
            $(this).removeClass('errorRed');
            $('#errorRmv').remove();
        },
        blur: function() {
            $('input[type="text"]').removeClass('focusColor');
        }
    });
    //Textbox on blur validation
    $('#memberName').on({
        focus: function() {
            $('#errorRmv').remove();
        },
        blur: function() {
            if (!$(this).val().trim()) {
                $(this).addClass('errorRed')
                $(this).after(`<div id="errorRmv"><small class="text-danger">&nbsp; Please enter a name</small></div>`)
                $(this).html('');
            };
        }
    });
    $('#age').on({
        focus: function() {
            $('#errorRmv').remove();
        },
        blur: function() {
            let numReg = /^[0-9]*$/;
            if (!numReg.test($(this).val()) || $(this).val() < 10 || $(this).val() >= 99) {
                $(this).addClass('errorRed')
                $(this).after(`<div id="errorRmv"><small class="text-danger">&nbsp;Please enter a valid age between 10 & 99</small></div>`)
                $(this).val('');
            };
            if (parseInt($(this).val()) > data.MaxMemberAge) {
                $(this).addClass('errorRed')
                $(this).after(`<div id="errorRmv"><small class="text-danger">&nbsp;Your age does not meet the requirements for this team</small></div>`)
                $(this).val('');
            };
        }
    });
    $('#memberPhone').on({
        focus: function() {
            $('#errorRmv').remove();
        },
        blur: function() {
            let phoneReg = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/
            if (!$(this).val().trim() || !phoneReg.test($(this).val())) {
                $(this).addClass('errorRed')
                $(this).after(`<div id="errorRmv"><small class="text-danger">&nbsp; Please enter a phone number</small></div>`)
                $(this).val('');
            };
        }
    });
    $('#memberEmail').on({
        focus: function() {
            $('#errorRmv').remove();
        },
        blur: function() {
            let emailReg = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
            if (!$(this).val().trim() || !emailReg.test($(this).val())) {
                $(this).addClass('errorRed')
                $(this).after(`<div id="errorRmv"><small class="text-danger">&nbsp; Please enter a valid email</small></div>`)
                $(this).html('');
            };
        }
    });
    $('#nickName').on({
        focus: function() {
            $('#errorRmv').remove();
        },
        blur: function() {
            if (!$(this).val().trim()) {
                $(this).addClass('errorRed')
                $(this).after(`<div id="errorRmv"><small class="text-danger">&nbsp; Please enter a name</small></div>`)
                $(this).html('');
            };
        }
    });
};

function submitForm(id, data) {
    $('#submit').on({
        click: function(e) {
            e.preventDefault();
            if (!$('input[name="gender"]:checked').val()) {
                $('#endRow').after(`<div id="errorRmv"><small class="text-danger">&nbsp; Please select a gender.</small></div>`)
            } else {
                $('#errorRmv').remove();
            };
            if (!$('input[type=text]').hasClass('errorRed') && $('input[type=text]').val() != "" && $('input[name="gender"]:checked').val() != undefined) {
                $.post(`/api/teams/${id}/members`, $("#signupForm").serialize(), function() {
                    window.location.href = "teamList.html"
                });
            };
        },
        mouseenter: function() {
            $('#checkBox').show();
        },
        mouseleave: function() {
            $('#checkBox').hide();
        }
    });
    $('#cancel').on({
        mouseenter: function() {
            $('#cancelBox').show();
        },
        mouseleave: function() {
            $('#cancelBox').hide();
        }
    });
    if (data.TeamGender == "Male") {
        $('#maleRadio').prop('checked', true);
        $('#femaleRadio').prop('disabled', true);
    };
    if (data.TeamGender == "Female") {
        $('#femaleRadio').prop('checked', true);
        $('#maleRadio').prop('disabled', true)
    };
};

function loadMemberCard(data) {
    defaultMemberCard(data)
    $.each(data.Members, function(i) {
        let member = data.Members[i];
        $('#memberData').append($('<tr />')
            .attr('id', `mem${member.MemberId}`)
        );
        $(`#mem${member.MemberId}`).append($('<td />')
            .attr('class', 'largePoint')
            .html(`<i class="fas fa-child"></i> &nbsp;${member.MemberName} (${member.Age}) - Years Old &nbsp; `)
        );
        $(`#mem${member.MemberId}`).on('click', function() {
            $('#memberCard').empty();
            $('#memberCard').append($('<p />')
                .attr('class', 'card-text largePoint')
                .html(`Member Name: ${member.MemberName}`)
            );
            $('#memberCard').append($('<p />')
                .attr('class', 'card-text largePoint')
                .html(`Nick Name ${member.ContactName}`)
            );
            $('#memberCard').append($('<p />')
                .attr('class', 'card-text largePoint')
                .html(`Email ${member.Email}`)
            );
        });
    });
};

function defaultMemberCard(data) {
    $('#memberCard').empty();
    // console.log(data);
    $('#memberCard').append($('<div />')
        .attr('id', 'leagueRow')
    );
    $('#leagueRow').append($('<div />')
        .attr('class', 'col-md-12 text-center')
        .attr('id', 'leagueCol')
    );
    $('#leagueCol').append($('<div />')
        .attr('class', 'ml-2 imgHolderS border border-dark shadow-lg')
        .attr('id', 'leagueImg')
    );
    let leagueImg = imageSwitch(data.League);
    $('#leagueImg').addClass(leagueImg);
    $('#memberCard').append($('<p />')
        .attr('class', 'card-text offset-4 largePoint')
        .html(`Manager Info`)
    );
    $('#memberCard').append($('<p />')
        .attr('class', 'card-text largePoint')
        .html(`Name: ${data.ManagerName}`)
    );
    $('#memberCard').append($('<p />')
        .attr('class', 'card-text largePoint')
        .html(`Email: ${data.ManagerEmail}`)
    );
    $('#memberCard').append($('<p />')
        .attr('class', 'card-text largePoint')
        .html(`Phone Number: ${data.ManagerPhone}`)
    );

};

function imageSwitch(league) {
    switch (league) {
        case "LIQ":
            league = "liqLogo";
            break;
        case "NRG":
            league = "nrgLogo";
            break;
        case "COM":
            league = "comLogo"
            break;
        case "TSM":
            league = "tsmLogo"
            break;
    };
    return league;
};