// lib/careerData.js
const CAREER_ROLES = {
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git"],
  "Backend Developer": ["Java", "Spring Boot", "SQL", "APIs", "Git"],
  "Data Analyst": ["Excel", "SQL", "Python", "Dashboards", "Statistics"],
  "Full Stack Developer": ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Git", "APIs"],
  "DevOps Engineer": ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Git"]
};

const ROADMAPS = {
  "Frontend Developer": [
    { 
      phase: "Phase 1 (1-2 months)", 
      duration: "1-2 months",
      skills: ["HTML basics", "CSS fundamentals", "JavaScript ES6", "Git basics"],
      description: "Build a strong foundation in web fundamentals"
    },
    { 
      phase: "Phase 2 (2-3 months)", 
      duration: "2-3 months",
      skills: ["React fundamentals", "Component design", "State management", "API integration"],
      description: "Master modern frontend framework and state management"
    },
    { 
      phase: "Phase 3 (1-2 months)", 
      duration: "1-2 months",
      skills: ["Advanced React patterns", "Testing", "Performance optimization", "Build real projects"],
      description: "Apply advanced concepts and build portfolio projects"
    }
  ],
  "Backend Developer": [
    { 
      phase: "Phase 1 (1-2 months)", 
      duration: "1-2 months",
      skills: ["Java basics", "OOP concepts", "Git version control"],
      description: "Learn programming fundamentals and version control"
    },
    { 
      phase: "Phase 2 (2 months)", 
      duration: "2 months",
      skills: ["Spring Boot framework", "SQL databases", "REST APIs", "Authentication"],
      description: "Master backend frameworks and database management"
    },
    { 
      phase: "Phase 3 (1-2 months)", 
      duration: "1-2 months",
      skills: ["Deployment strategies", "System design basics", "Build portfolio projects"],
      description: "Learn deployment and build production-ready applications"
    }
  ],
  "Data Analyst": [
    { 
      phase: "Phase 1 (1-2 months)", 
      duration: "1-2 months",
      skills: ["Excel advanced formulas", "SQL queries", "Data cleaning basics"],
      description: "Master data manipulation and analysis tools"
    },
    { 
      phase: "Phase 2 (2-3 months)", 
      duration: "2-3 months",
      skills: ["Python for data analysis", "Pandas & NumPy", "Data visualization", "Statistics"],
      description: "Learn programming for data analysis and visualization"
    },
    { 
      phase: "Phase 3 (1-2 months)", 
      duration: "1-2 months",
      skills: ["Dashboard creation", "Business intelligence tools", "Real-world projects"],
      description: "Create professional dashboards and complete projects"
    }
  ],
  "Full Stack Developer": [
    { 
      phase: "Phase 1 (2 months)", 
      duration: "2 months",
      skills: ["HTML/CSS/JavaScript", "React basics", "Node.js fundamentals", "Git"],
      description: "Learn both frontend and backend basics"
    },
    { 
      phase: "Phase 2 (3 months)", 
      duration: "3 months",
      skills: ["Advanced React", "Express.js APIs", "SQL databases", "Authentication & Authorization"],
      description: "Master full-stack development with authentication"
    },
    { 
      phase: "Phase 3 (2 months)", 
      duration: "2 months",
      skills: ["Deployment & DevOps", "Testing", "System design", "Full-stack projects"],
      description: "Deploy complete applications and build portfolio"
    }
  ],
  "DevOps Engineer": [
    { 
      phase: "Phase 1 (1-2 months)", 
      duration: "1-2 months",
      skills: ["Linux fundamentals", "Shell scripting", "Git workflows", "Networking basics"],
      description: "Build strong foundation in Linux and networking"
    },
    { 
      phase: "Phase 2 (2-3 months)", 
      duration: "2-3 months",
      skills: ["Docker containers", "CI/CD pipelines", "AWS services", "Infrastructure as Code"],
      description: "Master containerization and cloud infrastructure"
    },
    { 
      phase: "Phase 3 (1-2 months)", 
      duration: "1-2 months",
      skills: ["Kubernetes orchestration", "Monitoring & logging", "Security practices", "Real-world deployments"],
      description: "Implement enterprise-level DevOps practices"
    }
  ]
};

module.exports = {
  CAREER_ROLES,
  ROADMAPS
};