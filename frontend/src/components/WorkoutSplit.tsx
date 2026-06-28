/* ===== GLOBAL DARK THEME ===== */

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #09090b;
  color: #f4f4f5;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

/* ===== MAIN APP LAYOUT ===== */

.app {
  min-height: 100vh;
  display: flex;
  background:
    radial-gradient(circle at top left, rgba(16, 185, 129, 0.08), transparent 28%),
    #09090b;
}

/* Sidebar style like Base44 */
.sidebar {
  width: 260px;
  min-height: 100vh;
  padding: 28px 20px;
  background: rgba(15, 15, 18, 0.95);
  border-right: 1px solid #27272a;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.logo {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #f4f4f5;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav a,
.nav button {
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border-radius: 12px;
  color: #a1a1aa;
  text-decoration: none;
  background: transparent;
  border: none;
  font-weight: 600;
  transition: 0.2s ease;
}

.nav a:hover,
.nav button:hover {
  background: #18181b;
  color: #f4f4f5;
}

.nav a.active,
.nav button.active {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
}

.main {
  flex: 1;
  padding: 40px 32px;
  max-width: 1000px;
}

/* If your app still uses top nav */
header,
.navbar {
  background: transparent;
  border-bottom: 1px solid #27272a;
  padding: 22px 32px;
}

header h1,
.navbar h1 {
  color: #f4f4f5;
  margin: 0;
}

nav {
  display: flex;
  gap: 12px;
  justify-content: center;
}

nav a,
nav button {
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: #a1a1aa;
  font-weight: 700;
  text-decoration: none;
}

nav a:hover,
nav button:hover,
nav a.active,
nav button.active {
  background: #10b981;
  color: #09090b;
}

/* ===== SHARED CARDS ===== */

.card {
  background: rgba(24, 24, 27, 0.72);
  border: 1px solid rgba(63, 63, 70, 0.6);
  border-radius: 22px;
  padding: 28px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.card h2 {
  margin-top: 0;
  color: #f4f4f5;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin: 0;
}

.page-subtitle {
  color: #71717a;
  margin-top: 6px;
  font-size: 15px;
}

/* ===== LOG WORKOUT PAGE ===== */

.workout-page,
.log-workout-page {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.log-workout-header h1 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin: 0;
}

.log-workout-header p {
  margin: 6px 0 0;
  color: #71717a;
  font-size: 14px;
}

.workout-card {
  background: rgba(24, 24, 27, 0.72);
  border: 1px solid rgba(63, 63, 70, 0.65);
  border-radius: 22px;
  padding: 28px;
}

.workout-card-space {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.workout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.workout-label {
  display: block;
  margin-bottom: 8px;
  font-size: 11px;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
}

.workout-input,
.workout-textarea,
input,
textarea,
select {
  width: 100%;
  background: #121214;
  border: 1px solid #3f3f46;
  color: #e4e4e7;
  border-radius: 12px;
  padding: 13px 16px;
  outline: none;
}

.workout-input::placeholder,
.workout-textarea::placeholder,
input::placeholder,
textarea::placeholder {
  color: #71717a;
}

.workout-input:focus,
.workout-textarea:focus,
input:focus,
textarea:focus,
select:focus {
  border-color: rgba(16, 185, 129, 0.75);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
}

.workout-title-input {
  font-size: 16px;
  font-weight: 600;
}

.workout-textarea {
  resize: none;
  min-height: 92px;
}

.exercises-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.exercises-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.exercises-header h2 {
  margin: 0;
  font-size: 15px;
  color: #d4d4d8;
}

.exercise-count {
  font-size: 12px;
  color: #71717a;
}

.add-exercise-button {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px dashed #3f3f46;
  background: transparent;
  color: #a1a1aa;
  font-weight: 700;
  transition: 0.2s ease;
}

.add-exercise-button:hover {
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.7);
  background: rgba(16, 185, 129, 0.06);
}

.save-workout-button,
button[type="submit"] {
  width: 100%;
  padding: 17px 20px;
  background: #10b981;
  color: #09090b;
  border: none;
  border-radius: 14px;
  font-weight: 800;
  transition: 0.2s ease;
}

.save-workout-button:hover,
button[type="submit"]:hover {
  background: #34d399;
  transform: translateY(-1px);
}

.save-workout-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== EXERCISE INPUT CARDS ===== */

.exercise-card {
  background: rgba(24, 24, 27, 0.72);
  border: 1px solid rgba(63, 63, 70, 0.65);
  border-radius: 18px;
  padding: 18px;
}

.exercise-row {
  display: grid;
  grid-template-columns: 1fr 110px 110px;
  gap: 12px;
  align-items: center;
}

.remove-button {
  background: transparent;
  border: none;
  color: #71717a;
  padding: 8px;
}

.remove-button:hover {
  color: #ef4444;
}

/* ===== HISTORY PAGE ===== */

.history-page {
  max-width: 900px;
  margin: 0 auto;
}

.history-header {
  margin-bottom: 28px;
}

.history-header h1 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin: 0;
}

.history-header p {
  color: #71717a;
  margin-top: 6px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.history-item {
  background: rgba(24, 24, 27, 0.72);
  border: 1px solid rgba(63, 63, 70, 0.6);
  border-radius: 18px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 18px;
}

.history-date {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: #27272a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.history-date span:first-child {
  color: #a1a1aa;
  font-size: 12px;
}

.history-date span:last-child {
  color: #f4f4f5;
  font-weight: 800;
  font-size: 20px;
}

.history-content {
  flex: 1;
}

.history-content strong {
  color: #f4f4f5;
}

.history-meta {
  margin-top: 6px;
  color: #71717a;
  font-size: 13px;
}

/* ===== PROGRESS SECTION ===== */

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress-heading {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
}

.progress-empty {
  margin: 0;
  color: #71717a;
  font-size: 14px;
}

.progress-list {
  display: grid;
  gap: 12px;
}

.progress-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(39, 39, 42, 0.65);
  border: 1px solid rgba(63, 63, 70, 0.55);
}

.progress-info {
  flex: 1;
}

.progress-exercise-name {
  display: block;
  color: #f4f4f5;
  font-size: 15px;
}

.progress-meta {
  margin-top: 4px;
  font-size: 12px;
  color: #71717a;
}

.progress-chart-area {
  width: 160px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-sparkline-line {
  stroke: #10b981;
  stroke-width: 2;
}

.progress-last-weight {
  min-width: 50px;
  text-align: right;
  font-weight: 800;
  color: #34d399;
}

/* ===== MOBILE ===== */

@media (max-width: 768px) {
  .app {
    display: block;
  }

  .sidebar {
    width: 100%;
    min-height: auto;
    border-right: none;
    border-bottom: 1px solid #27272a;
  }

  .nav {
    flex-direction: row;
    overflow-x: auto;
  }

  .main {
    padding: 28px 18px;
  }

  .workout-grid,
  .exercise-row {
    grid-template-columns: 1fr;
  }

  .history-item {
    align-items: flex-start;
  }

  .progress-row {
    flex-direction: column;
    align-items: stretch;
  }

  .progress-chart-area {
    width: 100%;
    justify-content: space-between;
  }
}