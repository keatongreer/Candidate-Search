// Create an interface for the Candidate objects returned by the API
export default interface Candidate {
  login: string;
  name: string | null;
  location: string | null;
  email: string | null;
  company: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
}
