"use strict"
//Steve Ramos
//Ready Function
$(function() {
    $.getJSON("/api/leagues", (data) => {
        $.each(data, function(i) {
            loadLeaguesDDLData(data[i]);
        });
    });
    $.getJSON("/api/teams", (data) => {
        $('#search').on('click', () => {
            $('#allCards').empty();
            searchData(data);
        });
        $.each(data, function(i) {
            cardTemplate(data[i]);
            cardEffects(data[i]);
        });
    });
});
//Loading DDL
function loadLeaguesDDLData(leagueData) {
    $("#leaguesDDL").append($("<option />")
        .html(leagueData.Name)
        .attr('value', leagueData.Code)
    );
};
//searching for a specific team in the specific league
function searchData(teamData) {
    let selectedLeague = $('#leaguesDDL').val();
    let selectedGender = $('input[type="radio"]:checked').val();
    for (let i = 0; i < teamData.length; i++) {
        if (selectedLeague == teamData[i].League && selectedGender == teamData[i].TeamGender) {
            cardTemplate(teamData[i]);
            cardEffects(teamData[i]);
        };
        if (selectedLeague == "ALL" && selectedGender == teamData[i].TeamGender) {
            cardTemplate(teamData[i]);
            cardEffects(teamData[i]);
        };
    };
};
//Creating outer card template
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
//creating inner card template
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
//appending template with details
function cardTemplateData(teamData, id) {
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
    imgField.append($('<div />')
        .attr('class', 'imgHolderL')
    );
    $('.imgHolderL').addClass('thumbCard');
};
//card effects
function cardEffects(teamData) {
    let id = teamData.TeamId;
    let cardMainDiv = $(`#teamNum${id}`);
    let cardBodyDiv = $(`#tn${id}`);
    //spacer
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
                .attr('class', 'btn btn-danger text-white border hidden border-mute')
                .html('View League Info or register')
                .on('click', function() {
                    window.location.href = `teamSignup.html?id=${id}`
                })
            );
            $(`#info${id}`).fadeIn(150);
        },
        mouseleave: function() {
            $(`#info${id}`).remove();
            $(`#divider${id}`).remove();
        }
    });
};