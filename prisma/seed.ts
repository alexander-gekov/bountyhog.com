import {
  Bounty,
  BountyStatus,
  Company,
  PrismaClient,
  Recruiter,
} from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// Sample data arrays for generating diverse bounties
const companyNames = [
  "TechCorp Solutions",
  "StartupXYZ",
  "InnovateLabs",
  "DataDrive Inc",
  "CloudFirst Technologies",
  "NextGen Software",
  "QuantumLeap AI",
  "CyberShield Security",
  "GreenTech Innovations",
  "FinanceFlow",
  "HealthTech Pro",
  "EduSphere",
  "LogisticsPro",
  "RetailNext",
  "MediaStream",
  "GameDev Studios",
  "RoboticsHub",
  "BioTech Research",
  "EnergyFlow",
  "TravelTech",
  "FoodTech Solutions",
  "PropTech Ventures",
  "SocialConnect",
  "MobilityNext",
  "AgriTech",
  "SpaceTech Corp",
  "WaterTech",
  "CleanEnergy Systems",
  "SmartCity Solutions",
  "VirtualReality Labs",
];

const jobTitles = [
  "Senior Full Stack Developer",
  "DevOps Engineer",
  "Product Manager",
  "Data Scientist",
  "Software Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Mobile Developer",
  "UI/UX Designer",
  "Product Designer",
  "Data Engineer",
  "Machine Learning Engineer",
  "Security Engineer",
  "Cloud Architect",
  "Technical Lead",
  "Engineering Manager",
  "QA Engineer",
  "Site Reliability Engineer",
  "Business Analyst",
  "Scrum Master",
  "Principal Engineer",
  "Staff Engineer",
  "Platform Engineer",
  "Database Administrator",
  "Network Engineer",
  "Systems Administrator",
  "IT Manager",
  "CTO",
  "VP of Engineering",
  "Head of Product",
  "Sales Engineer",
  "Solutions Architect",
  "Infrastructure Engineer",
];

const technologies = [
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "TypeScript",
  "JavaScript",
  "Go",
  "Rust",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Elasticsearch",
  "GraphQL",
  "REST API",
  "Microservices",
  "TensorFlow",
  "PyTorch",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "Django",
  "Flask",
  "Express.js",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",
  "ASP.NET",
  "React Native",
  "Flutter",
  "iOS",
  "Android",
  "Unity",
  "Unreal Engine",
  "Figma",
  "Sketch",
];

const industries = [
  "technology",
  "fintech",
  "healthcare",
  "education",
  "e-commerce",
  "gaming",
  "AI/ML",
  "cybersecurity",
  "renewable energy",
  "transportation",
  "food tech",
  "real estate",
  "social media",
  "mobility",
  "agriculture",
  "aerospace",
  "clean tech",
  "smart cities",
];

const experienceLevels = [
  "1-2 years",
  "2-3 years",
  "3-5 years",
  "5-7 years",
  "7-10 years",
  "10+ years",
];

const benefits = [
  "Remote work flexibility",
  "Health insurance",
  "Dental coverage",
  "Stock options",
  "401k matching",
  "Unlimited PTO",
  "Professional development budget",
  "Home office stipend",
  "Gym membership",
  "Mental health support",
  "Flexible hours",
  "Performance bonuses",
];

// Helper functions
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomDate(daysFromNow: { min: number; max: number }): Date {
  const days = getRandomNumber(daysFromNow.min, daysFromNow.max);
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function generateRandomId(): string {
  return randomUUID();
}

function generateJobDescription(
  title: string,
  company: string,
  techs: string[]
): string {
  const templates = [
    `We are looking for a ${title.toLowerCase()} to join our dynamic team at ${company}. The ideal candidate will have strong experience with ${techs
      .slice(0, 3)
      .join(", ")} and a passion for delivering high-quality solutions.`,
    `${company} is seeking an experienced ${title.toLowerCase()} to help drive our next phase of growth. You'll work with cutting-edge technologies including ${techs
      .slice(0, 4)
      .join(", ")} in a collaborative environment.`,
    `Join ${company} as a ${title.toLowerCase()} and help us build innovative solutions that impact millions of users. We're looking for someone skilled in ${techs
      .slice(0, 3)
      .join(", ")} with a track record of success.`,
    `Are you passionate about ${techs[0]} and ${
      techs[1]
    }? ${company} is looking for a talented ${title.toLowerCase()} to join our engineering team and help shape the future of our products.`,
  ];
  return getRandomElement(templates);
}

async function main() {
  console.log("Starting database seed...");

  // Create diverse company users and profiles
  const companies: Company[] = [];
  for (let i = 0; i < 30; i++) {
    const companyName = companyNames[i];
    const companyEmail = `${companyName
      .toLowerCase()
      .replace(/\s+/g, "")}@example.com`;
    const industry = getRandomElement(industries);

    const companyUser = await prisma.user.upsert({
      where: { email: companyEmail },
      update: {},
      create: {
        id: generateRandomId(),
        email: companyEmail,
        name: companyName,
        userType: "COMPANY",
        emailVerified: true,
      },
    });

    const company = await prisma.company.upsert({
      where: { userId: companyUser.id },
      update: {},
      create: {
        userId: companyUser.id,
        companyName: companyName,
        description: `Innovative ${industry} company focused on delivering cutting-edge solutions and exceptional user experiences.`,
        website: `https://${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
      },
    });

    companies.push(company);
  }

  // Create recruiter users
  const recruiters: Recruiter[] = [];
  for (let i = 0; i < 10; i++) {
    const recruiterUser = await prisma.user.upsert({
      where: { email: `recruiter${i + 1}@example.com` },
      update: {},
      create: {
        id: generateRandomId(),
        email: `recruiter${i + 1}@example.com`,
        name: `Recruiter ${i + 1}`,
        userType: "RECRUITER",
        emailVerified: true,
      },
    });

    const recruiter = await prisma.recruiter.upsert({
      where: { userId: recruiterUser.id },
      update: {},
      create: {
        userId: recruiterUser.id,
        bio: `Experienced tech recruiter with ${getRandomNumber(
          3,
          12
        )}+ years in the industry.`,
        experience: `${getRandomNumber(3, 12)} years`,
        specialties: getRandomElements(technologies, 5).join(", "),
      },
    });

    recruiters.push(recruiter);
  }

  // Generate 120 bounties to ensure we have at least 100
  console.log("Creating bounties...");
  const bounties: Bounty[] = [];

  for (let i = 0; i < 120; i++) {
    const company = getRandomElement(companies);
    const title = getRandomElement(jobTitles);
    const techStack = getRandomElements(technologies, getRandomNumber(3, 8));
    const isPercentage = Math.random() < 0.3; // 30% chance for percentage payout
    const status = getRandomElement([
      "OPEN",
      "OPEN",
      "OPEN",
      "OPEN",
      "IN_PROGRESS",
      "COMPLETED",
    ]);
    const hasDeadline = Math.random() < 0.7; // 70% chance to have deadline

    const bounty = await prisma.bounty.create({
      data: {
        title: title,
        description: generateJobDescription(
          title,
          company.companyName,
          techStack
        ),
        companyId: company.id,
        payoutType: isPercentage ? "PERCENTAGE" : "CASH",
        payoutAmount: isPercentage ? null : getRandomNumber(2000, 15000),
        payoutPercentage: isPercentage ? getRandomNumber(10, 25) : null,
        guaranteeTimeframe: getRandomElement(["ONE_MONTH", "TWO_MONTHS"]),
        deadline: hasDeadline ? generateRandomDate({ min: 7, max: 90 }) : null,
        requirements: JSON.stringify([
          `${getRandomElement(experienceLevels)} experience`,
          ...getRandomElements(techStack, Math.min(techStack.length, 4)),
          getRandomElement([
            "Bachelor's degree preferred",
            "Strong problem-solving skills",
            "Excellent communication skills",
          ]),
          getRandomElement([
            "Team player",
            "Self-motivated",
            "Detail-oriented",
          ]),
        ]),
        interviewProcess: getRandomElement([
          "3 rounds: Technical screening, System design, Cultural fit",
          "2 rounds: Technical assessment, Team interview",
          "4 rounds: HR screening, Technical deep-dive, Manager interview, Final round",
          "3 rounds: Coding challenge, Technical discussion, Team fit",
        ]),
        guidelines: getRandomElement([
          "Please ensure candidates have strong communication skills and can work in a remote environment.",
          "Looking for someone who can start immediately and has experience with agile methodologies.",
          "Candidates should have experience working in fast-paced startup environments.",
          "We prefer candidates with a passion for continuous learning and innovation.",
        ]),
        picture: null,
        status: status as BountyStatus,
        createdAt: new Date(
          Date.now() - getRandomNumber(0, 30) * 24 * 60 * 60 * 1000
        ), // Random creation time within last 30 days
      },
    });

    bounties.push(bounty);

    // Randomly create collaborations for some bounties
    if (Math.random() < 0.4 && status === "OPEN") {
      // 40% chance for open bounties
      const numCollaborations = getRandomNumber(1, 3);
      const selectedRecruiters = getRandomElements(
        recruiters,
        numCollaborations
      );

      for (const recruiter of selectedRecruiters) {
        await prisma.recruiterCollaboration.create({
          data: {
            bountyId: bounty.id,
            recruiterId: recruiter.id,
            isUnlocked: Math.random() < 0.6, // 60% chance to be unlocked
            message: getRandomElement([
              "I'm very interested in working on this position and have several qualified candidates in my network.",
              "This role aligns perfectly with my expertise. I'd love to collaborate on finding the right candidate.",
              "I have experience placing similar roles and would like to partner with you on this opportunity.",
              "Great opportunity! I have some excellent candidates that might be a perfect fit.",
            ]),
          },
        });
      }
    }

    if (i > 0 && i % 20 === 0) {
      console.log(`Created ${i} bounties...`);
    }
  }

  console.log(`Successfully created ${bounties.length} bounties!`);
  console.log(`Created ${companies.length} companies`);
  console.log(`Created ${recruiters.length} recruiters`);
  console.log("Seed data created successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
