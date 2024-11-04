import { useState, useEffect } from "react";
import { searchGithub, searchGithubUser } from "../api/API";
import Candidate from "../interfaces/Candidate.interface";
import { CgLayoutGrid } from "react-icons/cg";

const CandidateSearch = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate>({
    login: "",
    name: "",
    location: "",
    email: "",
    company: "",
    bio: "",
    avatar_url: "",
    html_url: "",
  });

  const [potentialCandidates, setPotentialCandidates] = useState<Candidate[]>(
    []
  );

  const fetchCandidates = async () => {
    try {
      // get the initial list of users
      const data = await searchGithub();
      const candidateLogins: string[] = data.map((user: any) => user.login);

      const candidateData: Candidate[] = [];

      // fetch individual users and push to candidateData array
      for (const login of candidateLogins) {
        const user = await searchGithubUser(login);
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

      // set array of potential candidates
      setPotentialCandidates(candidateData);

      // set initial current candidate
      setCurrentCandidate(potentialCandidates[0]);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    }
  };

  const acceptCandidate = () => {
    // add candidate to local storage of saved candidates
    let parsedSavedCandidates: Candidate[] = [];
    const storedSavedCandidates = localStorage.getItem("savedCandidates");
    if (typeof storedSavedCandidates === "string") {
      parsedSavedCandidates = JSON.parse(storedSavedCandidates);
    }
    parsedSavedCandidates.push(currentCandidate);
    localStorage.setItem(
      "savedCandidates",
      JSON.stringify(parsedSavedCandidates)
    );

    // move to next candidate
    nextCandidate();
  };

  const rejectCandidate = () => {
    // move to next candidate
    nextCandidate();
  };

  const nextCandidate = () => {
    // remove current candidate from the array of potential candidates
    setPotentialCandidates(
      potentialCandidates.splice(
        potentialCandidates.indexOf(currentCandidate),
        1
      )
    );

    // move on to next candidate
    setCurrentCandidate(potentialCandidates[0]);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const addToSavedCandidates = () => {
    let parsedCandidates: Candidate[] = [];
    const storedCandidates = localStorage.getItem("filmsToWatch");
    if (typeof storedCandidates === "string") {
      parsedCandidates = JSON.parse(storedCandidates);
    }
    parsedCandidates.push(currentCandidate);
    localStorage.setItem("savedCandidates", JSON.stringify(parsedCandidates));
  };

  return (
    <div className="card">
      <img src={currentCandidate.avatar_url} className="card-img-top" />
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
  );
};

export default CandidateSearch;
