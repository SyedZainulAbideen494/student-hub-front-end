import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaArrowLeft, FaAtom, FaBolt, FaBookOpen, FaBrain, FaCalculator, FaChalkboardTeacher, FaChartLine, FaCheckCircle, FaClipboardCheck, FaClipboardList, FaClock, FaDna, FaDownload, FaExclamationTriangle, FaFlask, FaGraduationCap, FaMicroscope, FaProjectDiagram, FaRegCalendarAlt, FaSearch, FaSyncAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../../app_modules/apiRoutes";
import axios from "axios";
import './neetGudie.css'

const GuideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw; /* Full viewport width */
  min-height: 100vh;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  background: linear-gradient(to bottom, #fafbfc, #ebedf0); /* Softer, aesthetic gradient */
  font-family: "SF Pro Display", sans-serif;
  padding: 24px;
  box-sizing: border-box;
`;

/* Glassmorphic Card Design */
const Page = styled(motion.div)`
  width: 90%;
  max-width: 650px;
  background: rgba(255, 255, 255, 0.6); /* Soft Glassmorphic Effect */
  backdrop-filter: blur(10px);
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0px 10px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2); /* Soft border for a refined look */
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left; /* Align text to the left */
  transition: transform 0.3s ease-in-out;
  
  &:hover {
    transform: translateY(-4px); /* Slight hover lift for an interactive feel */
  }
`;

/* Elegant Title */
const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #1c1c1e;
  text-align: center;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
`;

/* Aesthetic Subtitle with Apple-Like Color */
const Subtitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #007aff; /* Apple’s signature blue */
  text-align: center;
  margin-bottom: 12px;
`;

/* Sleek Text Content */
const Content = styled.p`
  font-size: 17px;
  color: #3a3a3c;
  line-height: 1.7;
  width: 100%;
  font-weight: 500;
  letter-spacing: -0.3px;
  word-spacing: 1px;
`;

/* Subtle Divider */
const Divider = styled.hr`
  width: 80%;
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 16px 0;
`;

/* Header Container */
const Header = styled.header`
  width: 100%;
  max-width: 700px;
  text-align: center;
  padding: 32px 0;
  position: relative; /* Allows positioning of the back button */
`;

/* Back Button */
const BackButton = styled.button`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #007aff; /* Apple’s signature blue */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;


/* Main Title */
const GuideTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #1c1c1e;
  letter-spacing: -0.6px;
  margin-bottom: 8px;
`;

/* Elegant Subtitle */
const GuideSubtitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #007aff;
  opacity: 0.85;
  letter-spacing: -0.4px;
  margin-bottom: 16px;
`;

/* Aesthetic Line */
const HeaderLine = styled.div`
  width: 60px;
  height: 4px;
  background: #007aff;
  border-radius: 2px;
  margin: 0 auto 24px;
`;



const NeetGuide = () => {
    const StyledWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  
    .button {
      position: relative;
      width: 140px;
      height: 44px;
      background: linear-gradient(135deg, #222 10%, #333 90%);
      color: #fff;
      font-size: 15px;
      font-weight: 500;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      display: flex;
      justify-content: center;
      align-items: center;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  
    .button:hover {
      transform: translateY(-2px);
      background: linear-gradient(135deg, #1a1a1a 10%, #444 90%);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }
  
    .button:active {
      transform: translateY(1px);
      background: linear-gradient(135deg, #111 10%, #222 90%);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
      
  `;
  
  const DownloadSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #1e1e1e;
  border-radius: 10px;
  text-align: center;
`;

const DownloadButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #00dbde;
  color: white;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  margin-top: 12px;
  font-size: 16px;
  
  svg {
    margin-right: 8px;
  }

  &:hover {
    background: #00b3b7;
  }
`;

    const nav = useNavigate()
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [error, setError] = useState(null);
 const [isPremium, setIsPremium] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
            .then(response => setIsPremium(response.data.premium))
            .catch(() => setIsPremium(false));
        } else {
          setIsPremium(false);
        }
      }, []);
    

    const generateQuizFromNotes = async (e) => {
        e.preventDefault();
        setLoadingQuiz(true);
        setError(null);
        
        // Navigate to loading page
        nav("/loading/mock-exam");
        
  // Extracting full content from the page
  const fullContent = `
  SECTION 2: MOST IMPORTANT QUESTIONS (2015-2024)
  Biology – Frequently Asked Questions
  • How does the SA node regulate the heartbeat? (NEET 2015, 2017, 2020, 2023)
  The sinoatrial (SA) node, located in the right atrium, is the heart’s natural pacemaker. It generates electrical impulses that spread through the atria, causing contraction. These impulses then reach the atrioventricular (AV) node, travel down the Bundle of His, and stimulate the ventricles. The SA node sets the rhythm of the heartbeat, controlled by autonomic nerves.
  
  • What is the function of HCl in the stomach? (NEET 2016, 2019, 2022)
  Hydrochloric acid (HCl) in the stomach serves multiple functions:
  
  It activates pepsinogen into pepsin, which digests proteins.
  It provides an acidic environment (pH ~1.5-3.5) for enzymatic activity.
  It kills harmful bacteria and prevents infections.
  It facilitates the breakdown of food and absorption of certain nutrients.
  • Compare innate and acquired immunity. (NEET 2017, 2018, 2021)
  
  Innate immunity is non-specific and present from birth, providing the first line of defense (e.g., skin, mucous membranes, phagocytes).
  Acquired immunity is specific and develops after exposure to pathogens, involving antibodies and memory cells. Acquired immunity can be:
  Active (via vaccination or infection)
  Passive (transfer of antibodies from mother to child)
  • What is the role of tRNA in protein synthesis? (NEET 2015, 2018, 2020)
  Transfer RNA (tRNA) acts as an adapter molecule in translation. It carries specific amino acids to the ribosome, matching its anticodon with the codon on mRNA. This ensures the correct sequence of amino acids in the growing polypeptide chain. Each tRNA has an aminoacyl-tRNA synthetase that charges it with the appropriate amino acid.
  
  • Describe the PCR process in biotechnology. (NEET 2016, 2019, 2022, 2024)
  Polymerase Chain Reaction (PCR) is a technique used to amplify DNA sequences. Steps:
  
  Denaturation (~95°C): DNA strands separate.
  Annealing (~50-65°C): Primers bind to complementary DNA sequences.
  Extension (~72°C): Taq polymerase synthesizes new DNA strands.
  This cycle is repeated multiple times, exponentially increasing the DNA amount.
  Chemistry – Frequently Asked Questions
  • Explain the concept of Gibbs Free Energy. (NEET 2015, 2018, 2020, 2023)
  Gibbs Free Energy (G) determines the spontaneity of a reaction using the equation:
  ΔG = ΔH - TΔS
  
  If ΔG < 0, the reaction is spontaneous.
  If ΔG > 0, the reaction is non-spontaneous.
  If ΔG = 0, the system is at equilibrium.
  Temperature and entropy changes influence Gibbs energy.
  • Derive the Nernst Equation for electrochemical cells. (NEET 2016, 2019, 2022)
  The Nernst equation calculates cell potential under non-standard conditions:
  E = E° - (0.0591/n) log [Products]/[Reactants]
  Where:
  
  E = Cell potential
  E° = Standard cell potential
  n = Number of electrons transferred
  [ ] = Concentrations of species involved
  This equation accounts for ion concentration changes affecting electrochemical reactions.
  • Compare SN1 and SN2 reaction mechanisms. (NEET 2017, 2019, 2021, 2024)
  
  SN1 (Unimolecular Nucleophilic Substitution):
  Occurs in two steps via carbocation intermediate.
  Rate depends only on the substrate.
  Favored in tertiary alkyl halides.
  SN2 (Bimolecular Nucleophilic Substitution):
  Occurs in one step via backside attack.
  Rate depends on both substrate and nucleophile.
  Favored in primary alkyl halides.
  • What is the hybridization of SF₆ and PCl₅? (NEET 2015, 2018, 2020, 2023)
  
  SF₆ (Sulfur hexafluoride): Undergoes sp³d² hybridization, forming an octahedral structure.
  PCl₅ (Phosphorus pentachloride): Undergoes sp³d hybridization, forming a trigonal bipyramidal structure.
  • Explain Aldol Condensation with an example. (NEET 2016, 2019, 2022)
  Aldol condensation involves the formation of β-hydroxy aldehyde or ketone from an enolate ion and carbonyl compounds.
  Example: Acetaldehyde undergoes aldol condensation to form 3-hydroxybutanal, which dehydrates to crotonaldehyde.
  
  Physics – Frequently Asked Questions
  • Derive KE = ½ mv² using the Work-Energy Theorem. (NEET 2015, 2018, 2020, 2023)
  The work-energy theorem states that work done on an object equals its change in kinetic energy:
  W = ΔKE = KE₂ - KE₁
  Since initial KE is zero (at rest):
  W = ½ mv² - 0
  ⇒ KE = ½ mv²
  
  • How do capacitors behave in series and parallel? (NEET 2016, 2019, 2022)
  
  Series: 
  1
  𝐶
  eq
  =
  1
  𝐶
  1
  +
  1
  𝐶
  2
  +
  .
  .
  .
  C 
  eq
  ​
   
  1
  ​
   = 
  C 
  1
  ​
   
  1
  ​
   + 
  C 
  2
  ​
   
  1
  ​
   +...
  Parallel: 
  𝐶
  eq
  =
  𝐶
  1
  +
  𝐶
  2
  +
  .
  .
  .
  C 
  eq
  ​
   =C 
  1
  ​
   +C 
  2
  ​
   +...
  • State and explain Lenz’s Law. (NEET 2017, 2019, 2021, 2024)
  Lenz's Law states that an induced current always opposes the change in magnetic flux. It ensures conservation of energy in electromagnetic induction.
  
  • Derive Young’s Double-Slit Equation. (NEET 2015, 2018, 2020, 2023)
  
  Path difference: 
  Δ
  𝑥
  =
  𝑑
  sin
  ⁡
  𝜃
  Δx=dsinθ
  Constructive interference: 
  Δ
  𝑥
  =
  𝑛
  𝜆
  Δx=nλ
  Destructive interference: 
  Δ
  𝑥
  =
  (
  𝑛
  +
  ½
  )
  𝜆
  Δx=(n+½)λ
  • Calculate stopping potential in the photoelectric effect. (NEET 2016, 2019, 2022)
  Stopping potential (
  𝑉
  0
  V 
  0
  ​
   ) is calculated using Einstein’s photoelectric equation:
  eV₀ = hf - Φ
  Where:
  
  e = Charge of an electron
  h = Planck’s constant
  f = Frequency of light
  Φ = Work function of metal
          `;
        const subject = "NEET Important Questions (2015-2024)"; 
    
        if (!fullContent || !subject) {
            alert("Please provide notes content and subject before generating the quiz.");
            setLoadingQuiz(false);
            return;
        }
    
        const token = localStorage.getItem("token");
    
        const formData = new FormData();
        formData.append("notes", fullContent);
        formData.append("subject", subject);
        formData.append("token", token);
    
        try {
            const response = await fetch(API_ROUTES.generateQuizfromneetGuide, {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error("Failed to generate quiz from notes, please try again.");
            }
    
            const data = await response.json();
            
            // Navigate to the quiz page when done
            nav(`/quiz/${data.quizId}`);
        } catch (err) {
            console.error("Error:", err);
            setError(err.message);
            setLoadingQuiz(false);
            
            // Optionally, navigate back if there's an error
            nav(-1); 
        }
    };

    const handleGenerateQuiz = async (subject, topic) => {
        setLoadingQuiz(true);
        setError(null);
    
        // Navigate to a "loading" page before making the API call
        nav(`/loading/mock-exam?subject=${subject}&topic=${topic}`);
    
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(API_ROUTES.generateAiQuiz, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, topic, token }),
            });
    
            if (!response.ok) throw new Error('Failed to generate quiz, please try again');
    
            const data = await response.json();
            
            // Redirect to the final quiz page once generated
            nav(`/quiz/${data.quizId}`);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
            nav('/quiz/error');  // Redirect to an error page
        } finally {
            setLoadingQuiz(false);
        }
    };
    
    
    const onBack = () => {
    nav('/')
    }
  return (
    <GuideContainer>
        <Header>
      <BackButton onClick={onBack}>
        <FaArrowLeft /> 
      </BackButton>
    </Header>

    <Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>NEET Most Repeated Questions Guide (2015-2024)</Title>
  <Subtitle>A Data-Driven Strategy to Maximize Your NEET Score</Subtitle>
  
  <Content>
    <p>
      Struggling with NEET prep? <strong>Stop wasting time on low-yield topics.</strong>  
      This guide helps you focus on <strong>high-weightage areas</strong> and <strong>master NEET’s  
      most frequently asked questions</strong> to maximize your score.
    </p>

    <h2><i class="fas fa-book-open"></i> What's Inside?</h2>
    <ul className="guide-list">
      <li><strong>Most Repeated Questions (2015-2024)</strong> – A deep dive into NEET's question trends.</li>
      <li><strong>High-Yield Chapters & Topics</strong> – Focus on what actually matters in the exam.</li>
      <li><strong>Exam-Smart Strategies</strong> – Learn expert-backed techniques to boost accuracy.</li>
      <li><strong>Time-Saving Problem-Solving Methods</strong> – Solve faster, with fewer mistakes.</li>
      <li><strong>AI-Powered Quiz Generator</strong> – Instantly test your knowledge with smart quizzes.</li>
    </ul>

    <h2><i class="fas fa-bolt"></i> Why This Guide?</h2>
    <ul className="benefits-list">
      <li><strong>Score Higher in Less Time</strong> – Focus only on the most important concepts.</li>
      <li><strong>Data-Driven Insights</strong> – Based on 10 years of NEET paper analysis.</li>
      <li><strong>Interactive Learning</strong> – AI-generated quizzes for every topic.</li>
      <li><strong>Proven Exam Strategies</strong> – Techniques used by NEET toppers.</li>
    </ul>

    
   
  </Content>
</Page>


    {isPremium ? (
<>
    
{/* Page 2 */}
<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 1: MOST IMPORTANT TOPICS FOR NEET 2025</Title>
  <Content>
    These topics have been frequently asked in past NEET papers and carry the highest weightage. Mastering them provides a significant advantage in the exam.
    <br /><br />

    <strong>Biology – Key Topics (50% Weightage)</strong> <br />
    <strong>Human Physiology (20-25 Questions)</strong> <br />
    • Digestive System: Enzymes & HCl function <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Biology", "Digestive System")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Nervous System: Synapse transmission, Reflex arc <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Biology", "Nervous System")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Endocrine System: Hormones & Feedback Mechanisms <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Biology", "Endocrine System")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Circulatory System: SA Node, AV Node, Cardiac cycle <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Biology", "Circulatory System")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Excretory System: Nephron structure, Countercurrent mechanism <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Biology", "Excretory System")}>Generate Quiz</button>
    </StyledWrapper> <br /><br />

    <strong>Genetics & Evolution (12-15 Questions)</strong> <br />
    • Mendelian Genetics: Monohybrid & Dihybrid Cross <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Biology", "Mendelian Genetics")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • DNA Replication & Transcription (Enzymes involved) <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Biology", "DNA Replication & Transcription")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Hardy-Weinberg Principle & Evolutionary Factors <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Biology", "Hardy-Weinberg Principle")}>Generate Quiz</button>
    </StyledWrapper> <br /><br />

    <strong>Ecology & Environment (10-12 Questions)</strong> <br />
    • Biogeochemical Cycles (Carbon, Nitrogen) <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Biology", "Biogeochemical Cycles")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Biodiversity Conservation & Ozone Depletion <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Biology", "Biodiversity Conservation")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Eutrophication & Biological Magnification <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Biology", "Eutrophication")}>Generate Quiz</button>
    </StyledWrapper> <br /><br />

    <strong>Chemistry – Key Topics (30% Weightage)</strong> <br />
    <strong>Physical Chemistry (10-12 Questions)</strong> <br />
    • Thermodynamics: Gibbs Free Energy & Entropy <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Chemistry", "Thermodynamics")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Electrochemistry: Nernst Equation & EMF of Cells <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Chemistry", "Electrochemistry")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Chemical Kinetics: First-Order Reactions & Half-Life Formula <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Chemistry", "Chemical Kinetics")}>Generate Quiz</button>
    </StyledWrapper> <br /><br />

    <strong>Organic Chemistry (10-15 Questions)</strong> <br />
    • General Organic Chemistry: Inductive, Resonance, Hyperconjugation <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Chemistry", "General Organic Chemistry")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Name Reactions: Aldol Condensation, Cannizzaro, Perkin Reaction <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Chemistry", "Name Reactions")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Alcohols & Phenols: Lucas Test, Reactions of Phenols <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Chemistry", "Alcohols & Phenols")}>Generate Quiz</button>
    </StyledWrapper> <br /><br />

    <strong>Physics – Key Topics (20% Weightage)</strong> <br />
    <strong>Mechanics (8-10 Questions)</strong> <br />
    • Work, Energy & Power: Work-Energy Theorem <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Physics", "Work, Energy & Power")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Rotational Motion: Torque & Moment of Inertia <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Physics", "Rotational Motion")}>Generate Quiz</button>
    </StyledWrapper> <br /><br />

    <strong>Electrodynamics (10-12 Questions)</strong> <br />
    • Electrostatics: Coulomb’s Law & Capacitance <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Physics", "Electrostatics")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Current Electricity: Wheatstone Bridge, Ohm’s Law <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Physics", "Current Electricity")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Magnetism: Moving Charges in Magnetic Field <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Physics", "Magnetism")}>Generate Quiz</button>
    </StyledWrapper> <br /><br />

    <strong>Modern Physics & Optics (12-15 Questions)</strong> <br />
    • Photoelectric Effect & de Broglie’s Wavelength <br/>
    <StyledWrapper>
      <button  className="button" onClick={() => handleGenerateQuiz("Physics", "Photoelectric Effect")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Ray Optics: Mirror & Lens Formula <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Physics", "Ray Optics")}>Generate Quiz</button>
    </StyledWrapper> <br />

    • Wave Optics: Young’s Double-Slit Experiment <br/>
    <StyledWrapper>
      <button className="button" onClick={() => handleGenerateQuiz("Physics", "Wave Optics")}>Generate Quiz</button>
    </StyledWrapper> <br />

  </Content>
</Page>



{/* Page 3 */}
<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 2: MOST IMPORTANT QUESTIONS (2015-2024)</Title>
  <Content>
    <strong>Biology – Frequently Asked Questions</strong> <br />

    <strong>• How does the SA node regulate the heartbeat?</strong> <i>(NEET 2015, 2017, 2020, 2023)</i> <br />
    <p>The sinoatrial (SA) node, located in the right atrium, is the heart’s natural pacemaker. It generates electrical impulses that spread through the atria, causing contraction. These impulses then reach the atrioventricular (AV) node, travel down the Bundle of His, and stimulate the ventricles. The SA node sets the rhythm of the heartbeat, controlled by autonomic nerves.</p> <br />

    <strong>• What is the function of HCl in the stomach?</strong> <i>(NEET 2016, 2019, 2022)</i> <br />
    <p>Hydrochloric acid (HCl) in the stomach serves multiple functions: (1) It activates pepsinogen into pepsin, which digests proteins. (2) It provides an acidic environment (pH ~1.5-3.5) for enzymatic activity. (3) It kills harmful bacteria and prevents infections. (4) It facilitates the breakdown of food and absorption of certain nutrients.</p> <br />

    <strong>• Compare innate and acquired immunity.</strong> <i>(NEET 2017, 2018, 2021)</i> <br />
    <p>Innate immunity is non-specific and present from birth, providing the first line of defense (e.g., skin, mucous membranes, phagocytes). Acquired immunity is specific and develops after exposure to pathogens, involving antibodies and memory cells. Acquired immunity can be active (via vaccination or infection) or passive (transfer of antibodies from mother to child).</p> <br />

    <strong>• What is the role of tRNA in protein synthesis?</strong> <i>(NEET 2015, 2018, 2020)</i> <br />
    <p>Transfer RNA (tRNA) acts as an adapter molecule in translation. It carries specific amino acids to the ribosome, matching its anticodon with the codon on mRNA. This ensures the correct sequence of amino acids in the growing polypeptide chain. Each tRNA has an aminoacyl-tRNA synthetase that charges it with the appropriate amino acid.</p> <br />

    <strong>• Describe the PCR process in biotechnology.</strong> <i>(NEET 2016, 2019, 2022, 2024)</i> <br />
    <p>Polymerase Chain Reaction (PCR) is a technique used to amplify DNA sequences. Steps: (1) Denaturation (~95°C) - DNA strands separate. (2) Annealing (~50-65°C) - Primers bind to complementary DNA sequences. (3) Extension (~72°C) - Taq polymerase synthesizes new DNA strands. This cycle is repeated multiple times, exponentially increasing the DNA amount.</p> <br />

    <strong>Chemistry – Frequently Asked Questions</strong> <br />

    <strong>• Explain the concept of Gibbs Free Energy.</strong> <i>(NEET 2015, 2018, 2020, 2023)</i> <br />
    <p>
  Gibbs Free Energy (G) determines the spontaneity of a reaction using the equation 
  ΔG = ΔH - TΔS. If ΔG {"<"} 0, the reaction is spontaneous. If ΔG {">"} 0, the 
  reaction is non-spontaneous. If ΔG = 0, the system is at equilibrium. Temperature 
  and entropy changes influence Gibbs energy.
</p>

    <strong>• Derive the Nernst Equation for electrochemical cells.</strong> <i>(NEET 2016, 2019, 2022)</i> <br />
    <p>The Nernst equation calculates cell potential under non-standard conditions:  
    E = E° - (0.0591/n) log [Products]/[Reactants].  
    Where:  
    - E = Cell potential  
    - E° = Standard cell potential  
    - n = Number of electrons transferred  
    - [ ] = Concentrations of species involved  
    This equation accounts for ion concentration changes affecting electrochemical reactions.</p> <br />

    <strong>• Compare SN1 and SN2 reaction mechanisms.</strong> <i>(NEET 2017, 2019, 2021, 2024)</i> <br />
    <p>SN1 (Unimolecular Nucleophilic Substitution):  
    - Occurs in two steps via carbocation intermediate.  
    - Rate depends only on the substrate.  
    - Favored in tertiary alkyl halides.  

    SN2 (Bimolecular Nucleophilic Substitution):  
    - Occurs in one step via backside attack.  
    - Rate depends on both substrate and nucleophile.  
    - Favored in primary alkyl halides.</p> <br />

    <strong>• What is the hybridization of SF₆ and PCl₅?</strong> <i>(NEET 2015, 2018, 2020, 2023)</i> <br />
    <p>SF₆: Sulfur hexafluoride undergoes sp³d² hybridization, forming an octahedral structure.  
    PCl₅: Phosphorus pentachloride undergoes sp³d hybridization, forming a trigonal bipyramidal structure.</p> <br />

    <strong>• Explain Aldol Condensation with an example.</strong> <i>(NEET 2016, 2019, 2022)</i> <br />
    <p>Aldol condensation involves the formation of β-hydroxy aldehyde or ketone from enolate ion and carbonyl compounds.  
    Example: Acetaldehyde undergoes aldol condensation to form 3-hydroxybutanal, which dehydrates to crotonaldehyde.</p> <br />

    <strong>Physics – Frequently Asked Questions</strong> <br />

    <strong>• Derive KE = ½ mv² using the Work-Energy Theorem.</strong> <i>(NEET 2015, 2018, 2020, 2023)</i> <br />
    <p>The work-energy theorem states that work done on an object equals its change in kinetic energy.  
    W = ΔKE = KE₂ - KE₁  
    Since initial KE is zero (at rest):  
    W = ½ mv² - 0  
    ⇒ KE = ½ mv²</p> <br />

    <strong>• How do capacitors behave in series and parallel?</strong> <i>(NEET 2016, 2019, 2022)</i> <br />
    <p>Series: 1/C_eq = 1/C₁ + 1/C₂ + ...  
    Parallel: C_eq = C₁ + C₂ + ...</p> <br />

    <strong>• State and explain Lenz’s Law.</strong> <i>(NEET 2017, 2019, 2021, 2024)</i> <br />
    <p>Lenz's Law states that an induced current always opposes the change in magnetic flux. It ensures conservation of energy in electromagnetic induction.</p> <br />

    <strong>• Derive Young’s Double-Slit Equation.</strong> <i>(NEET 2015, 2018, 2020, 2023)</i> <br />
    <p>Path difference: Δx = d sin θ.  
    Constructive interference: Δx = nλ  
    Destructive interference: Δx = (n + ½)λ</p> <br />

    <strong>• Calculate stopping potential in the photoelectric effect.</strong> <i>(NEET 2016, 2019, 2022)</i> <br />
    <p>Stopping potential (V₀) is calculated using Einstein’s equation:  
    eV₀ = hf - Φ, where  
    e = charge of an electron,  
    h = Planck’s constant,  
    f = frequency of light,  
    Φ = work function of metal.</p> <br />

<StyledWrapper>
      <button className="button" onClick={generateQuizFromNotes}>
      Generate Quiz
      </button>
    </StyledWrapper>
  </Content>
</Page>

{/* Page 4 */}
<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 3: "CONCENTRATE ON" TOPICS</Title>
  <Content>
    <strong>Biology – High-Yield Chapters</strong> <br />
    • Human Physiology: <i>25% of Biology Questions</i> <br />
    • Genetics & Evolution: <i>15% of Biology Questions</i> <br />
    • Biotechnology & Ecology: <i>10-12% of Biology Questions</i> <br /><br />

    <strong>Chemistry – High-Yield Chapters</strong> <br />
    • Organic Reactions: <i>12-15 questions every year</i> <br />
    • Physical Chemistry (Thermodynamics, Electrochemistry, Kinetics): <i>10-12 questions</i> <br />
    • Coordination Compounds & Periodic Trends: <i>8-10 questions</i> <br /><br />

    <strong>Physics – High-Yield Chapters</strong> <br />
    • Electrostatics & Magnetism: <i>10-12 questions</i> <br />
    • Modern Physics & Optics: <i>12-15 questions</i> <br />
    • Mechanics (Work-Energy, Rotational Motion): <i>8-10 questions</i> <br />
  </Content>
</Page>

{/* Page 6 */}
{/* Page 5 */}
<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 5: HIGH-SCORING QUESTION PATTERNS & TRENDS</Title>
  <Content>
    Over the years, NEET papers have followed <strong>consistent question patterns</strong>, making these topics highly predictable for NEET 2025. <br /><br />

    <strong>Biology – Common Question Types</strong> <br />
    • <strong>Match the Following</strong> – (Ecology, Genetics, Physiology) <br />
    • <strong>Statement-Based Questions</strong> – (Biotechnology, Evolution, Immunology) <br />
    • <strong>Assertion & Reasoning</strong> – (Genetics, Ecology, Human Physiology) <br /><br />

    <strong>Chemistry – Common Question Types</strong> <br />
    • <strong>Reaction Mechanisms & Products</strong> – (Organic Chemistry) <br />
    • <strong>Numerical-Based Questions</strong> – (Electrochemistry, Thermodynamics, Chemical Kinetics) <br />
    • <strong>Theoretical Conceptual Questions</strong> – (Periodic Table, Bonding, Coordination Compounds) <br /><br />

    <strong>Physics – Common Question Types</strong> <br />
    • <strong>Conceptual Theory Questions</strong> – (Electrodynamics, Optics, Thermodynamics) <br />
    • <strong>Graph-Based Questions</strong> – (Motion, Wave Optics, Simple Harmonic Motion) <br />
    • <strong>Derivation-Based Questions</strong> – (Modern Physics, Work-Power-Energy, Rotational Motion) <br />
  </Content>
</Page>

<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 6: BEST BOOKS & RESOURCES</Title>
  <Content>
    <p>Choosing the right books is crucial for mastering NEET concepts. Here are the most recommended resources:</p>

    <br />

    <strong><FaBookOpen /> Biology:</strong> <br />
    • <strong>NCERT (Class 11 & 12)</strong> – The ultimate must-have textbook <br />
    • <strong>MTG Objective Biology</strong> – Best for MCQs & in-depth practice <br />

    <br />

    <strong><FaFlask /> Chemistry:</strong> <br />
    • <strong>NCERT (Class 11 & 12)</strong> – The foundation for all concepts <br />
    • <strong>MS Chauhan (Organic Chemistry)</strong> – Best for reaction mechanisms <br />
    • <strong>P Bahadur (Physical Chemistry)</strong> – Excellent for numerical problem-solving <br />

    <br />

    <strong><FaAtom /> Physics:</strong> <br />
    • <strong>NCERT (Class 11 & 12)</strong> – Essential for theory & fundamentals <br />
    • <strong>DC Pandey</strong> – Best for problem-solving & conceptual clarity <br />
    • <strong>HC Verma</strong> – Highly recommended for understanding concepts deeply <br />
  </Content>
</Page>



<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 7: COMMON MISTAKES & HOW TO AVOID THEM</Title>
  <Content>
    <p>Avoiding these common errors can significantly improve your NEET score.</p>

    <br />

    <strong><FaBookOpen /> Not Reading NCERT Carefully</strong>  
    <i>(90% of NEET Biology comes directly from NCERT. Read line by line.)</i>  

    <br /><br />

    <strong><FaExclamationTriangle /> Ignoring Negative Marking Strategy</strong>  
    <i>(Avoid random guessing. Skip high-risk questions instead of making blind attempts.)</i>  

    <br /><br />

    <strong><FaClock /> Time Mismanagement</strong>  
    <i>(Don’t waste too much time on difficult questions. Prioritize scoring easy marks first.)</i>  

    <br /><br />

    <strong><FaCalculator /> Not Practicing Full-Length Tests</strong>  
    <i>(Solve at least 10 full-length NEET papers to build exam stamina and accuracy.)</i>  
  </Content>
</Page>

{/* Page 8 */}
<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 8: TIME-SAVING TRICKS & SHORTCUT METHODS</Title>
  <Content>
    <strong>Biology Tricks</strong> <br />
    • <strong>Photosynthesis Mnemonic:</strong> C4 Cycle = "OAA Takes Place In BS" (OAA → Oxaloacetate, BS → Bundle Sheath) <br />
    • <strong>Genetics Trick:</strong> Monohybrid = 3:1, Dihybrid = 9:3:3:1 (Use Punnett Square for quick solving) <br />
    • <strong>Muscle Contraction Sequence:</strong> "Calcium Activates Myosin Actin" <br /><br />

    <strong>Chemistry Shortcuts</strong> <br />
    • <strong>Hybridization Trick:</strong> Count lone pairs & bonded atoms → 2 = sp, 3 = sp², 4 = sp³, 5 = sp³d, 6 = sp³d² <br />
    • <strong>Electrochemistry Shortcut:</strong> E°cell = E°cathode - E°anode (Just plug in values!) <br />
    • <strong>Organic Chemistry Tip:</strong> Nucleophiles attack electrophiles, not the other way around! <br /><br />

    <strong>Physics Shortcuts</strong> <br />
    • <strong>Newton’s Law Trick:</strong> Use F = ma first, then check energy/work formulas if needed. <br />
    • <strong>Optics Shortcut:</strong> If light moves from denser to rarer medium, total internal reflection occurs. <br />
    • <strong>Photoelectric Effect:</strong> If frequency increases → KE of emitted electrons increases. <br />
  </Content>
</Page>

<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 9: ADVANCED STUDY & MEMORY TECHNIQUES</Title>
  <Content>
    <strong><FaBrain /> Active Recall Method:</strong>  
    <i>Instead of re-reading, write down questions and answer them from memory.</i>  

    <br /><br />

    <strong><FaClock /> Spaced Repetition Technique:</strong>  
    <i>Revise concepts at increasing intervals (1 day, 1 week, 1 month) to reinforce retention.</i>  

    <br /><br />

    <strong><FaChalkboardTeacher /> Feynman Technique:</strong>  
    <i>Teach the concept to yourself in simple words. If you struggle, you need to revise!</i>  
  </Content>
</Page>
<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 10: EXAM-DAY STRATEGY & STRESS MANAGEMENT</Title>
  <Content>
    <strong><FaClock /> 3-Hour Exam Strategy:</strong> <br />
    <FaCheckCircle /> <strong>First 45 mins:</strong> Solve easy questions from Biology & Chemistry. <br />
    <FaCheckCircle /> <strong>Next 60 mins:</strong> Focus on numerical-based Chemistry & Physics. <br />
    <FaCheckCircle /> <strong>Last 45 mins:</strong> Tackle difficult questions + double-check answers. <br />
    
    <br />

    <strong><FaBrain /> Last-Minute Stress Management:</strong> <br />
    <FaCheckCircle /> Avoid studying new topics a day before – revise formulas & key concepts. <br />
    <FaCheckCircle /> Use deep breathing techniques to stay calm before the exam. <br />
    <FaCheckCircle /> Maintain a positive mindset – confidence enhances performance! <br />
  </Content>
</Page>



<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 11: BONUS – LAST 15 DAYS REVISION PLAN</Title>
  <Content>
    <strong><FaRegCalendarAlt /> Day 1-5:</strong> Revise NCERT Biology, solve PYQs, and attempt mock tests. <br />
    <strong><FaFlask /> Day 6-10:</strong> Focus on numerical problems from Chemistry & Physics. <br />
    <strong><FaClipboardCheck /> Day 11-15:</strong> Rapid formula & concept recap + full-length mock papers. <br />
  </Content>
</Page>



<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 12: HOW TO TACKLE TOUGH QUESTIONS WITH CONFIDENCE</Title>
  <Content>
    <strong><FaSearch /> Use the Elimination Method:</strong> Identify and remove incorrect options first. <br />
    <strong><FaSyncAlt /> Apply Reverse Engineering:</strong> Substitute answer choices into the given equation. <br />
    <strong><FaBrain /> Stay Calm:</strong> If stuck, mark the question and return to it later. <br />
  </Content>
</Page>


<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 9: NEET TOPPER INSIGHTS & STUDY ROUTINES</Title>
  <Content>
    <strong><FaBookOpen /> NEET Toppers’ Key Strategies:</strong> <br />
    <strong>Master NCERT:</strong> Treat every line as a potential question. <br />
    <strong>Mock Test Mastery:</strong> Solve at least 10 full-length papers before NEET. <br />
    <strong>Balanced Approach:</strong> Maintain a structured mix of revision, practice, and self-care. <br />
  </Content>
</Page>



{/* Page 14 */}
<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 10: PREDICTING FUTURE QUESTIONS BASED ON TRENDS</Title>
  <Content>
    <strong><FaChartLine /> NEET 2025 Question Trends:</strong> <br />
    <strong><FaMicroscope /> Biology:</strong> Increased Assertion & Reasoning questions. <br />
    <strong><FaFlask /> Chemistry:</strong> More conceptual questions in Physical & Organic Chemistry. <br />
    <strong><FaProjectDiagram /> Physics:</strong> Higher number of graph-based questions. <br />
  </Content>
</Page>



{/* Page 15 */}
<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 11: MARKING SCHEME BREAKDOWN & SUBJECT-WISE STRATEGY</Title>
  <Content>
    <strong><FaDna /> Biology</strong> (50% Weightage, 90 Questions, 360 Marks) – Prioritize NCERT & diagrams. <br />
    <strong><FaFlask /> Chemistry</strong> (30% Weightage, 45 Questions, 180 Marks) – Focus on reactions & numericals. <br />
    <strong><FaCalculator /> Physics</strong> (20% Weightage, 45 Questions, 180 Marks) – Master formulas & problem-solving. <br />
  </Content>
</Page>


<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 12: PRACTICE QUESTIONS WITH STEP-BY-STEP SOLUTIONS</Title>
  <Content>
    <strong><FaDna /> Biology Practice Questions</strong> <br />
    Q1: How do tRNA molecules assist in translation? (Explain with a diagram) <br />
    Q2: What is the role of histones in DNA packaging? <br /><br />

    <strong><FaFlask /> Chemistry Practice Questions</strong> <br />
    Q1: Calculate the EMF of a cell given the following standard electrode potentials… (Step-by-step solution) <br />
    Q2: Explain SN1 and SN2 reactions with examples. <br /><br />

    <strong><FaBolt /> Physics Practice Questions</strong> <br />
    Q1: Derive the lens formula: 1/f = (1/v) - (1/u). (With diagrams) <br />
    Q2: Determine the maximum height in projectile motion for an initial velocity of 30 m/s at 60°. <br />
  </Content>
</Page>




<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>SECTION 13: ULTRA-PREMIUM CHEAT SHEETS FOR QUICK REVISION</Title>
  <Content>
    <strong><FaClipboardList /> Biology Cheat Sheet:</strong> Photosynthesis, Hormones, DNA Replication, Genetic Codes. <br />
    <strong><FaClipboardList /> Chemistry Cheat Sheet:</strong> Organic Reactions, Periodic Trends, Thermodynamics Formulas. <br />
    <strong><FaClipboardList /> Physics Cheat Sheet:</strong> Motion Equations, Optics Formulas, Modern Physics Concepts. <br />
  </Content>
</Page>

<Page 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6 }}
>
  <Title>FINAL WORDS – YOUR NEET RANK IS WAITING FOR YOU!</Title>
  
  <Content>
    <p>
      This <strong>NEET PREMIUM GUIDE</strong> is your ultimate resource to excel in NEET 2025.
    </p>
    
    <p>
      <strong><FaGraduationCap /> Success Formula:</strong> Smart Study + Practice + Revision = Top NEET Rank.
    </p>

    <p>
      <strong>Start NOW.</strong> Your medical college seat is waiting for you!
    </p>
    
  {/*  <DownloadSection>
      <h2>📂 Get All NEET Past Year Papers</h2>
      <p>Download the complete set of NEET Previous Year Question Papers (2015-2024) in one click.</p>

      <a href={API_ROUTES.downloadPdfNeet} download>
  <DownloadButton>
    <FaDownload /> Download Now
  </DownloadButton>
</a>

    </DownloadSection>*/} 
  </Content>
</Page>

    </>
    ) : (
        <div className="premium-upgrade">
        <p className="premium-text">
          Unlock the <strong>full NEET guide</strong> with <strong>AI-powered tools</strong>,  
          high-yield questions, and expert revision strategies.
        </p>
        
        <button className="premium-btn" onClick={() => nav('/subscription')}>
          <span>Get Premium Access</span>  
          <i class="fas fa-lock-open"></i>
        </button>
      
        <p className="limited-offer">Limited-time offer available!</p>
      </div>
      
    )}

    </GuideContainer>
  );
};

export default NeetGuide;
