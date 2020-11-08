function renderStudentRankings(classRankingBody, response) {
    classRankings.sort((a,b) => {a.time > b.time ? 1: -1});
    console.log(classRankings);
}

export { renderStudentRankings };
