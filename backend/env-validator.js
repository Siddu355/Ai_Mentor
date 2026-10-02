const REQUIRED_ENV_VARS = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  {
    key: "JWT_SECRET",
    hint: "Secret key used to sign JWT tokens (use a long random string)",
    group: "Auth",
  },

  // ── Cloudinary ────────────────────────────────────────────────────────────
  {
    key: "CLOUDINARY_CLOUD_NAME",
    hint: "Cloudinary cloud name from your dashboard",
    group: "Cloudinary",
  },
  {
    key: "CLOUDINARY_API_KEY",
    hint: "Cloudinary API key from your dashboard",
    group: "Cloudinary",
  },
  {
    key: "CLOUDINARY_API_SECRET",
    hint: "Cloudinary API secret from your dashboard",
    group: "Cloudinary",
  },

  // ── Email ─────────────────────────────────────────────────────────────────
  {
    key: "SMTP_HOST",
    hint: "SMTP server host (e.g. smtp.gmail.com)",
    group: "Email",
  },
  {
    key: "SMTP_PORT",
    hint: "SMTP server port (e.g. 587 or 465)",
    group: "Email",
  },
  {
    key: "SMTP_USER",
    hint: "SMTP login email address",
    group: "Email",
  },
  {
    key: "SMTP_PASS",
    hint: "SMTP login password or app password",
    group: "Email",
  },
  {
    key: "FROM_EMAIL",
    hint: "Sender email address shown to recipients",
    group: "Email",
  },
  {
    key: "FROM_NAME",
    hint: "Sender name shown to recipients (e.g. AI Mentor)",
    group: "Email",
  },

  // ── Frontend ──────────────────────────────────────────────────────────────
  {
    key: "FRONTEND_URL",
    hint: "Frontend URL for CORS (e.g. http://localhost:5173)",
    group: "Frontend",
  },

  // ── Stripe ────────────────────────────────────────────────────────────────
  {
    key: "STRIPE_SECRET_KEY",
    hint:
      "Stripe secret key from your Stripe dashboard (starts with sk_test_ or sk_live_)",
    group: "Stripe",
  },
  {
    key: "STRIPE_WEBHOOK_SECRET",
    hint:
      "Stripe webhook secret from your Stripe dashboard (starts with whsec_)",
    group: "Stripe",
  },

  // ── Razorpay ──────────────────────────────────────────────────────────────
  {
    key: "RAZORPAY_KEY_ID",
    hint:
      "Razorpay Key ID from Razorpay Dashboard → Account & Settings → API Keys",
    group: "Razorpay",
  },
  {
    key: "RAZORPAY_KEY_SECRET",
    hint:
      "Razorpay Key Secret from Razorpay Dashboard → Account & Settings → API Keys",
    group: "Razorpay",
  },
];

const PLACEHOLDER_PATTERNS = [
  /^your_/i,
  /^your-/i,
  /^<.+>$/i,
  /^placeholder/i,
  /^changeme/i,
  /^xxx/i,
  /^rzp_test_your_key_here$/i,
];

// ── ANSI colours ─────────────────────────────────────────────────────────────
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

/**
 * Validate backend environment variables.
 *
 * Database:
 * - If NEON_DATABASE_URL exists, Neon PostgreSQL is used.
 * - If NEON_DATABASE_URL is empty, local PostgreSQL is used.
 *
 * Local PostgreSQL:
 * - DB_NAME
 * - DB_USER
 * - DB_PASSWORD
 * - DB_HOST
 * - DB_PORT
 */
export function validateEnv() {
  const missing = [];
  const placeholders = [];

  // ─────────────────────────────────────────────────────────────────────────
  // DATABASE VALIDATION
  // ─────────────────────────────────────────────────────────────────────────

  const neonDatabaseUrl = process.env.NEON_DATABASE_URL?.trim();

  if (neonDatabaseUrl) {
    const invalidNeonUrl =
      PLACEHOLDER_PATTERNS.some((re) => re.test(neonDatabaseUrl)) ||
      neonDatabaseUrl.includes("your_password") ||
      neonDatabaseUrl.includes("your_host") ||
      neonDatabaseUrl.includes("your_db");

    if (invalidNeonUrl) {
      placeholders.push({
        key: "NEON_DATABASE_URL",
        hint:
          "Real Neon PostgreSQL connection string, or leave empty to use local PostgreSQL",
        group: "Database",
      });
    }
  } else {
    // Local PostgreSQL
    const localDatabaseVars = [
      {
        key: "DB_NAME",
        hint: "Local PostgreSQL database name",
      },
      {
        key: "DB_USER",
        hint: "Local PostgreSQL username",
      },
      {
        key: "DB_PASSWORD",
        hint: "Local PostgreSQL password",
      },
      {
        key: "DB_HOST",
        hint: "Local PostgreSQL host, normally localhost",
      },
      {
        key: "DB_PORT",
        hint: "Local PostgreSQL port, normally 5432",
      },
    ];

    for (const { key, hint } of localDatabaseVars) {
      const value = process.env[key];

      if (!value || value.trim() === "") {
        missing.push({
          key,
          hint,
          group: "Local PostgreSQL",
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // OTHER ENVIRONMENT VARIABLES
  // ─────────────────────────────────────────────────────────────────────────

  for (const { key, hint, group } of REQUIRED_ENV_VARS) {
    const value = process.env[key];

    if (!value || value.trim() === "") {
      missing.push({
        key,
        hint,
        group,
      });
    } else if (
      PLACEHOLDER_PATTERNS.some((re) => re.test(value.trim()))
    ) {
      placeholders.push({
        key,
        hint,
        group,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DATABASE MODE
  // ─────────────────────────────────────────────────────────────────────────

  if (neonDatabaseUrl) {
    console.log(
      `${GREEN}${BOLD}✔ Database mode: Neon PostgreSQL${RESET}`
    );
  } else {
    console.log(
      `${GREEN}${BOLD}✔ Database mode: Local PostgreSQL${RESET}`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EVERYTHING VALID
  // ─────────────────────────────────────────────────────────────────────────

  if (missing.length === 0 && placeholders.length === 0) {
    console.log(
      `${GREEN}${BOLD}✔ All required environment variables are set correctly.${RESET}`
    );

    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // WARNING BANNER
  // ─────────────────────────────────────────────────────────────────────────

  process.stdout.write("\n");

  process.stdout.write(
    `${BOLD}${YELLOW}══════════════════════════════════════════════════${RESET}\n`
  );

  process.stdout.write(
    `${BOLD}${YELLOW}  ⚠ Environment Variable Warning — Backend${RESET}\n`
  );

  process.stdout.write(
    `${BOLD}${YELLOW}══════════════════════════════════════════════════${RESET}\n\n`
  );

  // ─────────────────────────────────────────────────────────────────────────
  // MISSING VARIABLES
  // ─────────────────────────────────────────────────────────────────────────

  if (missing.length > 0) {
    process.stdout.write(
      `${BOLD}${RED}Missing variable${
        missing.length > 1 ? "s" : ""
      }:${RESET}\n`
    );

    for (const { key, hint, group } of missing) {
      process.stdout.write(
        `  ${RED}✖ ${BOLD}${key}${RESET} ${DIM}[${group}]${RESET}\n`
      );

      process.stdout.write(
        `    ${DIM}→ ${hint}${RESET}\n`
      );
    }

    process.stdout.write("\n");
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PLACEHOLDER VARIABLES
  // ─────────────────────────────────────────────────────────────────────────

  if (placeholders.length > 0) {
    process.stdout.write(
      `${BOLD}${YELLOW}Placeholder value${
        placeholders.length > 1 ? "s" : ""
      } detected:${RESET}\n`
    );

    for (const { key, hint, group } of placeholders) {
      process.stdout.write(
        `  ${YELLOW}⚠ ${BOLD}${key}${RESET}${YELLOW} still has a placeholder value ${DIM}[${group}]${RESET}\n`
      );

      process.stdout.write(
        `    ${DIM}→ Replace it with your real value: ${hint}${RESET}\n`
      );
    }

    process.stdout.write("\n");
  }

  // ─────────────────────────────────────────────────────────────────────────
  // HOW TO FIX
  // ─────────────────────────────────────────────────────────────────────────

  process.stdout.write(`${DIM}How to fix:${RESET}\n`);

  process.stdout.write(
    `  ${DIM}1. Open backend/.env${RESET}\n`
  );

  process.stdout.write(
    `  ${DIM}2. For local PostgreSQL, keep NEON_DATABASE_URL empty${RESET}\n`
  );

  process.stdout.write(
    `  ${DIM}3. Set DB_NAME, DB_USER, DB_PASSWORD, DB_HOST and DB_PORT${RESET}\n`
  );

  process.stdout.write(
    `  ${DIM}4. Replace service placeholders with real credentials when those services are used${RESET}\n`
  );

  process.stdout.write(
    `  ${DIM}5. Restart the server${RESET}\n\n`
  );

  process.stdout.write(
    `${BOLD}${YELLOW}⚠ Server is starting anyway — some features may not work correctly.${RESET}\n\n`
  );

  return false;
}