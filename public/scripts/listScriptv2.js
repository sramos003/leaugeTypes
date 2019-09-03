"use strict"
//Steve Ramos
$(function() {
    $.getJSON("/api/leagues", (data) => {
        $.each(data, function(i) {
            loadLeaguesDDLData(data[i]);
        });
    });
    $.getJSON("/api/teams", (data) => {
        $.each(data, function(i) {
            $('#search').on('click', () => {
                searchData(data[i]);
            });
            cardTemplate(data[i]);
            cardEffects(data[i]);
        });
    });
});

function loadLeaguesDDLData(leagueData) {
    $("#leaguesDDL").append($("<option />")
        .html(leagueData.Name)
        .attr('value', leagueData.Code)
    );
};

function loadTeamsData(teamData) {
    cardTemplate(teamData);
    cardEffects(teamData);
};
//search specific league?
function searchData(teamData) {
    // $('#allCards').empty();
    let selectedLeague = $('#leaguesDDL').val();
    let selectedGender = $('input[type="radio"]:checked').val();
    switch ($('#sizeDDL').val()) {
        case "ALL":
            if (selectedLeague == teamData.League && selectedGender == teamData.TeamGender) {
                cardTemplate(teamData);
                cardEffects(teamData);
            };
            break;
        case "SM":
            if (selectedLeague == teamData.League && selectedGender == teamData.TeamGender && teamData.MaxTeamMembers < 20) {
                cardTemplate(teamData);
                cardEffects(teamData);
            };
            break;
        case "MD":
            if (selectedLeague == teamData.League && selectedGender == teamData.TeamGender && teamData.MaxTeamMembers >= 20 && teamData.MaxTeamMembers < 30) {
                cardTemplate(teamData);
                cardEffects(teamData);
            };
            break;
        case "LG":
            if (selectedLeague == teamData.League && selectedGender == teamData.TeamGender && teamData.MaxTeamMembers >= 30) {
                cardTemplate(teamData);
                cardEffects(teamData);
            };
            break;
        default:
            console.log("Something went wrong when evaluating sizeDDL's value");
    };
};

function cardTemplate(teamData) {
    //Specific Team Id from data that met specific criteria above
    let id = teamData.TeamId
    $('#allCards').append($('<div />')
        .attr('class', 'card my-3 mx-3 shadow-lg border border-secondary')
        .attr('id', 'teamNum' + id)
    );
    $(`#teamNum${id}`).append($('<h4 />')
        .attr('class', 'card-header bg-secondary text-white shadow-sm border-bottom border-dark')
        .html(`${teamData.League}`)
    );
    $(`#teamNum${id}`).append($('<div />')
        .attr('class', 'card-body')
        .attr('id', `tn${id}`)
    );
    cardTemplateSections(teamData, id);
};

function cardTemplateSections(teamData, id) {
    $(`#tn${id}`).append($('<div />')
        .attr('class', `row ${id}`)
    );
    $(`.${id}`).append($('<div />')
        .attr('class', 'col-md-8')
        .attr('id', `details${id}`)
    );
    $(`.${id}`).append($('<div />')
        .attr('class', `col-md-4`)
        .attr('id', `img${id}`)
    );
    cardTemplateData(teamData, id);
};

function cardTemplateData(teamData, id) {
    //
    let maxMembers;
    if (teamData.MaxTeamMembers > 30) {
        maxMembers = "30+"
    } else {
        maxMembers = teamData.MaxTeamMembers
    };
    //Appending Card body
    let detailsField = $(`#details${id}`)
    detailsField.append($('<h4 />')
        .html(`&nbsp;- <u>${teamData.TeamName}</u> -&nbsp;`)
    );
    detailsField.append($('<p />')
        .attr('class', ' card-text largePoint')
        .html(`Manager Name: ${teamData.ManagerName}`)
    );
    detailsField.append($('<p />')
        .attr('class', ' card-text largePoint')
        .html(`Team Gender: ${teamData.TeamGender}`)
    );
    detailsField.append($('<p />')
        .attr('class', ' card-text memNum largePoint')
        .html(`Number of members: (${teamData.Members.length})`)
    );
    detailsField.append($('<p />')
        .attr('class', ' card-text largePoint')
        .html(`Max Members: (<strong>${maxMembers}</strong>)`)
    );
    //img
    let imgField = $(`#img${id}`)
    let leagueImg = imageSwitch(teamData.League);
    imgField.append($('<div />')
        .attr('class', 'imgHolderC')
    );
    $('.imgHolderC').addClass(leagueImg);
};

function imageSwitch(league) {
    switch (league) {
        case "LIQ":
            league = "stadium";
            break;
        case "NRG":
            league = "second";
            break;
    };
    return league;
};
/*Index
 * [1]. Card Shadow on page load, on mouseEnter shadow resized
 * [2]. On cards mouseEnter event, <a />'s Info dynamically generated
 * [3]. Redirect event to bing to the dynaic <a />'s
 */
function cardEffects(teamData) {
    let id = teamData.TeamId;
    let cardMainDiv = $(`#teamNum${id}`);
    let cardBodyDiv = $(`#tn${id}`);
    //
    cardMainDiv.on({
        mouseenter: function() {
            $(this).removeClass('shadow-lg');
            $(this).addClass('shadow-md');
        },
        mouseleave: function() {
            $(this).removeClass('shadow-md');
            $(this).addClass('shadow-lg');
        }
    });
    cardBodyDiv.on({
        mouseenter: function() {
            $(this).append($('<hr>')
                .attr('id', `divider${id}`)
            );
            $(this).append($('<a />')
                .attr('id', `info${id}`)
                .attr('class', 'btn btn-primary text-white border hidden border-mute')
                .html('View League Info')
                .on('click', function() {
                    // getTeamInfo(data, id)
                })
            );
            $(this).append($('<a />')
                .attr('id', `join${id}`)
                .attr('class', 'mx-2 btn btn-info text-white hidden border border-mute')
                .html('Join')
                .on('click', function() {
                    window.location.href = `teamSignup.html?id=${id}`
                })
            );
            $(`#info${id}`).fadeIn(300);
            $(`#join${id}`).fadeIn(300);
        },
        mouseleave: function() {
            $(`#info${id}`).remove();
            $(`#join${id}`).remove();
            $(`#divider${id}`).remove();
        }
    });
};