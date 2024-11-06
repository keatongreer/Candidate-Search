import { useState, useEffect } from "react";
import { searchGithub, searchGithubUser } from "../api/API";
import Candidate from "../interfaces/Candidate.interface";

const CandidateSearch = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate>();
  const [potentialCandidates, setPotentialCandidates] = useState<Candidate[]>(
    []
  );
  const [fetchingData, setFetchingData] = useState(true);

  const fetchCandidates = async () => {
    try {
      setFetchingData(true);
      const data = await searchGithub();
      const candidateLogins: string[] = data.map((user: any) => user.login);

      const candidateData: Candidate[] = [];

      for (const login of candidateLogins) {
        try {
          const user = await searchGithubUser(login);

          if (user.login) {
            candidateData.push({
              login: user.login,
              name: user.name || null,
              location: user.location || null,
              email: user.email || null,
              company: user.company || null,
              bio: user.bio || null,
              avatar_url: user.avatar_url,
              html_url: user.html_url,
            });
          }
        } catch (error: any) {
          if (error.response?.status === 404) {
            console.log(`User with login ${login} not found. Skipping.`);
          } else {
            console.error(`Failed to fetch data for ${login}:`, error);
          }
        }
      }
      console.log(candidateData);
      setPotentialCandidates(candidateData);

      if (candidateData.length > 0) {
        setCurrentCandidate(candidateData[0]);
      }

      setFetchingData(false);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    }
  };

  const acceptCandidate = () => {
    let parsedSavedCandidates: Candidate[] = [];
    const storedSavedCandidates = localStorage.getItem("savedCandidates");
    if (typeof storedSavedCandidates === "string") {
      parsedSavedCandidates = JSON.parse(storedSavedCandidates);
    }
    parsedSavedCandidates.push(currentCandidate!);
    localStorage.setItem(
      "savedCandidates",
      JSON.stringify(parsedSavedCandidates)
    );
    nextCandidate();
  };

  const rejectCandidate = () => {
    nextCandidate();
  };

  const nextCandidate = () => {
    console.log(potentialCandidates.length);
    if (potentialCandidates.length === 1) {
      fetchCandidates();
    } else {
      setPotentialCandidates((prevCandidates) => {
        const updatedCandidates = prevCandidates.filter(
          (candidate) => candidate.login !== currentCandidate?.login
        );
        console.log(updatedCandidates);
        console.log(currentCandidate);
        setCurrentCandidate(updatedCandidates[0]);
        return updatedCandidates;
      });
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return currentCandidate && !fetchingData ? (
    <div className="card">
      <img
        src={currentCandidate.avatar_url}
        className="card-img-top"
        alt="Candidate avatar"
        width="300px"
      />
      <div className="card-body">
        <h5 className="card-title">
          {currentCandidate.name} ({currentCandidate.login})
        </h5>
        <div className="card-text">
          <p>Location: {currentCandidate.location || "None"}</p>
          <p>Email: {currentCandidate.email || "None"}</p>
          <p>Company: {currentCandidate.company || "None"}</p>
          <p>Bio: {currentCandidate.bio || "None"}</p>
        </div>
      </div>
      <div className="buttons">
        <button className="rejectCandidate" onClick={rejectCandidate}>
          -
        </button>
        <button className="acceptCandidate" onClick={acceptCandidate}>
          +
        </button>
      </div>
    </div>
  ) : (
    <h1>Searching for candidates...</h1>
  );
};

export default CandidateSearch;
