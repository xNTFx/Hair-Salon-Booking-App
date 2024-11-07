import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: {{ team.POSTGRES_USER }},
  host: {{ team.HOST }},
  database: {{ project.DB_NAME }},
  password: {{ team.POSTGRES_PASSWORD }},
  port: {{ team.POSTGRES_PORT }},
});

export default pool;
