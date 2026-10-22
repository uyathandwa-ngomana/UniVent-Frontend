import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { register } from "../../api/auth";
import { getHomePathForRole } from "../../context/auth-context";


const FACULTY_DEPARTMENTS = {
  "Applied Sciences": [
    "Biomedical Sciences",
    "Chemistry",
    "Food Technology",
    "Nature Conservation",
    "Physics and Mathematics",
  ],
  "Business and Management Sciences": [
    "Accounting",
    "Finance",
    "Human Resource Management",
    "Logistics",
    "Marketing",
    "Public Administration",
    "Retail Business Management",
    "Tourism and Hospitality Management",
  ],
  "Education": [
    "Adult and Continuing Education",
    "Foundation Phase Teacher Education",
    "Intermediate Phase Teacher Education",
    "Senior Phase and FET Teacher Education",
  ],
  "Engineering and the Built Environment": [
    "Chemical Engineering",
    "Civil Engineering",
    "Construction Management",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Quantity Surveying",
    "Urban and Regional Planning",
  ],
  "Health and Wellness Sciences": [
    "Biomedical Technology",
    "Dental Sciences",
    "Emergency Medical Care",
    "Environmental Health",
    "Nursing",
    "Occupational Therapy",
    "Physiotherapy",
    "Radiography",
  ],
  "Informatics and Design": [
    "Computer Systems Engineering",
    "Design",
    "Fashion",
    "Film and Photographic Studies",
    "Graphic Design",
    "Information Technology",
    "Journalism",
    "Multimedia and Communication Design",
  ],
};

const FACULTIES = Object.keys(FACULTY_DEPARTMENTS);


function Field({ id, label, hint, children }) {
  return (
    <div className="grid gap-2.5">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      {children}
      {hint && (
        <span className="text-sm leading-5 text-gray-500">{hint}</span>
      )}
    </div>
  );
}


const inputClass =
  "h-14 w-full rounded-lg border border-[#dedede] bg-white px-4 text-base text-[#161616] shadow-[0_2px_5px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-[#929292] focus:border-[#087dbb] focus:ring-4 focus:ring-[#087dbb]/20 disabled:cursor-not-allowed disabled:opacity-50";

const selectClass =
  "h-14 w-full rounded-lg border border-[#dedede] bg-white px-4 text-base text-[#161616] shadow-[0_2px_5px_rgba(0,0,0,0.04)] outline-none transition focus:border-[#087dbb] focus:ring-4 focus:ring-[#087dbb]/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50";


export default function RegisterPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (user) {
      navigate(getHomePathForRole(user.role), { replace: true });
    }
  }, [navigate, user]);


  const [role, setRole] = useState("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");


  const [studentNumber, setStudentNumber] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");


  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [contactEmail, setContactEmail] = useState("");

 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setStudentNumber("");
    setFaculty("");
    setDepartment("");
    setYearOfStudy("");
    setOrganizationName("");
    setOrganizationType("");
    setContactEmail("");
    setError("");
  };

  
  const handleFacultyChange = (selectedFaculty) => {
    setFaculty(selectedFaculty);
    setDepartment("");
  };

  
  const validateEmail = (val) =>
    /^[^\s@]+@[^\s@]+\.ac\.za$/.test(val);

  const validatePhone = (val) =>
    /^0[6-8][0-9]{8}$/.test(val.replace(/\s/g, ""));

  const validate = () => {
    if (!name.trim()) return "Full name is required";
    if (!validateEmail(email))
      return "Please use your CPUT email address (e.g. 221234567@mycput.ac.za)";
    if (password.length < 8)
      return "Password must be at least 8 characters";
    if (password !== confirmPassword)
      return "Passwords do not match";
    if (!validatePhone(phoneNumber))
      return "Please enter a valid South African mobile number (e.g. 0821234567)";

    if (role === "STUDENT") {
      if (!studentNumber.trim()) return "Student number is required";
      if (!faculty) return "Please select your faculty";
      if (!department) return "Please select your department";
      if (!yearOfStudy || yearOfStudy < 1 || yearOfStudy > 6)
        return "Year of study must be between 1 and 6";
    }

    if (role === "ORGANIZER") {
      if (!organizationName.trim()) return "Organization name is required";
      if (!organizationType.trim()) return "Organization type is required";
      if (!validateEmail(contactEmail))
        return "Please enter a valid contact email ending in .ac.za";
    }

    return null; // null means no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    
    const payload =
      role === "STUDENT"
        ? {
            name: name.trim(),
            email,
            password,
            phoneNumber: phoneNumber.replace(/\s/g, ""),
            role: "STUDENT",
            studentNumber: studentNumber.trim(),
            faculty,
            department,
            yearOfStudy: parseInt(yearOfStudy, 10),
          }
        : {
            name: name.trim(),
            email,
            password,
            phoneNumber: phoneNumber.replace(/\s/g, ""),
            role: "ORGANIZER",
            organizationName: organizationName.trim(),
            organizationType: organizationType.trim(),
            contactEmail,
          };

    setLoading(true);
    try {
      const authResponse = await register(payload);
      login(authResponse);
      navigate(getHomePathForRole(authResponse.role), { replace: true });
    } catch (err) {
      const message = err.response?.data?.message;
      setError(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const departments = faculty ? FACULTY_DEPARTMENTS[faculty] : [];

  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f8f7] px-5 py-12 font-sans text-[#161616] sm:px-6">
      <section className="w-full max-w-2xl" aria-labelledby="register-title">

        {/* Header */}
        <header className="mb-10 sm:mb-[52px]">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#087dbb]">
            UniVent
          </p>
          <h1
            id="register-title"
            className="text-4xl font-bold leading-tight tracking-[-0.035em] sm:text-[2.5rem]"
          >
            Create an account
          </h1>
          <p className="mt-2.5 text-base leading-6 text-gray-500 sm:text-lg">
            Join UniVent to discover and manage events across CPUT campuses.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-6 sm:gap-7">

          
          <div className="grid gap-2.5">
            <span className="font-semibold">I am a</span>
            <div className="grid grid-cols-2 gap-3">
              {["STUDENT", "ORGANIZER"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`h-14 rounded-lg border text-base font-semibold transition
                    ${
                      role === r
                        ? "border-[#087dbb] bg-[#087dbb] text-white shadow-[0_3px_8px_rgba(8,125,187,0.2)]"
                        : "border-[#dedede] bg-white text-[#161616] hover:border-[#087dbb] hover:text-[#087dbb]"
                    }`}
                >
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          
          <Field id="name" label="Full name">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Samukelo Dlamini"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className={inputClass}
            />
          </Field>

          <Field
            id="email"
            label="CPUT email"
            hint="Use your university email ending in .ac.za"
          >
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="e.g. 221234567@mycput.ac.za"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={inputClass}
            />
          </Field>

          <Field id="phone" label="Mobile number" hint="South African number e.g. 0821234567">
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="e.g. 0821234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
              className={inputClass}
            />
          </Field>

          <Field id="password" label="Password" hint="Minimum 8 characters">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={inputClass}
            />
          </Field>

          <Field id="confirmPassword" label="Confirm password">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className={inputClass}
            />
          </Field>

          
          {role === "STUDENT" && (
            <>
              <Field id="studentNumber" label="Student number">
                <input
                  id="studentNumber"
                  name="studentNumber"
                  type="text"
                  placeholder="e.g. 221234567"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  disabled={loading}
                  className={inputClass}
                />
              </Field>

              <Field id="faculty" label="Faculty">
                <select
                  id="faculty"
                  value={faculty}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  disabled={loading}
                  className={selectClass}
                >
                  <option value="">Select your faculty</option>
                  {FACULTIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="department"
                label="Department"
                hint={!faculty ? "Select a faculty first" : undefined}
              >
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={loading || !faculty}
                  className={selectClass}
                >
                  <option value="">
                    {faculty ? "Select your department" : "Select a faculty first"}
                  </option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="yearOfStudy" label="Year of study">
                <select
                  id="yearOfStudy"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  disabled={loading}
                  className={selectClass}
                >
                  <option value="">Select your year</option>
                  {[1, 2, 3, 4, 5, 6].map((y) => (
                    <option key={y} value={y}>
                      Year {y}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}

          
          {role === "ORGANIZER" && (
            <>
              <Field
                id="organizationName"
                label="Organization name"
                hint="e.g. CPUT Computer Science Society"
              >
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  placeholder="e.g. CPUT Computer Science Society"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  disabled={loading}
                  className={inputClass}
                />
              </Field>

              <Field
                id="organizationType"
                label="Organization type"
                hint="e.g. Student Society, Department, Sports Club"
              >
                <select
                  id="organizationType"
                  value={organizationType}
                  onChange={(e) => setOrganizationType(e.target.value)}
                  disabled={loading}
                  className={selectClass}
                >
                  <option value="">Select organization type</option>
                  {[
                    "Student Society",
                    "Department",
                    "Sports Club",
                    "Academic Club",
                    "Cultural Organization",
                    "Other",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="contactEmail"
                label="Organization contact email"
                hint="The public email students can use to reach your organization"
              >
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  autoComplete="email"
                  placeholder="e.g. cssociety@mycput.ac.za"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  disabled={loading}
                  className={inputClass}
                />
              </Field>
            </>
          )}

          
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span className="mt-0.5 shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          
          <button
            type="submit"
            disabled={loading}
            className="mt-1 min-h-[58px] w-full rounded-lg bg-[#087dbb] text-base font-bold text-white shadow-[0_3px_8px_rgba(8,125,187,0.2)] transition hover:bg-[#066a9f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#087dbb]/20 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        
        <p className="mt-9 text-base text-gray-600 sm:mt-11">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#087dbb] hover:text-[#066a9f] hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#087dbb]/20"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
