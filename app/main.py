from fastapi import FastAPI
from fastapi.responses import HTMLResponse

from app.api.auth import router as auth_router
from app.db.database import engine
from app.models.user import Base

app = FastAPI(title="CloudTask Pro API")


def build_homepage() -> str:
    return """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CloudTask Pro | Production-Grade Cloud SaaS</title>
  <meta name="description" content="CloudTask Pro is a production-grade task management SaaS designed to showcase AWS cloud architecture, security, scaling, and deployment best practices." />
  <style>
    :root {
      --bg: #07111f;
      --bg-soft: #0d1b2d;
      --panel: rgba(10, 22, 37, 0.74);
      --panel-strong: rgba(14, 28, 47, 0.94);
      --text: #edf5ff;
      --muted: #9db2ca;
      --line: rgba(162, 194, 229, 0.16);
      --accent: #4fd1c5;
      --accent-2: #7c8cff;
      --accent-3: #f59e0b;
      --success: #22c55e;
      --shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
      --radius: 24px;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(124, 140, 255, 0.24), transparent 32%),
        radial-gradient(circle at top right, rgba(79, 209, 197, 0.14), transparent 28%),
        linear-gradient(180deg, #050b14 0%, #08111d 38%, #050b14 100%);
      min-height: 100vh;
    }

    .noise {
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: 0.12;
      background-image:
        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 64px 64px;
      mask-image: radial-gradient(circle at center, black 32%, transparent 100%);
    }

    .wrap {
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding: 22px 0;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      letter-spacing: 0.2px;
    }

    .brand-badge {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(79, 209, 197, 1), rgba(124, 140, 255, 1));
      display: grid;
      place-items: center;
      color: #05111c;
      box-shadow: 0 12px 30px rgba(79, 209, 197, 0.35);
    }

    .nav {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      color: var(--muted);
      font-size: 0.95rem;
    }

    .nav a {
      color: inherit;
      text-decoration: none;
    }

    .hero {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 28px;
      align-items: center;
      padding: 28px 0 36px;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      border: 1px solid rgba(79, 209, 197, 0.25);
      color: #b6fff5;
      background: rgba(79, 209, 197, 0.08);
      padding: 10px 14px;
      border-radius: 999px;
      font-size: 0.84rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    h1 {
      font-size: clamp(3rem, 6vw, 5.6rem);
      line-height: 0.96;
      margin: 18px 0 18px;
      letter-spacing: -0.06em;
      max-width: 11ch;
    }

    .lede {
      max-width: 58ch;
      font-size: 1.08rem;
      line-height: 1.7;
      color: var(--muted);
      margin: 0 0 24px;
    }

    .cta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-bottom: 26px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 18px;
      border-radius: 14px;
      text-decoration: none;
      font-weight: 700;
      border: 1px solid transparent;
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
    }

    .btn:hover { transform: translateY(-1px); }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      color: #04111b;
      box-shadow: 0 14px 34px rgba(79, 209, 197, 0.24);
    }
    .btn-secondary {
      background: rgba(10, 22, 37, 0.5);
      color: var(--text);
      border-color: var(--line);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }
    .stat {
      background: rgba(10, 22, 37, 0.56);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 16px;
    }
    .stat strong {
      display: block;
      font-size: 1.3rem;
      margin-bottom: 6px;
    }
    .stat span {
      color: var(--muted);
      font-size: 0.92rem;
      line-height: 1.5;
    }

    .hero-card {
      background: linear-gradient(180deg, rgba(15, 28, 49, 0.92), rgba(8, 16, 28, 0.95));
      border: 1px solid rgba(148, 163, 184, 0.16);
      border-radius: 28px;
      padding: 18px;
      box-shadow: var(--shadow);
      position: relative;
      overflow: hidden;
    }
    .hero-card::before {
      content: "";
      position: absolute;
      inset: -1px;
      background: linear-gradient(135deg, rgba(79, 209, 197, 0.14), transparent 32%, rgba(124, 140, 255, 0.18));
      pointer-events: none;
    }

    .dashboard {
      position: relative;
      display: grid;
      gap: 14px;
      z-index: 1;
    }

    .mini-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 14px;
    }

    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 16px;
      backdrop-filter: blur(18px);
    }

    .panel h3, .section h2 {
      margin: 0 0 10px;
      letter-spacing: -0.03em;
    }
    .panel p, .section p {
      margin: 0;
      color: var(--muted);
      line-height: 1.65;
    }

    .task-list {
      display: grid;
      gap: 12px;
      margin-top: 14px;
    }
    .task {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      padding: 14px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.05);
    }
    .task small { color: var(--muted); display: block; margin-top: 4px; }
    .pill {
      font-size: 0.78rem;
      padding: 7px 10px;
      border-radius: 999px;
      background: rgba(79, 209, 197, 0.12);
      color: #8ffff2;
      white-space: nowrap;
    }
    .pill.warn { background: rgba(245, 158, 11, 0.14); color: #ffd48a; }
    .pill.ok { background: rgba(34, 197, 94, 0.14); color: #97f5b8; }

    .section {
      padding: 24px 0;
    }

    .section-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 16px;
      margin-top: 18px;
    }

    .feature, .stack-card, .architecture, .timeline, .checklist {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 22px;
      padding: 18px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
    }

    .feature { grid-column: span 4; min-height: 164px; }
    .feature h3 { margin-top: 12px; }
    .icon {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(124, 140, 255, 0.2), rgba(79, 209, 197, 0.15));
      border: 1px solid rgba(255,255,255,0.08);
      font-size: 1.2rem;
    }

    .architecture { grid-column: span 7; }
    .stack-card { grid-column: span 5; }
    .timeline { grid-column: span 6; }
    .checklist { grid-column: span 6; }

    .diagram {
      display: grid;
      gap: 12px;
      margin-top: 16px;
    }
    .node {
      padding: 14px 16px;
      border-radius: 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
    }
    .node span { color: var(--muted); }

    .stack {
      display: grid;
      gap: 12px;
      margin-top: 16px;
    }
    .stack-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 14px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
    }
    .stack-item b { display: block; margin-bottom: 4px; }
    .stack-item p { font-size: 0.92rem; }

    .timeline ol, .checklist ul {
      margin: 14px 0 0;
      padding-left: 18px;
      color: var(--muted);
      line-height: 1.8;
    }

    .footer {
      padding: 24px 0 40px;
      color: var(--muted);
      text-align: center;
    }

    @media (max-width: 960px) {
      .hero { grid-template-columns: 1fr; }
      .feature { grid-column: span 6; }
      .architecture, .stack-card, .timeline, .checklist { grid-column: span 12; }
    }

    @media (max-width: 720px) {
      .topbar, .nav, .cta-row { align-items: flex-start; }
      .stats, .mini-grid, .feature { grid-template-columns: 1fr; grid-column: span 12; }
      h1 { max-width: 100%; }
      .hero-card { padding: 14px; }
      .task { align-items: flex-start; flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="noise"></div>
  <main class="wrap">
    <header class="topbar">
      <div class="brand">
        <div class="brand-badge">CT</div>
        <div>
          <div>CloudTask Pro</div>
          <small style="color: var(--muted); font-weight: 500;">Production-grade scalable task management SaaS</small>
        </div>
      </div>
      <nav class="nav">
        <a href="#features">Features</a>
        <a href="#architecture">Architecture</a>
        <a href="#stack">Stack</a>
        <a href="#delivery">Delivery</a>
      </nav>
    </header>

    <section class="hero">
      <div>
        <div class="eyebrow">AWS Cloud Portfolio Project</div>
        <h1>Ship a cloud app that looks and feels enterprise-ready.</h1>
        <p class="lede">
          CloudTask Pro is designed as a polished SaaS showcase for AWS Solutions Architect Associate concepts:
          frontend delivery through S3 and CloudFront, secure networking in a VPC, EC2 Auto Scaling for backend API
          capacity, managed PostgreSQL with RDS, and CI/CD with Terraform-first infrastructure.
        </p>
        <div class="cta-row">
          <a class="btn btn-primary" href="#architecture">Explore Architecture</a>
          <a class="btn btn-secondary" href="#delivery">See Build Plan</a>
        </div>
        <div class="stats">
          <div class="stat">
            <strong>99.9%</strong>
            <span>Designed for high availability across public and private subnets.</span>
          </div>
          <div class="stat">
            <strong>Auto Scaling</strong>
            <span>Backend API capacity scales with demand behind an Application Load Balancer.</span>
          </div>
          <div class="stat">
            <strong>Terraform</strong>
            <span>Infrastructure is defined as code for repeatable environments and learning.</span>
          </div>
        </div>
      </div>

      <div class="hero-card">
        <div class="dashboard">
          <div class="mini-grid">
            <div class="panel">
              <h3>Command Center</h3>
              <p>Live operational snapshot for a task management SaaS.</p>
              <div class="task-list">
                <div class="task">
                  <div>
                    <strong>Launch landing page</strong>
                    <small>CloudFront cache warm-up completed</small>
                  </div>
                  <div class="pill ok">Healthy</div>
                </div>
                <div class="task">
                  <div>
                    <strong>Deploy API service</strong>
                    <small>EC2 instances registered with target group</small>
                  </div>
                  <div class="pill">Scaled</div>
                </div>
                <div class="task">
                  <div>
                    <strong>Database connection</strong>
                    <small>RDS PostgreSQL in private subnet</small>
                  </div>
                  <div class="pill warn">Secure</div>
                </div>
              </div>
            </div>
            <div class="panel">
              <h3>Signal</h3>
              <p>Metrics aligned to the story you can explain in interviews.</p>
              <div style="display:grid; gap:12px; margin-top:14px;">
                <div class="node"><strong>CPU</strong><span>42%</span></div>
                <div class="node"><strong>Latency</strong><span>128ms</span></div>
                <div class="node"><strong>Requests</strong><span>18.4k</span></div>
                <div class="node"><strong>Health</strong><span>Passing</span></div>
              </div>
            </div>
          </div>
          <div class="panel">
            <h3>Release Story</h3>
            <p>
              Users hit CloudFront, assets are served from S3, API traffic routes through an ALB to private EC2
              instances, and the app persists data in PostgreSQL RDS. This is the kind of architecture that signals
              cloud maturity.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="features">
      <h2>What makes it feel premium</h2>
      <p>A modern interface hierarchy that sells the project, not just the tech stack.</p>
      <div class="section-grid">
        <div class="feature">
          <div class="icon">✦</div>
          <h3>Sharp product narrative</h3>
          <p>Clear positioning, outcome-driven copy, and architecture that reads like a real SaaS product.</p>
        </div>
        <div class="feature">
          <div class="icon">↗</div>
          <h3>Enterprise visual language</h3>
          <p>Glass panels, layered gradients, and high-contrast metric blocks create a polished cloud dashboard feel.</p>
        </div>
        <div class="feature">
          <div class="icon">⚡</div>
          <h3>Interview-ready proof points</h3>
          <p>The page turns every architecture component into a story you can confidently present to recruiters.</p>
        </div>
      </div>
    </section>

    <section class="section" id="architecture">
      <div class="section-grid">
        <div class="architecture">
          <h2>Reference architecture</h2>
          <p>
            A production-style AWS deployment pattern with secure separation between presentation, application, and
            data tiers.
          </p>
          <div class="diagram">
            <div class="node"><strong>Users</strong><span>Browser traffic</span></div>
            <div class="node"><strong>CloudFront + S3</strong><span>Frontend delivery</span></div>
            <div class="node"><strong>Application Load Balancer</strong><span>SSL termination and routing</span></div>
            <div class="node"><strong>Auto Scaling Group on EC2</strong><span>FastAPI backend in private subnets</span></div>
            <div class="node"><strong>RDS PostgreSQL</strong><span>Managed database in DB subnet group</span></div>
          </div>
        </div>
        <div class="stack-card" id="stack">
          <h2>Stack map</h2>
          <p>Everything you need for a credible cloud resume project.</p>
          <div class="stack">
            <div class="stack-item">
              <div><b>Frontend</b><p>React + TypeScript, static hosting on S3</p></div>
              <span class="pill">CDN</span>
            </div>
            <div class="stack-item">
              <div><b>Backend</b><p>FastAPI, SQLAlchemy, Dockerized API service</p></div>
              <span class="pill">EC2</span>
            </div>
            <div class="stack-item">
              <div><b>Database</b><p>PostgreSQL on RDS with private access only</p></div>
              <span class="pill">RDS</span>
            </div>
            <div class="stack-item">
              <div><b>Security</b><p>Security groups, VPC segmentation, NAT gateway</p></div>
              <span class="pill">VPC</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="delivery">
      <div class="section-grid">
        <div class="timeline">
          <h2>Implementation path</h2>
          <p>Use this as your build sequence when you deploy it yourself.</p>
          <ol>
            <li>Build the UI and backend API locally.</li>
            <li>Containerize the API and publish the image.</li>
            <li>Provision VPC, subnets, security groups, ALB, EC2, and RDS with Terraform.</li>
            <li>Host the frontend on S3 and front it with CloudFront.</li>
            <li>Add GitHub Actions for test, build, and deploy automation.</li>
          </ol>
        </div>
        <div class="checklist">
          <h2>Resume highlights</h2>
          <p>These are the lines you can confidently claim once deployed.</p>
          <ul>
            <li>Built a highly available cloud-native task management SaaS on AWS.</li>
            <li>Hosted the frontend on S3 and accelerated delivery with CloudFront.</li>
            <li>Deployed a FastAPI backend on EC2 with Auto Scaling and an ALB.</li>
            <li>Secured application and database traffic using VPC segmentation and security groups.</li>
            <li>Provisioned infrastructure using Terraform and prepared CI/CD with GitHub Actions.</li>
          </ul>
        </div>
      </div>
    </section>

    <div class="footer">
      CloudTask Pro demonstrates the core AWS architecture story in a clean, senior-level product presentation.
    </div>
  </main>
</body>
</html>
    """


@app.get("/", response_class=HTMLResponse)
def root() -> str:
    return build_homepage()


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/db-check")
def db_check():
    try:
        connection = engine.connect()
        connection.close()
        return {"database": "connected"}
    except Exception as exc:
        return {"error": str(exc)}


Base.metadata.create_all(bind=engine)
app.include_router(auth_router)
