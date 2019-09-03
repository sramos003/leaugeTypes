"use strict";
/* Author S.R
 *  /
 * //READY FUNCTION
 */
$(function() {
    let type = sessionStorage.cachedType;
    let name = sessionStorage.cachedManagerName;
});
/*  /Index for effects
 * [1].Shadow on hover for boxes.
 * [2].Text change.
 * [3].Animations.
 */
function cardEffect(data) {
    let id = data.TeamId
        //[1] -- Shadow
    $(`#teamNum${id}`).on({
        mouseenter: function() {
            $(`#teamNum${id}`).removeClass('shadow-lg');
            $(`#teamNum${id}`).addClass('shadow-md');
        },
        mouseleave: function() {
            $(`#teamNum${id}`).removeClass('shadow-md');
            $(`#teamNum${id}`).addClass('shadow-lg');
        }
    });
    //[2] -- Text Change
    $(`#tn${id}`).on({
        mouseenter: function() {
            $(`#tn${id}`).append($('<hr>')
                .attr('id', `divider${id}`));
            $(`#tn${id}`).append($('<a />')
                .attr('id', `info${id}`)
                .attr('class', 'btn btn-primary text-white border hidden border-dark')
                .html('View League Info')
                .on('click', function() {
                    getTeamInfo(data, id)
                }));
            $(`#tn${id}`).append($('<a />')
                .attr('id', `join${id}`)
                .attr('class', 'mx-2 btn btn-info text-white hidden border border-dark')
                .html('Join')
                .on('click', function() {
                    window.location.href = `teamSignup.html?id=${id}`
                }));
            $(`#info${id}`).fadeIn(500);
            $(`#join${id}`).fadeIn(500);
        },
        mouseleave: function() {
            $(`#info${id}`).remove();
            $(`#join${id}`).remove();
            $(`#divider${id}`).remove();
        }
    });
    //[3] -- Redirect
};

//This will create the basic card templ
function cardSwitch(data) {
    let id = data.TeamId
    $('#allCards').append($('<div />')
        .attr('class', 'card my-3 mx-3 shadow-lg border border-secondary')
        .attr('id', 'teamNum' + id)
    );
    $('#teamNum' + id).append($('<h4 />')
        .attr('class', 'card-header bg-secondary text-white shadow-sm border-bottom border-dark')
        .html(`${data.League}`));
    $('#teamNum' + id).append($('<div />')
        .attr('class', 'card-body')
        .attr('id', 'tn' + id));
    cardSwitch2(data, id);
};

function cardSwitch2(data, id) {
    $('#tn' + id).append($('<div />')
        .attr('class', `row ${id}`));
    $(`.${id}`).append($('<div />')
        .attr('class', 'col-md-8')
        .attr('id', `details${id}`));
    $(`.${id}`).append($('<div />')
        .attr('class', `col-md-4`)
        .attr('id', `img${id}`));
    cardSwitch3(data, id);
};

function cardSwitch3(data, id) {
    let maxMembers;
    if (data.MaxTeamMembers > 40) {
        maxMembers = "30+"
    } else {
        maxMembers = data.MaxTeamMembers
    }
    //details
    let detailsField = $(`#details${id}`)
    detailsField.append($('<h4 />')
        .html(`&nbsp;- <u>${data.TeamName}</u> -&nbsp;`));
    detailsField.append($('<p />')
        .attr('class', ' card-text largePoint')
        .html(`Manager Name: ${data.ManagerName}`));
    detailsField.append($('<p />')
        .attr('class', ' card-text largePoint')
        .html(`Team Gender: ${data.TeamGender}`));
    detailsField.append($('<p />')
        .attr('class', ' card-text memNum largePoint')
        .html(`Number of members: (${data.Members.length})`));
    detailsField.append($('<p />')
        .attr('class', ' card-text largePoint')
        .html(`Max Members: (<strong>${maxMembers}</strong>)`));
    //img
    let imgField = $(`#img${id}`)
    let img = imageSwitch(data.League);
    imgField.append($('<div />')
        .attr('class', 'imgHolderC'));
    $('.imgHolderC').addClass(img);

};

function getTeamInfo(data, id) {
    let field = $(`#tn${id}`);
    field.empty();
    field.append($('<h4 />')
        .html(`&nbsp;- <u>${data.TeamName}</u> -&nbsp;`));

    field.append($('<p />')
        .html(`<i>NRG Esports is an American professional esports organization based in Los Angeles, California. It has rosters in Apex Legends, Counter-Strike: Global Offensive, Clash Royale, Dragon Ball FighterZ, Hearthstone, Overwatch, Rocket League, and Super Smash Bros. Ultimate, as well as a number of streamers on the streaming platform Twitch.</i>`));

};

function imageSwitch(obj) {
    switch (obj) {
        case "LIQ":
            obj = "stadium";
            break;
        case "NRG":
            obj = "second";
            break;
    };
    return obj;
};

$(function() {
    $.getJSON("/api/leagues", (leagueData) => {
        for (let i = 0; i < leagueData.length; i++) {
            $("#leaguesDDL").append($("<option />")
                .html(leagueData[i].Name)
                .attr('value', leagueData[i].Code));
        };
    });
    $.getJSON("/api/teams", (teamsData) => {
        let team;
        for (let i = 0; i < teamsData.length; i++) {
            team = teamsData
            cardSwitch(team[i]);
            cardEffect(team[i]);
            $("#teamsDDL").append($("<option />")
                .html(team[i].TeamName)
                .attr('value', team[i].League));
        };
        $('#search').on('click', () => {
            $('#allCards').empty();
            for (let i = 0; i < team.length; i++) {
                searchData(team[i]);
            };
        });
    });
});

function searchData(team) {
    let selectedLeague = $('#leaguesDDL').val();
    let teamSize = $('#sizeDDL').val();
    let selectedRadio = $('input[type="radio"]:checked').val();
    //
    if (teamSize == "ALL") {
        if (selectedLeague == team.League && selectedRadio == team.TeamGender) {
            cardSwitch(team);
            cardEffect(team);
        };
    };
    if (teamSize == "SM") {
        if (selectedLeague == team.League && selectedRadio == team.TeamGender && team.MaxTeamMembers < 20) {
            cardSwitch(team);
            cardEffect(team);
        };
    };
    if (teamSize == "MD") {
        if (selectedLeague == team.League && selectedRadio == team.TeamGender && team.MaxTeamMembers >= 20 && team.MaxTeamMembers < 30) {
            cardSwitch(team);
            cardEffect(team);
        };
    };
    if (teamSize == "LG") {
        if (selectedLeague == team.League && selectedRadio == team.TeamGender && team.MaxTeamMembers >= 30) {
            cardSwitch(team);
            cardEffect(team);
        };
    };
};