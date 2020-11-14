function renderStudentRankings(classRankingBody, response) {
    response.sort((a, b) => {
        return b.time - a.time;
    });
    console.debug(response);
    response.forEach(function(student, index) {
        let tableRow = document.createElement("TR");
        let rank = tableRow.insertCell(0);
        let name = tableRow.insertCell(1);
        let amount = tableRow.insertCell(2);

        rank.innerText = index + 1;
        name.innerText = student.name;

        let date = new Date(null);
        date.setSeconds(student.time);
        
        // ISOString format 2011-10-05T14:48:00.000Z
        // Start at index 11 and grab 5 characters.
        let result = date.toISOString().substr(11, 5);

        amount.innerText = result;

        classRankingBody.appendChild(tableRow);

    });
}

export { renderStudentRankings };
