let express = require("express");
let bodyParser = require("body-parser");
let fs = require("fs");

let app = express();

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

// ------ Debugging support ------------------

function logOneTeam(team) {
    console.log("ID: " + team.TeamId +
        " Team Name:" + team.TeamName +
        " League:" + team.League +
        " Manager:" + team.ManagerName +
        " # Members: " + team.Members.length);
}

function logArrayOfTeams(arr) {
    for (let i = 0; i < arr.length; i++) {
        logOneTeam(arr[i])
    }
}

// ------ Get next ID helper ------------------

function getNextId(counterType) // use 'member' or 'team' as counterType
{
    // read the counter file
    let data = fs.readFileSync(__dirname + "/data/counters.json", "utf8");
    data = JSON.parse(data);

    // find the next id from the counters file and then increment the
    // counter in the file to indicate that id was used
    let id = -1;
    switch (counterType.toLowerCase()) {
        case "team":
            id = data.nextTeam;
            data.nextTeam++;
            break;
        case "member":
            id = data.nextMember;
            data.nextMember++;
            break;
    }

    // save the updated counter
    fs.writeFileSync(__dirname + "/data/counters.json", JSON.stringify(data));

    return id;
}

// ------ Search helpers ------------------

function getMatchingTeamById(id, data) {
    let match = data.find(t => t.TeamId == id);
    return match;
}

function getMatchingTeamsByLeague(leagueCode, data) {
    let matches = data.filter(t => t.League == leagueCode);
    return matches;
}

// ------ Membership change conflict helpers ------------------

function getMinAgeOfMember(team) {
    let minAge = 100000;
    for (let i = 0; i < team.Members.length; i++) {
        if (Number(team.Members[i].Age) < minAge) {
            minAge = Number(team.Members[i].Age);
        }
    }
    return minAge;
}

function getMaxAgeOfMember(team) {
    let maxAge = -1;
    for (let i = 0; i < team.Members.length; i++) {
        if (Number(team.Members[i].Age) > maxAge) {
            maxAge = Number(team.Members[i].Age);
        }
    }
    return maxAge;
}

function isThereAnyGenderChangeConflicts(newTeamGender, team) {
    if (newTeamGender == "Any") {
        // No conflict w/ team switching to coed
        return false;
    }

    let conflictGender = newTeamGender == "Male" ? "Female" : "Male";
    for (let i = 0; i < team.Members.length; i++) {
        // look for member whose gender would conflict with new team gender
        if (team.Members[i].Gender == conflictGender) {
            //console.log("Found member who is " + team.Members[i].Gender + " on a team witching to " + newTeamGender);
            return true; // found a conflict!
        }
    }

    return false; // no conflicts
}

// ------ Validation helpers ------------------

function isValidTeam(team) {
    if (team.TeamName == undefined || team.TeamName.trim() == "")
        return false;
    if (team.League == undefined || team.League.trim() == "")
        return false;
    if (team.ManagerName == undefined || team.ManagerName.trim() == "")
        return false;
    if (team.ManagerPhone == undefined || team.ManagerPhone.trim() == "")
        return false;
    if (team.ManagerEmail == undefined || team.ManagerEmail.trim() == "")
        return false;
    if (team.MaxTeamMembers == undefined || isNaN(team.MaxTeamMembers))
        return false;
    if (team.MinMemberAge == undefined || isNaN(team.MinMemberAge))
        return false;
    if (team.MaxMemberAge == undefined || isNaN(team.MaxMemberAge))
        return false;
    if (team.TeamGender == undefined || team.TeamGender.trim() == "")
        return false;
    if (team.TeamGender != "Any" && team.TeamGender != "Male" && team.TeamGender != "Female")
        return false;

    return true;
}

function isValidMember(member) {
    if (member.Email == undefined || member.Email.trim() == "")
        return false;
    if (member.MemberName == undefined || member.MemberName.trim() == "")
        return false;
    if (member.ContactName == undefined || member.ContactName.trim() == "")
        return false;
    if (member.Phone == undefined || member.Phone.trim() == "")
        return false;
    if (member.Age == undefined || isNaN(member.Age))
        return false;
    if (member.Gender == undefined || member.Gender.trim() == "")
        return false;
    if (member.Gender != "Any" && member.Gender != "Male" && member.Gender != "Female")
        return false;

    return true;
}

// ------------------------------------------------------------------------------
// THIS CODE ALLOWS REQUESTS FOR THE PAGES THROUGH

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/" + "index.html");
})

app.get("/index.html", function(req, res) {
    res.sendFile(__dirname + "/public/" + "index.html");
})

app.get("/teamList.html", function(req, res) {
    res.sendFile(__dirname + "/public/" + "teamList.html");
})

// TODO:  YOU WILL NEED TO ADD MORE CALLS TO app.get() FOR EACH PAGE
//        YOU END UP BUILDING




// ------------------------------------------------------------------------------
// THIS CODE ALLOWS REQUESTS FOR THE API THROUGH

// GET LEAGUES
app.get("/api/leagues", function(req, res) {
    console.log("Received a GET request for leagues");

    let data = fs.readFileSync(__dirname + "/data/leagues.json", "utf8");
    data = JSON.parse(data);

    // console.log("Returned leagues are: ");
    // for(let i = 0; i < data.length; i++) {
    //   console.log("League: " + data[i].Name);
    // }
    res.end(JSON.stringify(data));
});

// GET ALL TEAMS
app.get("/api/teams", function(req, res) {
    console.log("Received a GET request for ALL teams");

    let data = fs.readFileSync(__dirname + "/data/teams.json", "utf8");
    data = JSON.parse(data);

    //console.log("Returned data is: ");
    //logArrayOfTeams(data);
    res.end(JSON.stringify(data));
});

// GET ONE TEAM BY ID
app.get("/api/teams/:id", function(req, res) {
    let id = req.params.id;
    console.log("Received a GET request for team " + id);

    let data = fs.readFileSync(__dirname + "/data/teams.json", "utf8");
    data = JSON.parse(data);

    let match = getMatchingTeamById(id, data)
    if (match == null) {
        res.status(404).send("Not Found");
        return;
    }

    //console.log("Returned data is: ");
    //logOneTeam(match);
    res.end(JSON.stringify(match));
})

// GET MANY TEAMS BY LEAGUE
app.get("/api/teams/byleague/:id", function(req, res) {
    let id = req.params.id;
    console.log("Received a GET request for teams in league " + id);

    let data = fs.readFileSync(__dirname + "/data/teams.json", "utf8");
    data = JSON.parse(data);

    // find the matching teams for
    let matches = getMatchingTeamsByLeague(id, data);

    //console.log("Returned data is: ");
    //logArrayOfTeams(matches);
    res.end(JSON.stringify(matches));
})

// GET A SPECIFIC MEMBER ON A SPECIFIC TEAM
app.get("/api/teams/:teamid/members/:memberid", function(req, res) {
    let teamId = req.params.teamid;
    let memberId = req.params.memberid;
    console.log("Received a GET request for member " + memberId + " on team " + teamId);

    let data = fs.readFileSync(__dirname + "/data/teams.json", "utf8");
    data = JSON.parse(data);

    // find the team member on the team
    let team = getMatchingTeamById(teamId, data)
    if (team == null) {
        res.status(404).send("Team Not Found");
        return;
    }

    // find existing member on the team
    let match = team.Members.find(m => m.MemberId == memberId);
    if (match == null) {
        res.status(404).send("Member Not Found");
        return;
    }

    //console.log("Returned data is: ");
    //console.log("Member: " + memberId + " Name: " + match.memberName);
    res.end(JSON.stringify(match));
})

// ADD A TEAM
app.post("/api/teams", urlencodedParser, function(req, res) {
    console.log("Received a POST request to add a team");
    console.log("BODY -------->" + JSON.stringify(req.body));

    // assemble team information so we can validate it
    let team = {
        TeamId: getNextId("team"), // assign id to team
        TeamName: req.body.teamname,
        League: req.body.leaguecode,
        ManagerName: req.body.managername,
        ManagerPhone: req.body.managerphone,
        ManagerEmail: req.body.manageremail,
        MaxTeamMembers: Number(req.body.maxteammembers),
        MinMemberAge: Number(req.body.minmemberage),
        MaxMemberAge: Number(req.body.maxmemberage),
        TeamGender: req.body.teamgender,
        Members: []
    };

    //console.log("Performing team validation...")
    if (!isValidTeam(team)) {
        //console.log("Invalid  data!")
        res.status(400).send("Bad Request - Incorrect or Missing Data");
        return;
    }
    //console.log("Valid data!")

    let data = fs.readFileSync(__dirname + "/data/teams.json", "utf8");
    data = JSON.parse(data);

    // add the team
    data[data.length] = team;

    fs.writeFileSync(__dirname + "/data/teams.json", JSON.stringify(data));

    //console.log("New team added: ");
    //logOneTeam(team);
    res.status(200).send();
})

// EDIT A TEAM
app.put("/api/teams", urlencodedParser, function(req, res) {
    console.log("Received a PUT request to edit a team");
    console.log("BODY -------->" + JSON.stringify(req.body));

    // assemble team information so we can validate it
    let team = {
        TeamId: req.body.teamid,
        TeamName: req.body.teamname,
        League: req.body.leaguecode,
        ManagerName: req.body.managername,
        ManagerPhone: req.body.managerphone,
        ManagerEmail: req.body.manageremail,
        MaxTeamMembers: Number(req.body.maxteammembers),
        MinMemberAge: Number(req.body.minmemberage),
        MaxMemberAge: Number(req.body.maxmemberage),
        TeamGender: req.body.teamgender,
    };

    //console.log("Performing team validation...")
    if (!isValidTeam(team)) {
        //console.log("Invalid  data!")
        res.status(400).send("Bad Request - Incorrect or Missing Data");
        return;
    }
    //console.log("Valid data!")

    let data = fs.readFileSync(__dirname + "/data/teams.json", "utf8");
    data = JSON.parse(data);

    // find team
    let match = getMatchingTeamById(req.body.teamid, data)
    if (match == null) {
        res.status(404).send("Not Found");
        return;
    }

    // update the team
    match.TeamName = req.body.teamname;
    match.League = req.body.leaguecode;
    match.ManagerName = req.body.managername;
    match.ManagerPhone = req.body.managerphone;
    match.ManagerEmail = req.body.manageremail;

    // make sure new values for max members, min/max age, or gender
    // don't conflict with members already on team

    if (Number(req.body.maxteammembers) < match.Members.length) {
        res.status(409).send("Team size too small based on current roster");
        return;
    }
    match.MaxTeamMembers = Number(req.body.maxteammembers);

    if (Number(req.body.minmemberage) > getMinAgeOfMember(match)) {
        res.status(409).send("Minimum age is greater than current member on team");
        return;
    }
    match.MinMemberAge = Number(req.body.minmemberage);

    if (Number(req.body.maxmemberage) < getMaxAgeOfMember(match)) {
        res.status(409).send("Maximum age is less than current member on team");
        return;
    }
    match.MaxMemberAge = Number(req.body.maxmemberage);

    if (isThereAnyGenderChangeConflicts(req.body.teamgender, match)) {
        res.status(409).send("Gender change conflicts with current member on team");
        return;
    }
    match.TeamGender = req.body.teamgender,


        fs.writeFileSync(__dirname + "/data/teams.json", JSON.stringify(data));

    //console.log("Team updated!");
    //logOneTeam(match);
    res.status(200).send();
})

// DELETE A TEAM
app.delete("/api/teams/:id", function(req, res) {
    let id = req.params.id;
    console.log("Received a DELETE request for team " + id);

    let data = fs.readFileSync(__dirname + "/data/teams.json", "utf8");
    data = JSON.parse(data);

    // find the index number of the team in the array
    let foundAt = data.findIndex(t => t.TeamId == id);

    // delete the team if found
    if (foundAt != -1) {
        match = data.splice(foundAt, 1);
    }

    fs.writeFileSync(__dirname + "/data/teams.json", JSON.stringify(data));

    console.log("Team deleted!");
    //logOneTeam(match);
    // Note:  even if we didn't find them, send a 200 because they are gone
    res.status(200).send();
})

// ADD A MEMBER TO A TEAM
app.post("/api/teams/:id/members", urlencodedParser, function(req, res) {
    let teamId = req.params.id;
    console.log("Received a POST request to add a member to team " + teamId);
    console.log("BODY -------->" + JSON.stringify(req.body));

    // assemble member information so we can validate it
    let member = {
        MemberId: getNextId("member"), // assign new id
        Email: req.body.email,
        MemberName: req.body.membername,
        ContactName: req.body.contactname,
        Age: Number(req.body.age),
        Gender: req.body.gender,
        Phone: req.body.phone
    };

    //console.log("Performing member validation...")
    if (!isValidMember(member)) {
        //console.log("Invalid  data!")
        res.status(400).send("Bad Request - Incorrect or Missing Data");
        return;
    }
    //console.log("Valid data!")

    let data = fs.readFileSync(__dirname + "/data/teams.json", "utf8");
    data = JSON.parse(data);

    let match = getMatchingTeamById(teamId, data)
    if (match == null) {
        res.status(404).send("Team Not Found");
        return;
    }

    // make sure assignment doesn't violate team rules

    if (member.Age < match.MinMemberAge || member.Age > match.MaxMemberAge) {
        res.status(409).send("Member's age is outside of bounds of team age rules");
        return;
    }

    if (match.TeamGender != "Any" && member.Gender != match.TeamGender) {
        res.status(409).send("Member's gender does not conform to team gender rules");
        return;
    }

    // add the team
    match.Members[match.Members.length] = member;

    fs.writeFileSync(__dirname + "/data/teams.json", JSON.stringify(data));

    //console.log("New member added: ");
    //console.log("Name: " + member.MemberName)
    res.status(200).send();
})

// EDIT A MEMBER ON TEAM
app.put("/api/teams/:id/members", urlencodedParser, function(req, res) {
    let teamId = req.params.id;
    console.log("Received a PUT request to edit a member on team " + teamId);
    console.log("BODY -------->" + JSON.stringify(req.body));

    // assemble member information so we can validate it
    let member = {
        MemberId: req.body.memberid,
        Email: req.body.email,
        MemberName: req.body.membername,
        ContactName: req.body.contactname,
        Age: Number(req.body.age),
        Gender: req.body.gender,
        Phone: req.body.phone
    };

    //console.log("Performing member validation...")
    if (!isValidMember(member)) {
        //console.log("Invalid  data!")
        res.status(400).send("Bad Request - Incorrect or Missing Data");
        return;
    }
    //console.log("Valid data!")

    // find the team
    let data = fs.readFileSync(__dirname + "/data/teams.json", "utf8");
    data = JSON.parse(data);

    let team = getMatchingTeamById(teamId, data)
    if (team == null) {
        res.status(404).send("Team Not Found");
        return;
    }

    // find existing member on the team
    let match = team.Members.find(m => m.MemberId == req.body.memberid);
    if (match == null) {
        res.status(404).send("Member Not Found");
        return;
    }

    // update the member
    match.Email = req.body.email;
    match.MemberName = req.body.membername;
    match.ContactName = req.body.contactname;
    match.Age = Number(req.body.age);
    match.Gender = req.body.gender;
    match.Phone = req.body.phone;

    // make sure edit doesn't violate team rules

    if (match.Age < team.MinMemberAge || match.Age > team.MaxMemberAge) {
        res.status(409).send("Member's new age is outside of bounds of team age rules");
        return;
    }

    if (team.TeamGender != "Any" && match.Gender != team.TeamGender) {
        res.status(409).send("Member's new gender does not conform to team gender rules");
        return;
    }

    fs.writeFileSync(__dirname + "/data/teams.json", JSON.stringify(data));

    //console.log("Member edited: ");
    //console.log("Name: " + match.MemberName)
    res.status(200).send();
})

// DELETE A MEMBER ON TEAM
app.delete("/api/teams/:teamid/members/:memberid", urlencodedParser, function(req, res) {
    let teamId = req.params.teamid;
    let memberId = req.params.memberid;
    console.log("Received a DELETE request for member " + memberId + " on team " + teamId);

    // find the team
    let data = fs.readFileSync(__dirname + "/data/teams.json", "utf8");
    data = JSON.parse(data);

    let team = getMatchingTeamById(teamId, data)
    if (team == null) {
        res.status(404).send("Team Not Found");
        return;
    }
    console.log("Found team!");

    // find existing member on the team
    let foundAt = team.Members.findIndex(m => m.MemberId == req.body.memberid);

    let match = null;
    // delete the member if found
    if (foundAt != -1) {
        match = team.Members.splice(foundAt, 1);
    }

    fs.writeFileSync(__dirname + "/data/teams.json", JSON.stringify(data));

    /*if (match != null)
    {
        console.log("Member deleted:");
        console.log("Member name: " + match.MemberName);
    }*/
    // Note:  even if we didn't find them, send a 200 back because they are gone
    res.status(200).send();
})


// ------------------------------------------------------------------------------
// SITE SET-UP

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

let server = app.listen(8081, function() {
    let port = server.address().port

    console.log("App listening at port %s", port)
})