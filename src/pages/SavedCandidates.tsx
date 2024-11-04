import Candidate from "../interfaces/Candidate.interface";
import { useState, useEffect } from "react";

const SavedCandidates = () => {
  const [parsedSavedCandidates, setParsedSavedCandidates] = useState<
    Candidate[]
  >([]);

  useEffect(() => {
    const storedSavedCandidates = localStorage.getItem("savedCandidates");
    if (typeof storedSavedCandidates === "string") {
      setParsedSavedCandidates(JSON.parse(storedSavedCandidates));
    }
  }, []);

  const rejectCandidate = (candidateLogin: string) => {
    // Remove candidate at candidateIndex
    const updatedCandidates = parsedSavedCandidates.filter(
      (candidate) => candidate.login !== candidateLogin
    );

    // Update localStorage with modified list
    localStorage.setItem("savedCandidates", JSON.stringify(updatedCandidates));

    setParsedSavedCandidates(updatedCandidates);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Location</th>
          <th>Email</th>
          <th>Company</th>
          <th>Bio</th>
          <th>Reject</th>
        </tr>
      </thead>
      <tbody>
        {parsedSavedCandidates.map((candidate) => (
          <tr key={candidate.login}>
            <td>
              <img
                src={candidate.avatar_url}
                alt={`${candidate.name}'s avatar`}
              />
            </td>
            <td>{candidate.name}</td>
            <td>{candidate.location}</td>
            <td>{candidate.email}</td>
            <td>{candidate.company}</td>
            <td>{candidate.bio}</td>
            <td>
              <button
                className="rejectCandidate"
                onClick={() => rejectCandidate(candidate.login)}
              >
                -
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SavedCandidates;
