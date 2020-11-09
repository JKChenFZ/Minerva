function renderStudentRankings(classRankingBody, response) {
    response.sort((a, b) => {
        return b.time - a.time;
    });
    console.log(response);
    response.forEach(function(student, index) {
        let tableRow = document.createElement("TR");
        let rank = tableRow.insertCell(0);
        let name = tableRow.insertCell(1);
        let amount = tableRow.insertCell(2);

        rank.innerText = index + 1;
        name.innerText = student.name;

        let date = new Date(null);
        date.setSeconds(student.time);
        /* substr takes 2 args. 
        First is start index,
        Second is number of chars to pull.
        11 is the index of Hours and we extend 5 to pull
        minutes.
        */
        let result = date.toISOString().substr(11, 5);

        amount.innerText = result;

        classRankingBody.appendChild(tableRow);

    });
}

export { renderStudentRankings };
