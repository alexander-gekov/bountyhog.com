import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const companyUser1 = await prisma.user.upsert({
    where: { email: 'company1@example.com' },
    update: {},
    create: {
      id: 'company1',
      email: 'company1@example.com',
      name: 'TechCorp Solutions',
      userType: 'COMPANY',
      emailVerified: true,
    },
  })

  const companyUser2 = await prisma.user.upsert({
    where: { email: 'company2@example.com' },
    update: {},
    create: {
      id: 'company2',
      email: 'company2@example.com',
      name: 'StartupXYZ',
      userType: 'COMPANY',
      emailVerified: true,
    },
  })

  const recruiterUser1 = await prisma.user.upsert({
    where: { email: 'recruiter1@example.com' },
    update: {},
    create: {
      id: 'recruiter1',
      email: 'recruiter1@example.com',
      name: 'Jane Smith',
      userType: 'RECRUITER',
      emailVerified: true,
    },
  })

  // Create company profiles
  const company1 = await prisma.company.upsert({
    where: { userId: companyUser1.id },
    update: {},
    create: {
      userId: companyUser1.id,
      companyName: 'TechCorp Solutions',
      description: 'Leading technology solutions provider specializing in enterprise software.',
      website: 'https://techcorp.example.com',
    },
  })

  const company2 = await prisma.company.upsert({
    where: { userId: companyUser2.id },
    update: {},
    create: {
      userId: companyUser2.id,
      companyName: 'StartupXYZ',
      description: 'Innovative fintech startup revolutionizing digital payments.',
      website: 'https://startupxyz.example.com',
    },
  })

  // Create recruiter profile
  const recruiter1 = await prisma.recruiter.upsert({
    where: { userId: recruiterUser1.id },
    update: {},
    create: {
      userId: recruiterUser1.id,
      bio: 'Experienced tech recruiter with 8+ years in the industry.',
      experience: '8 years',
      specialties: 'Software Engineering, DevOps, Data Science',
    },
  })

  // Create sample bounties
  await prisma.bounty.upsert({
    where: { id: 'bounty1' },
    update: {},
    create: {
      id: 'bounty1',
      title: 'Senior Full Stack Developer',
      description: 'We are looking for a senior full stack developer with expertise in React, Node.js, and TypeScript. The ideal candidate will have 5+ years of experience and strong problem-solving skills.',
      companyId: company1.id,
      payoutType: 'CASH',
      payoutAmount: 5000,
      guaranteeTimeframe: 'TWO_MONTHS',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      requirements: JSON.stringify([
        '5+ years full stack development',
        'React and Node.js expertise',
        'TypeScript proficiency',
        'Experience with cloud platforms'
      ]),
      interviewProcess: '3 rounds: Technical screening, System design, Cultural fit',
      guidelines: 'Please ensure candidates have strong communication skills and can work in a fast-paced environment.',
      status: 'OPEN',
    },
  })

  await prisma.bounty.upsert({
    where: { id: 'bounty2' },
    update: {},
    create: {
      id: 'bounty2',
      title: 'DevOps Engineer',
      description: 'Seeking an experienced DevOps engineer to help scale our infrastructure. Must have experience with AWS, Docker, Kubernetes, and CI/CD pipelines.',
      companyId: company1.id,
      payoutType: 'PERCENTAGE',
      payoutPercentage: 15,
      guaranteeTimeframe: 'ONE_MONTH',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      requirements: JSON.stringify([
        '3+ years DevOps experience',
        'AWS certification preferred',
        'Docker and Kubernetes expertise',
        'CI/CD pipeline experience'
      ]),
      interviewProcess: '2 rounds: Technical deep-dive, Team fit',
      guidelines: 'Looking for someone who can start immediately and has experience with high-traffic applications.',
      status: 'OPEN',
    },
  })

  await prisma.bounty.upsert({
    where: { id: 'bounty3' },
    update: {},
    create: {
      id: 'bounty3',
      title: 'Product Manager',
      description: 'We need a product manager to lead our fintech product development. Experience in financial services and agile methodologies required.',
      companyId: company2.id,
      payoutType: 'CASH',
      payoutAmount: 3500,
      guaranteeTimeframe: 'TWO_MONTHS',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      requirements: JSON.stringify([
        '4+ years product management',
        'Fintech experience',
        'Agile/Scrum expertise',
        'Strong analytical skills'
      ]),
      interviewProcess: '4 rounds: Product case study, Strategy discussion, Stakeholder interview, Final round',
      guidelines: 'Candidates should have experience launching financial products and working with regulatory requirements.',
      status: 'OPEN',
    },
  })

  await prisma.bounty.upsert({
    where: { id: 'bounty4' },
    update: {},
    create: {
      id: 'bounty4',
      title: 'Data Scientist',
      description: 'Looking for a data scientist to join our AI/ML team. Experience with Python, machine learning frameworks, and statistical analysis required.',
      companyId: company2.id,
      payoutType: 'CASH',
      payoutAmount: 4200,
      guaranteeTimeframe: 'ONE_MONTH',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      requirements: JSON.stringify([
        '3+ years data science experience',
        'Python and R proficiency',
        'ML frameworks (TensorFlow, PyTorch)',
        'PhD or Masters in related field'
      ]),
      interviewProcess: '3 rounds: Technical assessment, ML case study, Team interview',
      guidelines: 'We prefer candidates with experience in financial modeling and risk assessment.',
      status: 'OPEN',
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })